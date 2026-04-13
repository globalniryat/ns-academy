import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks (hoisted) ───────────────────────────────────────────────────────────
vi.mock('@/lib/admin-auth', () => ({ requireAdmin: vi.fn() }))
vi.mock('@/lib/prisma', () => ({
  prisma: {
    course: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import { GET as LIST, POST as CREATE } from '@/app/api/admin/courses/route'
import { GET as GET_ONE, PATCH, DELETE } from '@/app/api/admin/courses/[id]/route'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

// ── Helpers ───────────────────────────────────────────────────────────────────

function mockAdmin() {
  vi.mocked(requireAdmin).mockResolvedValue({ userId: 'admin_001' } as never)
}

function mockUnauthorized() {
  vi.mocked(requireAdmin).mockResolvedValue({
    error: new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 }),
  } as never)
}

function makeParamsPOST(body: unknown) {
  return new Request('http://localhost/api/admin/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function makePATCH(body: unknown) {
  return new Request('http://localhost/api/admin/courses/course_001', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const MOCK_COURSE = {
  id: 'course_001',
  slug: 'ca-final-sfm',
  title: 'CA Final SFM',
  shortDescription: 'A comprehensive course on Strategic Financial Management',
  description: 'Full coverage of CA Final SFM including all topics in detail',
  level: 'FINAL',
  status: 'DRAFT',
  price: 399900,
  originalPrice: 799900,
  duration: '120 hours',
  color: '#16a34a',
  instructor: 'CA Nikesh Shah',
  whatYoullLearn: ['Derivatives', 'Foreign Exchange'],
  _count: { enrollments: 5, sections: 3 },
}

const VALID_COURSE_BODY = {
  slug: 'ca-final-sfm-test',
  title: 'CA Final SFM Test',
  shortDescription: 'A comprehensive course on SFM for testing',
  description: 'Full coverage of CA Final SFM including all topics for testing purposes',
  level: 'FINAL',
  status: 'DRAFT',
  price: 399900,
  originalPrice: 799900,
  duration: '120 hours',
  color: '#16a34a',
  instructor: 'CA Nikesh Shah',
  whatYoullLearn: ['Derivatives', 'Foreign Exchange'],
}

const mockParams = { params: Promise.resolve({ id: 'course_001' }) }

// ── GET /api/admin/courses (list) ─────────────────────────────────────────────

describe('GET /api/admin/courses', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await LIST()
    expect(res.status).toBe(401)
  })

  it('returns courses list for admin', async () => {
    mockAdmin()
    vi.mocked(prisma.course.findMany).mockResolvedValue([MOCK_COURSE] as never)

    const res = await LIST()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].id).toBe('course_001')
  })

  it('returns empty array when no courses exist', async () => {
    mockAdmin()
    vi.mocked(prisma.course.findMany).mockResolvedValue([] as never)

    const res = await LIST()
    const json = await res.json()
    expect(json.data).toEqual([])
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.course.findMany).mockRejectedValue(new Error('DB error'))

    const res = await LIST()
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})

// ── POST /api/admin/courses (create) ──────────────────────────────────────────

describe('POST /api/admin/courses', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await CREATE(makeParamsPOST(VALID_COURSE_BODY))
    expect(res.status).toBe(401)
  })

  it('returns 400 for missing required fields', async () => {
    mockAdmin()
    const res = await CREATE(makeParamsPOST({ title: 'Incomplete Course' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 400 when title is too short (< 3 chars)', async () => {
    mockAdmin()
    const body = { ...VALID_COURSE_BODY, title: 'AB' }
    const res = await CREATE(makeParamsPOST(body))
    expect(res.status).toBe(400)
  })

  it('returns 400 when price is not a positive integer', async () => {
    mockAdmin()
    const body = { ...VALID_COURSE_BODY, price: -100 }
    const res = await CREATE(makeParamsPOST(body))
    expect(res.status).toBe(400)
  })

  it('returns 400 when level is invalid enum value', async () => {
    mockAdmin()
    const body = { ...VALID_COURSE_BODY, level: 'INVALID_LEVEL' }
    const res = await CREATE(makeParamsPOST(body))
    expect(res.status).toBe(400)
  })

  it('returns 400 when whatYoullLearn is empty array', async () => {
    mockAdmin()
    const body = { ...VALID_COURSE_BODY, whatYoullLearn: [] }
    const res = await CREATE(makeParamsPOST(body))
    expect(res.status).toBe(400)
  })

  it('creates course and returns 201 with valid data', async () => {
    mockAdmin()
    vi.mocked(prisma.course.create).mockResolvedValue(MOCK_COURSE as never)

    const res = await CREATE(makeParamsPOST(VALID_COURSE_BODY))
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('course_001')
  })

  it('calls prisma.course.create with the parsed data', async () => {
    mockAdmin()
    vi.mocked(prisma.course.create).mockResolvedValue(MOCK_COURSE as never)

    await CREATE(makeParamsPOST(VALID_COURSE_BODY))

    expect(prisma.course.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: VALID_COURSE_BODY.slug,
          title: VALID_COURSE_BODY.title,
          price: VALID_COURSE_BODY.price,
        }),
      })
    )
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.course.create).mockRejectedValue(new Error('DB error'))

    const res = await CREATE(makeParamsPOST(VALID_COURSE_BODY))
    expect(res.status).toBe(500)
  })
})

