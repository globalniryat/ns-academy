import { describe, it, expect, vi, beforeEach } from 'vitest'
import crypto from 'crypto'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    payment: { updateMany: vi.fn() },
    enrollment: { upsert: vi.fn() },
  },
}))

// We mock the Razorpay SDK but NOT verifyPaymentSignature — we test the real crypto logic
vi.mock('@/lib/razorpay', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/razorpay')>()
  return {
    ...actual, // keeps real verifyPaymentSignature
    getRazorpay: vi.fn(),
  }
})

import { POST } from '@/app/api/payments/verify/route'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// ── Helpers ──────────────────────────────────────────────────────────────────

const SECRET = process.env.RAZORPAY_KEY_SECRET!

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/payments/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function mockAuthUser(userId = 'user_abc123') {
  vi.mocked(createClient).mockResolvedValue({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: userId } } }) },
  } as never)
}

function mockNoAuth() {
  vi.mocked(createClient).mockResolvedValue({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
  } as never)
}

function buildValidPayload(orderId: string, paymentId: string, courseId = 'course_sfm_001') {
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
  return { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature, courseId }
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/payments/verify', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 for unauthenticated request', async () => {
    mockNoAuth()
    const res = await POST(makeRequest(buildValidPayload('order_X', 'pay_Y')))
    expect(res.status).toBe(401)
  })

  it('returns 400 for missing required fields', async () => {
    mockAuthUser()
    const res = await POST(makeRequest({ razorpay_order_id: 'order_X' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 and marks payment FAILED when signature is invalid', async () => {
    mockAuthUser()
    const payload = {
      razorpay_order_id: 'order_Test123',
      razorpay_payment_id: 'pay_Test456',
      razorpay_signature: 'invalid_signature_here',
      courseId: 'course_sfm_001',
    }

    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toBe('Payment verification failed')

    // Should have updated the payment record to FAILED
    expect(prisma.payment.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'FAILED', failureReason: 'Invalid signature' }),
      })
    )
  })

  it('returns 200 and creates enrollment on valid signature', async () => {
    mockAuthUser('user_student')
    vi.mocked(prisma.payment.updateMany).mockResolvedValue({ count: 1 } as never)
    vi.mocked(prisma.enrollment.upsert).mockResolvedValue({ id: 'enr_001', status: 'ACTIVE' } as never)

    const payload = buildValidPayload('order_Valid123', 'pay_Valid456', 'course_sfm_001')
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('updates payment to CAPTURED with correct paymentId and signature on success', async () => {
    mockAuthUser('user_student')
    vi.mocked(prisma.payment.updateMany).mockResolvedValue({ count: 1 } as never)
    vi.mocked(prisma.enrollment.upsert).mockResolvedValue({ id: 'enr_001' } as never)

    const payload = buildValidPayload('order_Cap123', 'pay_Cap456')
    await POST(makeRequest(payload))

    expect(prisma.payment.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'CAPTURED',
          razorpayPaymentId: payload.razorpay_payment_id,
          razorpaySignature: payload.razorpay_signature,
        }),
      })
    )
  })

  it('upserts enrollment idempotently (does not fail if already enrolled)', async () => {
    mockAuthUser()
    vi.mocked(prisma.payment.updateMany).mockResolvedValue({ count: 1 } as never)
    vi.mocked(prisma.enrollment.upsert).mockResolvedValue({ id: 'enr_existing' } as never)

    const payload = buildValidPayload('order_Idem1', 'pay_Idem1')
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(200)

    // upsert should be called even when enrollment exists
    expect(prisma.enrollment.upsert).toHaveBeenCalledTimes(1)
  })

  it('returns 500 when database throws', async () => {
    mockAuthUser()
    vi.mocked(prisma.payment.updateMany).mockRejectedValue(new Error('DB error'))

    const payload = buildValidPayload('order_DBErr', 'pay_DBErr')
    const res = await POST(makeRequest(payload))
    expect(res.status).toBe(500)
  })
})
