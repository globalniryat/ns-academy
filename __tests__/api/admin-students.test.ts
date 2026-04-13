import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks (hoisted) ───────────────────────────────────────────────────────────
vi.mock('@/lib/admin-auth', () => ({ requireAdmin: vi.fn() }))
vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

import { GET as LIST } from '@/app/api/admin/students/route'
import { GET as GET_ONE } from '@/app/api/admin/students/[id]/route'
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

const MOCK_STUDENT = {
  id: 'student_001',
  name: 'Ravi Kumar',
  email: 'ravi.kumar@example.com',
  phone: '9876543210',
  role: 'STUDENT',
  isActive: true,
  createdAt: new Date('2024-01-15'),
  _count: { enrollments: 2, certificates: 1 },
}

const MOCK_STUDENT_DETAIL = {
  ...MOCK_STUDENT,
  enrollments: [
    {
      id: 'enr_001',
      status: 'ACTIVE',
      enrolledAt: new Date('2024-01-20'),
      course: { title: 'CA Final SFM', slug: 'ca-final-sfm' },
    },
  ],
  payments: [
    {
      id: 'pay_001',
      amount: 399900,
      status: 'CAPTURED',
      createdAt: new Date('2024-01-20'),
      course: { title: 'CA Final SFM' },
    },
  ],
  certificates: [
    {
      id: 'cert_001',
      certificateNo: 'NSA-2024-00001',
      issuedAt: new Date('2024-06-01'),
      course: { title: 'CA Final SFM' },
    },
  ],
}

const mockParams = { params: Promise.resolve({ id: 'student_001' }) }

// ── GET /api/admin/students (list) ────────────────────────────────────────────

describe('GET /api/admin/students', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await LIST()
    expect(res.status).toBe(401)
  })

  it('returns student list for admin', async () => {
    mockAdmin()
    vi.mocked(prisma.profile.findMany).mockResolvedValue([MOCK_STUDENT] as never)

    const res = await LIST()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(1)
    expect(json.data[0].email).toBe('ravi.kumar@example.com')
  })

  it('only fetches profiles with STUDENT role', async () => {
    mockAdmin()
    vi.mocked(prisma.profile.findMany).mockResolvedValue([] as never)

    await LIST()

    expect(prisma.profile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { role: 'STUDENT' },
      })
    )
  })

  it('includes enrollment and certificate counts', async () => {
    mockAdmin()
    vi.mocked(prisma.profile.findMany).mockResolvedValue([MOCK_STUDENT] as never)

    await LIST()

    expect(prisma.profile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        select: expect.objectContaining({
          _count: expect.objectContaining({
            select: expect.objectContaining({
              enrollments: true,
              certificates: true,
            }),
          }),
        }),
      })
    )
  })

  it('returns empty array when no students exist', async () => {
    mockAdmin()
    vi.mocked(prisma.profile.findMany).mockResolvedValue([] as never)

    const res = await LIST()
    const json = await res.json()
    expect(json.data).toEqual([])
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.profile.findMany).mockRejectedValue(new Error('DB error'))

    const res = await LIST()
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})

// ── GET /api/admin/students/[id] ──────────────────────────────────────────────

describe('GET /api/admin/students/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await GET_ONE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(401)
  })

  it('returns 404 for non-existent student', async () => {
    mockAdmin()
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(null)

    const res = await GET_ONE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toBe('Student not found')
  })

  it('returns full student detail with enrollments, payments, certificates', async () => {
    mockAdmin()
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(MOCK_STUDENT_DETAIL as never)

    const res = await GET_ONE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.enrollments).toHaveLength(1)
    expect(json.data.payments).toHaveLength(1)
    expect(json.data.certificates).toHaveLength(1)
  })

  it('queries with enrollments, payments, and certificates included', async () => {
    mockAdmin()
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(MOCK_STUDENT_DETAIL as never)

    await GET_ONE(new Request('http://localhost'), mockParams)

    expect(prisma.profile.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'student_001' },
        include: expect.objectContaining({
          enrollments: expect.any(Object),
          payments: expect.any(Object),
          certificates: expect.any(Object),
        }),
      })
    )
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.profile.findUnique).mockRejectedValue(new Error('DB connection failed'))

    const res = await GET_ONE(new Request('http://localhost'), mockParams)
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })
})