// ── GET /api/admin/courses/[id] ───────────────────────────────────────────────

describe('GET /api/admin/courses/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await GET_ONE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(401)
  })

  it('returns 404 for non-existent course', async () => {
    mockAdmin()
    vi.mocked(prisma.course.findUnique).mockResolvedValue(null)

    const res = await GET_ONE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns course with sections and lessons', async () => {
    mockAdmin()
    const courseWithSections = {
      ...MOCK_COURSE,
      sections: [{ id: 'sec_001', title: 'Section 1', sortOrder: 0, lessons: [] }],
    }
    vi.mocked(prisma.course.findUnique).mockResolvedValue(courseWithSections as never)

    const res = await GET_ONE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.sections).toHaveLength(1)
  })

  it('queries with sections and lessons included', async () => {
    mockAdmin()
    vi.mocked(prisma.course.findUnique).mockResolvedValue({ ...MOCK_COURSE, sections: [] } as never)

    await GET_ONE(new Request('http://localhost'), mockParams)

    expect(prisma.course.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'course_001' },
        include: expect.objectContaining({ sections: expect.any(Object) }),
      })
    )
  })
})

// ── PATCH /api/admin/courses/[id] ─────────────────────────────────────────────

describe('PATCH /api/admin/courses/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await PATCH(makePATCH({ title: 'New Title' }), mockParams)
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid field values (e.g. negative price)', async () => {
    mockAdmin()
    const res = await PATCH(makePATCH({ price: -500 }), mockParams)
    expect(res.status).toBe(400)
  })

  it('updates course and returns updated data', async () => {
    mockAdmin()
    const updated = { ...MOCK_COURSE, title: 'Updated Title', status: 'PUBLISHED' }
    vi.mocked(prisma.course.update).mockResolvedValue(updated as never)

    const res = await PATCH(makePATCH({ title: 'Updated Title', status: 'PUBLISHED' }), mockParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.title).toBe('Updated Title')
  })

  it('allows partial update (only status)', async () => {
    mockAdmin()
    vi.mocked(prisma.course.update).mockResolvedValue({ ...MOCK_COURSE, status: 'PUBLISHED' } as never)

    const res = await PATCH(makePATCH({ status: 'PUBLISHED' }), mockParams)
    expect(res.status).toBe(200)
  })

  it('calls prisma.course.update with correct id and data', async () => {
    mockAdmin()
    vi.mocked(prisma.course.update).mockResolvedValue(MOCK_COURSE as never)

    await PATCH(makePATCH({ status: 'PUBLISHED' }), mockParams)

    expect(prisma.course.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'course_001' },
        data: expect.objectContaining({ status: 'PUBLISHED' }),
      })
    )
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.course.update).mockRejectedValue(new Error('DB error'))

    const res = await PATCH(makePATCH({ status: 'PUBLISHED' }), mockParams)
    expect(res.status).toBe(500)
  })
})

// ── DELETE /api/admin/courses/[id] ────────────────────────────────────────────

describe('DELETE /api/admin/courses/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(401)
  })

  it('deletes course and returns success', async () => {
    mockAdmin()
    vi.mocked(prisma.course.delete).mockResolvedValue(MOCK_COURSE as never)

    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('calls prisma.course.delete with correct id', async () => {
    mockAdmin()
    vi.mocked(prisma.course.delete).mockResolvedValue(MOCK_COURSE as never)

    await DELETE(new Request('http://localhost'), mockParams)

    expect(prisma.course.delete).toHaveBeenCalledWith({ where: { id: 'course_001' } })
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.course.delete).mockRejectedValue(new Error('DB error'))

    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(500)
  })
})
