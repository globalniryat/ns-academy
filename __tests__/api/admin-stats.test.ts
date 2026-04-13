import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks (hoisted) ───────────────────────────────────────────────────────────
vi.mock('@/lib/admin-auth', () => ({ requireAdmin: vi.fn() }))
vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: { count: vi.fn() },
    course: { count: vi.fn() },
    enrollment: { count: vi.fn(), findMany: vi.fn() },
    payment: { aggregate: vi.fn(), findMany: vi.fn() },
  },
}))

import { GET } from '@/app/api/admin/stats/route'
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

function setupHappyPath({
  students = 42,
  courses = 5,
  enrollments = 120,
  revenuePaise = 1200000,
}: {
  students?: number
  courses?: number
  enrollments?: number
  revenuePaise?: number
} = {}) {
  vi.mocked(prisma.profile.count).mockResolvedValue(students)
  vi.mocked(prisma.course.count).mockResolvedValue(courses)
  vi.mocked(prisma.enrollment.count).mockResolvedValue(enrollments)
  vi.mocked(prisma.payment.aggregate).mockResolvedValue({
    _sum: { amount: revenuePaise },
  } as never)
  vi.mocked(prisma.enrollment.findMany).mockResolvedValue([])
  vi.mocked(prisma.payment.findMany).mockResolvedValue([])
}

// ── GET /api/admin/stats ──────────────────────────────────────────────────────

describe('GET /api/admin/stats', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns all aggregated stats', async () => {
    mockAdmin()
    setupHappyPath({ students: 42, courses: 5, enrollments: 120, revenuePaise: 1200000 })

    const res = await GET()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.totalStudents).toBe(42)
    expect(json.data.totalCourses).toBe(5)
    expect(json.data.totalEnrollments).toBe(120)
    expect(json.data.totalRevenuePaise).toBe(1200000)
  })

  it('returns zero revenue when no payments have been captured', async () => {
    mockAdmin()
    setupHappyPath({ revenuePaise: 0 })
    vi.mocked(prisma.payment.aggregate).mockResolvedValue({ _sum: { amount: null } } as never)

    const res = await GET()
    const json = await res.json()
    expect(json.data.totalRevenuePaise).toBe(0)
  })

  it('returns recentEnrollments array', async () => {
    mockAdmin()
    setupHappyPath()

    const mockEnrollments = [
      {
        id: 'enr_001',
        enrolledAt: new Date(),
        status: 'ACTIVE',
        user: { name: 'Ravi Kumar', email: 'ravi@example.com' },
        course: { title: 'CA Final SFM' },
      },
    ]
    vi.mocked(prisma.enrollment.findMany).mockResolvedValue(mockEnrollments as never)

    const res = await GET()
    const json = await res.json()
    expect(json.data.recentEnrollments).toHaveLength(1)
    expect(json.data.recentEnrollments[0].user.name).toBe('Ravi Kumar')
  })

  it('returns recentPayments array', async () => {
    mockAdmin()
    setupHappyPath()

    const mockPayments = [
      {
        id: 'pay_001',
        amount: 399900,
        status: 'CAPTURED',
        createdAt: new Date(),
        user: { name: 'Priya Sharma' },
        course: { title: 'CA Final SFM' },
      },
    ]
    vi.mocked(prisma.payment.findMany).mockResolvedValue(mockPayments as never)

    const res = await GET()
    const json = await res.json()
    expect(json.data.recentPayments).toHaveLength(1)
    expect(json.data.recentPayments[0].amount).toBe(399900)
  })

  it('only counts enrollments with ACTIVE or COMPLETED status', async () => {
    mockAdmin()
    setupHappyPath()

    await GET()

    expect(prisma.enrollment.count).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: { in: ['ACTIVE', 'COMPLETED'] } },
      })
    )
  })

  it('only aggregates revenue from CAPTURED payments', async () => {
    mockAdmin()
    setupHappyPath()

    await GET()

    expect(prisma.payment.aggregate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'CAPTURED' },
        _sum: { amount: true },
      })
    )
  })

  it('only counts profiles with STUDENT role', async () => {
    mockAdmin()
    setupHappyPath()

    await GET()

    expect(prisma.profile.count).toHaveBeenCalledWith(
      expect.objectContaining({ where: { role: 'STUDENT' } })
    )
  })

  it('limits recentEnrollments to 5 records', async () => {
    mockAdmin()
    setupHappyPath()

    await GET()

    expect(prisma.enrollment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 })
    )
  })

  it('limits recentPayments to 5 records', async () => {
    mockAdmin()
    setupHappyPath()

    await GET()

    expect(prisma.payment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 })
    )
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.profile.count).mockRejectedValue(new Error('DB error'))

    const res = await GET()
    expect(res.status).toBe(500)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('handles zero courses and students gracefully', async () => {
    mockAdmin()
    setupHappyPath({ students: 0, courses: 0, enrollments: 0, revenuePaise: 0 })

    const res = await GET()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.data.totalStudents).toBe(0)
    expect(json.data.totalCourses).toBe(0)
    expect(json.data.totalRevenuePaise).toBe(0)
  })
})
