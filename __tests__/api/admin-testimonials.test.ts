import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks (hoisted) ───────────────────────────────────────────────────────────
vi.mock('@/lib/admin-auth', () => ({ requireAdmin: vi.fn() }))
vi.mock('@/lib/prisma', () => ({
  prisma: {
    testimonial: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { GET as LIST, POST as CREATE } from '@/app/api/admin/testimonials/route'
import { PATCH, DELETE } from '@/app/api/admin/testimonials/[id]/route'
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

const MOCK_TESTIMONIAL = {
  id: 'tmn_001',
  name: 'Priya Sharma',
  college: 'ICAI Mumbai',
  role: 'CA Student',
  quote: 'NS Academy helped me clear CA Final in my first attempt. The study material is excellent and the faculty explains complex topics very clearly.',
  rating: 5,
  avatarUrl: null,
  isActive: true,
  sortOrder: 0,
  createdAt: new Date('2024-03-01'),
}

const VALID_TESTIMONIAL_BODY = {
  name: 'Ankit Patel',
  college: 'ICAI Ahmedabad',
  role: 'CA Finalist',
  quote: 'This platform helped me understand SFM concepts thoroughly with detailed explanations.',
  rating: 5,
  isActive: true,
  sortOrder: 1,
}

const mockParams = { params: Promise.resolve({ id: 'tmn_001' }) }

// ── GET /api/admin/testimonials (list) ────────────────────────────────────────

describe('GET /api/admin/testimonials', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await LIST()
    expect(res.status).toBe(401)
  })

  it('returns all testimonials for admin', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.findMany).mockResolvedValue([MOCK_TESTIMONIAL] as never)

    const res = await LIST()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].name).toBe('Priya Sharma')
  })

  it('queries testimonials ordered by sortOrder ascending', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.findMany).mockResolvedValue([])

    await LIST()

    expect(prisma.testimonial.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { sortOrder: 'asc' } })
    )
  })

  it('returns empty array when no testimonials exist', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.findMany).mockResolvedValue([])

    const res = await LIST()
    const json = await res.json()
    expect(json.data).toEqual([])
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.findMany).mockRejectedValue(new Error('DB error'))

    const res = await LIST()
    expect(res.status).toBe(500)
  })
})

// ── POST /api/admin/testimonials (create) ─────────────────────────────────────

describe('POST /api/admin/testimonials', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await CREATE(makeRequest('POST', 'http://localhost/api/admin/testimonials', VALID_TESTIMONIAL_BODY))
    expect(res.status).toBe(401)
  })

  it('returns 400 when name is too short (< 2 chars)', async () => {
    mockAdmin()
    const res = await CREATE(makeRequest('POST', 'http://localhost/api/admin/testimonials', {
      ...VALID_TESTIMONIAL_BODY,
      name: 'A',
    }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when quote is too short (< 10 chars)', async () => {
    mockAdmin()
    const res = await CREATE(makeRequest('POST', 'http://localhost/api/admin/testimonials', {
      ...VALID_TESTIMONIAL_BODY,
      quote: 'Too short',
    }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when rating is out of range (> 5)', async () => {
    mockAdmin()
    const res = await CREATE(makeRequest('POST', 'http://localhost/api/admin/testimonials', {
      ...VALID_TESTIMONIAL_BODY,
      rating: 6,
    }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when rating is less than 1', async () => {
    mockAdmin()
    const res = await CREATE(makeRequest('POST', 'http://localhost/api/admin/testimonials', {
      ...VALID_TESTIMONIAL_BODY,
      rating: 0,
    }))
    expect(res.status).toBe(400)
  })

  it('creates testimonial and returns 201', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.create).mockResolvedValue(MOCK_TESTIMONIAL as never)

    const res = await CREATE(makeRequest('POST', 'http://localhost/api/admin/testimonials', VALID_TESTIMONIAL_BODY))
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('tmn_001')
  })

  it('college and role are optional fields', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.create).mockResolvedValue(MOCK_TESTIMONIAL as never)

    const bodyWithoutOptionals = { name: 'Test User', quote: 'Great platform for CA students overall.', rating: 5 }
    const res = await CREATE(makeRequest('POST', 'http://localhost/api/admin/testimonials', bodyWithoutOptionals))
    expect(res.status).toBe(201)
  })

  it('calls revalidatePath("/") after creation', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.create).mockResolvedValue(MOCK_TESTIMONIAL as never)

    await CREATE(makeRequest('POST', 'http://localhost/api/admin/testimonials', VALID_TESTIMONIAL_BODY))

    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.create).mockRejectedValue(new Error('DB error'))

    const res = await CREATE(makeRequest('POST', 'http://localhost/api/admin/testimonials', VALID_TESTIMONIAL_BODY))
    expect(res.status).toBe(500)
  })
})

// ── PATCH /api/admin/testimonials/[id] ────────────────────────────────────────

describe('PATCH /api/admin/testimonials/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const req = makeRequest('PATCH', 'http://localhost/api/admin/testimonials/tmn_001', { isActive: false })
    const res = await PATCH(req, mockParams)
    expect(res.status).toBe(401)
  })

  it('toggles isActive (hide testimonial)', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.update).mockResolvedValue({ ...MOCK_TESTIMONIAL, isActive: false } as never)

    const req = makeRequest('PATCH', 'http://localhost/api/admin/testimonials/tmn_001', { isActive: false })
    const res = await PATCH(req, mockParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('updates rating', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.update).mockResolvedValue({ ...MOCK_TESTIMONIAL, rating: 4 } as never)

    const req = makeRequest('PATCH', 'http://localhost/api/admin/testimonials/tmn_001', { rating: 4 })
    const res = await PATCH(req, mockParams)
    expect(res.status).toBe(200)
  })

  it('calls prisma.testimonial.update with correct id', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.update).mockResolvedValue(MOCK_TESTIMONIAL as never)

    const req = makeRequest('PATCH', 'http://localhost/api/admin/testimonials/tmn_001', { isActive: true })
    await PATCH(req, mockParams)

    expect(prisma.testimonial.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'tmn_001' } })
    )
  })

  it('calls revalidatePath("/") on successful update', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.update).mockResolvedValue(MOCK_TESTIMONIAL as never)

    const req = makeRequest('PATCH', 'http://localhost/api/admin/testimonials/tmn_001', { isActive: false })
    await PATCH(req, mockParams)

    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.update).mockRejectedValue(new Error('DB error'))

    const req = makeRequest('PATCH', 'http://localhost/api/admin/testimonials/tmn_001', { isActive: false })
    const res = await PATCH(req, mockParams)
    expect(res.status).toBe(500)
  })
})

// ── DELETE /api/admin/testimonials/[id] ───────────────────────────────────────

describe('DELETE /api/admin/testimonials/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(401)
  })

  it('deletes testimonial and returns success', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.delete).mockResolvedValue(MOCK_TESTIMONIAL as never)

    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('calls prisma.testimonial.delete with correct id', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.delete).mockResolvedValue(MOCK_TESTIMONIAL as never)

    await DELETE(new Request('http://localhost'), mockParams)

    expect(prisma.testimonial.delete).toHaveBeenCalledWith({ where: { id: 'tmn_001' } })
  })

  it('calls revalidatePath("/") after deletion', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.delete).mockResolvedValue(MOCK_TESTIMONIAL as never)

    await DELETE(new Request('http://localhost'), mockParams)

    expect(revalidatePath).toHaveBeenCalledWith('/')
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.testimonial.delete).mockRejectedValue(new Error('DB error'))

    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(500)
  })
})
