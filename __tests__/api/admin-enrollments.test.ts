import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks (hoisted) ───────────────────────────────────────────────────────────
vi.mock('@/lib/admin-auth', () => ({ requireAdmin: vi.fn() }))
vi.mock('@/lib/prisma', () => ({
  prisma: {
    enrollment: {
      findMany: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import { GET as LIST, POST as CREATE } from '@/app/api/admin/enrollments/route'
import { PATCH, DELETE } from '@/app/api/admin/enrollments/[id]/route'
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

function makeRequest(method: string, body?: unknown) {
  return new Request('http://localhost/api/admin/enrollments', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
}

const MOCK_ENROLLMENT = {
  id: 'enr_001',
  userId: 'student_001',
  courseId: 'course_001',
  status: 'ACTIVE',
  enrolledAt: new Date('2024-01-20'),
  user: { id: 'student_001', name: 'Ravi Kumar', email: 'ravi@example.com' },
  course: { id: 'course_001', title: 'CA Final SFM' },
}

const mockParams = { params: Promise.resolve({ id: 'enr_001' }) }

// ── GET /api/admin/enrollments (list) ─────────────────────────────────────────

describe('GET /api/admin/enrollments', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await LIST()
    expect(res.status).toBe(401)
  })

  it('returns all enrollments with user and course data', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.findMany).mockResolvedValue([MOCK_ENROLLMENT] as never)

    const res = await LIST()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].user.name).toBe('Ravi Kumar')
    expect(json.data[0].course.title).toBe('CA Final SFM')
  })

  it('includes user and course in query', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.findMany).mockResolvedValue([])

    await LIST()

    expect(prisma.enrollment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          user: expect.any(Object),
          course: expect.any(Object),
        }),
      })
    )
  })

  it('returns empty array when no enrollments exist', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.findMany).mockResolvedValue([])

    const res = await LIST()
    const json = await res.json()
    expect(json.data).toEqual([])
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.findMany).mockRejectedValue(new Error('DB error'))

    const res = await LIST()
    expect(res.status).toBe(500)
  })
})

// ── POST /api/admin/enrollments (manual enroll) ───────────────────────────────

describe('POST /api/admin/enrollments', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await CREATE(makeRequest('POST', { userId: 'student_001', courseId: 'course_001' }))
    expect(res.status).toBe(401)
  })

  it('returns 400 when userId is missing', async () => {
    mockAdmin()
    const res = await CREATE(makeRequest('POST', { courseId: 'course_001' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 400 when courseId is missing', async () => {
    mockAdmin()
    const res = await CREATE(makeRequest('POST', { userId: 'student_001' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid status value', async () => {
    mockAdmin()
    const res = await CREATE(makeRequest('POST', {
      userId: 'student_001',
      courseId: 'course_001',
      status: 'INVALID_STATUS',
    }))
    expect(res.status).toBe(400)
  })

  it('creates enrollment via upsert and returns 201', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.upsert).mockResolvedValue(MOCK_ENROLLMENT as never)

    const res = await CREATE(makeRequest('POST', {
      userId: 'student_001',
      courseId: 'course_001',
      status: 'ACTIVE',
    }))
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.status).toBe('ACTIVE')
  })

  it('uses upsert to handle re-enrollment idempotently', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.upsert).mockResolvedValue(MOCK_ENROLLMENT as never)

    await CREATE(makeRequest('POST', { userId: 'student_001', courseId: 'course_001' }))

    expect(prisma.enrollment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId_courseId: { userId: 'student_001', courseId: 'course_001' } },
        create: expect.objectContaining({ userId: 'student_001', courseId: 'course_001' }),
      })
    )
  })

  it('defaults status to ACTIVE when not provided', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.upsert).mockResolvedValue(MOCK_ENROLLMENT as never)

    await CREATE(makeRequest('POST', { userId: 'student_001', courseId: 'course_001' }))

    expect(prisma.enrollment.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ status: 'ACTIVE' }),
      })
    )
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.upsert).mockRejectedValue(new Error('DB error'))

    const res = await CREATE(makeRequest('POST', { userId: 'student_001', courseId: 'course_001' }))
    expect(res.status).toBe(500)
  })
})

// ── PATCH /api/admin/enrollments/[id] ─────────────────────────────────────────

describe('PATCH /api/admin/enrollments/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const req = new Request('http://localhost', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    })
    const res = await PATCH(req, mockParams)
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid status value', async () => {
    mockAdmin()
    const req = new Request('http://localhost', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'INVALID' }),
    })
    const res = await PATCH(req, mockParams)
    expect(res.status).toBe(400)
  })

  it('updates enrollment status to COMPLETED', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.update).mockResolvedValue({
      ...MOCK_ENROLLMENT,
      status: 'COMPLETED',
      completedAt: new Date(),
    } as never)

    const req = new Request('http://localhost', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    })
    const res = await PATCH(req, mockParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('auto-sets completedAt when status is COMPLETED without explicit date', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.update).mockResolvedValue({ ...MOCK_ENROLLMENT, status: 'COMPLETED' } as never)

    const req = new Request('http://localhost', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED' }),
    })
    await PATCH(req, mockParams)

    expect(prisma.enrollment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          completedAt: expect.any(Date),
        }),
      })
    )
  })

  it('accepts expiresAt as an ISO datetime string', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.update).mockResolvedValue(MOCK_ENROLLMENT as never)

    const expiresAt = '2025-12-31T23:59:59+05:30'
    const req = new Request('http://localhost', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiresAt }),
    })
    const res = await PATCH(req, mockParams)
    expect(res.status).toBe(200)
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.update).mockRejectedValue(new Error('DB error'))

    const req = new Request('http://localhost', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ACTIVE' }),
    })
    const res = await PATCH(req, mockParams)
    expect(res.status).toBe(500)
  })
})

// ── DELETE /api/admin/enrollments/[id] ────────────────────────────────────────

describe('DELETE /api/admin/enrollments/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(401)
  })

  it('deletes enrollment and returns success', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.delete).mockResolvedValue(MOCK_ENROLLMENT as never)

    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('calls prisma.enrollment.delete with correct id', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.delete).mockResolvedValue(MOCK_ENROLLMENT as never)

    await DELETE(new Request('http://localhost'), mockParams)

    expect(prisma.enrollment.delete).toHaveBeenCalledWith({ where: { id: 'enr_001' } })
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.enrollment.delete).mockRejectedValue(new Error('DB error'))

    const res = await DELETE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(500)
  })
})
