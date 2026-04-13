import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks must be hoisted before imports ────────────────────────────────────
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    course: { findUnique: vi.fn() },
    enrollment: { findUnique: vi.fn() },
    payment: { create: vi.fn() },
  },
}))

vi.mock('@/lib/razorpay', () => ({
  getRazorpay: vi.fn(),
  verifyPaymentSignature: vi.fn(),
}))

import { POST } from '@/app/api/payments/create-order/route'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getRazorpay } from '@/lib/razorpay'

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/payments/create-order', {
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

function mockNoAuthUser() {
  vi.mocked(createClient).mockResolvedValue({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
  } as never)
}

const MOCK_COURSE = {
  id: 'course_sfm_001',
  title: 'CA Final SFM',
  price: 399900,
  slug: 'ca-final-sfm',
}

const MOCK_RAZORPAY_ORDER = { id: 'order_Razorpay123' }

// ── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/payments/create-order', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default happy-path Razorpay mock
    vi.mocked(getRazorpay).mockReturnValue({
      orders: { create: vi.fn().mockResolvedValue(MOCK_RAZORPAY_ORDER) },
    } as never)
  })

  it('returns 401 when user is not authenticated', async () => {
    mockNoAuthUser()
    const res = await POST(makeRequest({ courseId: 'course_sfm_001' }))
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toBe('Unauthorized')
  })

  it('returns 400 for missing courseId in body', async () => {
    mockAuthUser()
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 400 for empty courseId', async () => {
    mockAuthUser()
    const res = await POST(makeRequest({ courseId: '' }))
    expect(res.status).toBe(400)
  })

  it('returns 404 when course does not exist', async () => {
    mockAuthUser()
    vi.mocked(prisma.course.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue(null)

    const res = await POST(makeRequest({ courseId: 'course_nonexistent' }))
    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json.error).toBe('Course not found')
  })

  it('returns 409 when user is already enrolled', async () => {
    mockAuthUser()
    vi.mocked(prisma.course.findUnique).mockResolvedValue(MOCK_COURSE as never)
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue({
      id: 'enr_existing',
      status: 'ACTIVE',
    } as never)

    const res = await POST(makeRequest({ courseId: 'course_sfm_001' }))
    expect(res.status).toBe(409)
    const json = await res.json()
    expect(json.error).toBe('Already enrolled')
  })

  it('creates order and returns orderId on success', async () => {
    mockAuthUser()
    vi.mocked(prisma.course.findUnique).mockResolvedValue(MOCK_COURSE as never)
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.payment.create).mockResolvedValue({ id: 'pay_db_001' } as never)

    const res = await POST(makeRequest({ courseId: 'course_sfm_001' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.orderId).toBe('order_Razorpay123')
    expect(json.data.amount).toBe(399900)
    expect(json.data.currency).toBe('INR')
  })

  it('persists a Payment record to the database on success', async () => {
    mockAuthUser('user_xyz')
    vi.mocked(prisma.course.findUnique).mockResolvedValue(MOCK_COURSE as never)
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.payment.create).mockResolvedValue({ id: 'pay_db_002' } as never)

    await POST(makeRequest({ courseId: 'course_sfm_001' }))

    expect(prisma.payment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user_xyz',
          courseId: 'course_sfm_001',
          amount: MOCK_COURSE.price,
          status: 'CREATED',
          razorpayOrderId: MOCK_RAZORPAY_ORDER.id,
        }),
      })
    )
  })

  it('returns 500 when Razorpay throws', async () => {
    mockAuthUser()
    vi.mocked(prisma.course.findUnique).mockResolvedValue(MOCK_COURSE as never)
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue(null)
    vi.mocked(getRazorpay).mockReturnValue({
      orders: { create: vi.fn().mockRejectedValue(new Error('Razorpay API down')) },
    } as never)

    const res = await POST(makeRequest({ courseId: 'course_sfm_001' }))
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})
