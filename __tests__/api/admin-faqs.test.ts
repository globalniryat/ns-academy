import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks (hoisted) ───────────────────────────────────────────────────────────
vi.mock('@/lib/admin-auth', () => ({ requireAdmin: vi.fn() }))
vi.mock('@/lib/prisma', () => ({
  prisma: {
    fAQ: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { GET as LIST, POST as CREATE } from '@/app/api/admin/faqs/route'
import { PATCH, DELETE } from '@/app/api/admin/faqs/[id]/route'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ── Helpers ───────────────────────────────────────────────────────────────────

function mockAdmin() {
  vi.mocked(requireAdmin).mockResolvedValue({ userId: 'admin_001' } as never)
}

function mockUnauthorized() {
  vi.mocked(requireAdmin).mockResolvedValue({
    error: new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 }),
  } as never)
}

function makeRequest(method: string, url: string, body?: unknown) {
  return new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
}

const MOCK_FAQ = {
  id: 'faq_001',
  question: 'What is the duration of the CA Final SFM course?',
  answer: 'The course includes over 120 hours of detailed video lectures covering all topics.',
  isActive: true,
  sortOrder: 0,
  createdAt: new Date('2024-01-01'),
}

const VALID_FAQ_BODY = {
  question: 'What is the refund policy?',
  answer: 'We offer a full refund within 7 days of purchase if you are not satisfied with the course.',
  isActive: true,
  sortOrder: 1,
}

const mockParams = { params: Promise.resolve({ id: 'faq_001' }) }

// ── GET /api/admin/faqs (list) ────────────────────────────────────────────────

describe('GET /api/admin/faqs', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await LIST()
    expect(res.status).toBe(401)
  })

  it('returns all FAQs ordered by sortOrder', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.findMany).mockResolvedValue([MOCK_FAQ] as never)

    const res = await LIST()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].question).toBe('What is the duration of the CA Final SFM course?')
  })

  it('queries FAQs ordered by sortOrder ascending', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.findMany).mockResolvedValue([])

    await LIST()

    expect(prisma.fAQ.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { sortOrder: 'asc' } })
    )
  })

  it('returns empty array when no FAQs exist', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.findMany).mockResolvedValue([])

    const res = await LIST()
    const json = await res.json()
    expect(json.data).toEqual([])
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.findMany).mockRejectedValue(new Error('DB error'))

    const res = await LIST()
    expect(res.status).toBe(500)
  })
})

// ── POST /api/admin/faqs (create) ─────────────────────────────────────────────

describe('POST /api/admin/faqs', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await CREATE(makeRequest('POST', 'http://localhost/api/admin/faqs', VALID_FAQ_BODY))
    expect(res.status).toBe(401)
  })

  it('returns 400 when question is too short (< 5 chars)', async () => {
    mockAdmin()
    const res = await CREATE(makeRequest('POST', 'http://localhost/api/admin/faqs', {
      ...VALID_FAQ_BODY,
      question: 'Why',
    }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 400 when answer is too short (< 10 chars)', async () => {
    mockAdmin()
    const res = await CREATE(makeRequest('POST', 'http://localhost/api/admin/faqs', {
      ...VALID_FAQ_BODY,
      answer: 'Short',
    }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when question is missing', async () => {
    mockAdmin()
    const res = await CREATE(makeRequest('POST', 'http://localhost/api/admin/faqs', {
      answer: VALID_FAQ_BODY.answer,
    }))
    expect(res.status).toBe(400)
  })

  it('creates FAQ and returns 201', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.create).mockResolvedValue(MOCK_FAQ as never)

    const res = await CREATE(makeRequest('POST', 'http://localhost/api/admin/faqs', VALID_FAQ_BODY))
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('faq_001')
  })

  it('calls revalidatePath("/") to refresh public homepage', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.create).mockResolvedValue(MOCK_FAQ as never)

    await CREATE(makeRequest('POST', 'http://localhost/api/admin/faqs', VALID_FAQ_BODY))

    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.create).mockRejectedValue(new Error('DB error'))

    const res = await CREATE(makeRequest('POST', 'http://localhost/api/admin/faqs', VALID_FAQ_BODY))
    expect(res.status).toBe(500)
  })
})

// ── PATCH /api/admin/faqs/[id] ────────────────────────────────────────────────

describe('PATCH /api/admin/faqs/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const req = makeRequest('PATCH', 'http://localhost/api/admin/faqs/faq_001', { isActive: false })
    const res = await PATCH(req, mockParams)
    expect(res.status).toBe(401)
  })

  it('updates FAQ visibility (isActive toggle)', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.update).mockResolvedValue({ ...MOCK_FAQ, isActive: false } as never)

    const req = makeRequest('PATCH', 'http://localhost/api/admin/faqs/faq_001', { isActive: false })
    const res = await PATCH(req, mockParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('allows partial update (only question)', async () => {
    mockAdmin()
    const updated = { ...MOCK_FAQ, question: 'Updated question with enough length?' }
    vi.mocked(prisma.fAQ.update).mockResolvedValue(updated as never)

    const req = makeRequest('PATCH', 'http://localhost/api/admin/faqs/faq_001', {
      question: 'Updated question with enough length?',
    })
    const res = await PATCH(req, mockParams)
    expect(res.status).toBe(200)
  })

  it('calls prisma.fAQ.update with correct id and data', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.update).mockResolvedValue(MOCK_FAQ as never)

    const req = makeRequest('PATCH', 'http://localhost/api/admin/faqs/faq_001', { isActive: false })
    await PATCH(req, mockParams)

    expect(prisma.fAQ.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'faq_001' },
        data: expect.objectContaining({ isActive: false }),
      })
    )
  })

  it('calls revalidatePath("/") on successful update', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.update).mockResolvedValue(MOCK_FAQ as never)

    const req = makeRequest('PATCH', 'http://localhost/api/admin/faqs/faq_001', { isActive: false })
    await PATCH(req, mockParams)

    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.update).mockRejectedValue(new Error('DB error'))

    const req = makeRequest('PATCH', 'http://localhost/api/admin/faqs/faq_001', { isActive: false })
    const res = await PATCH(req, mockParams)
    expect(res.status).toBe(500)
  })
})

// ── DELETE /api/admin/faqs/[id] ───────────────────────────────────────────────

describe('DELETE /api/admin/faqs/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(401)
  })

  it('deletes FAQ and returns success', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.delete).mockResolvedValue(MOCK_FAQ as never)

    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('calls prisma.fAQ.delete with correct id', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.delete).mockResolvedValue(MOCK_FAQ as never)

    await DELETE(new Request('http://localhost'), mockParams)

    expect(prisma.fAQ.delete).toHaveBeenCalledWith({ where: { id: 'faq_001' } })
  })

  it('calls revalidatePath("/") after deletion', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.delete).mockResolvedValue(MOCK_FAQ as never)

    await DELETE(new Request('http://localhost'), mockParams)

    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.fAQ.delete).mockRejectedValue(new Error('DB error'))

    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(500)
  })
})
