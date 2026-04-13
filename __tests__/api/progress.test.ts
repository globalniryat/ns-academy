import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    lesson: { findMany: vi.fn() },
    lessonProgress: { findMany: vi.fn(), upsert: vi.fn(), count: vi.fn() },
    enrollment: { findUnique: vi.fn(), update: vi.fn() },
    certificate: { findUnique: vi.fn(), create: vi.fn(), count: vi.fn() },
  },
}))

import { GET, POST } from '@/app/api/progress/route'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockAuth(userId = 'user_001') {
  vi.mocked(createClient).mockResolvedValue({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: userId } } }) },
  } as never)
}
function mockNoAuth() {
  vi.mocked(createClient).mockResolvedValue({
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) },
  } as never)
}

function makeGET(courseId: string) {
  return new Request(`http://localhost/api/progress?courseId=${courseId}`)
}

function makePOST(body: unknown) {
  return new Request('http://localhost/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// ── GET tests ────────────────────────────────────────────────────────────────

describe('GET /api/progress', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 for unauthenticated request', async () => {
    mockNoAuth()
    const res = await GET(makeGET('course_sfm_001'))
    expect(res.status).toBe(401)
  })

  it('returns 400 when courseId is missing', async () => {
    mockAuth()
    const res = await GET(new Request('http://localhost/api/progress'))
    expect(res.status).toBe(400)
  })

  it('returns progress map keyed by lessonId', async () => {
    mockAuth()
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue({ id: 'enr_001' } as never)
    vi.mocked(prisma.lesson.findMany).mockResolvedValue([
      { id: 'lesson_1' }, { id: 'lesson_2' },
    ] as never)
    vi.mocked(prisma.lessonProgress.findMany).mockResolvedValue([
      { lessonId: 'lesson_1', isCompleted: true, watchedSeconds: 600 },
    ] as never)

    const res = await GET(makeGET('course_sfm_001'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data['lesson_1']).toEqual({ isCompleted: true, watchedSeconds: 600 })
    // lesson_2 has no progress entry, so it should not appear in the map
    expect(json.data['lesson_2']).toBeUndefined()
  })

  it('returns empty progress map when user has no progress', async () => {
    mockAuth()
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue({ id: 'enr_001' } as never)
    vi.mocked(prisma.lesson.findMany).mockResolvedValue([{ id: 'lesson_1' }] as never)
    vi.mocked(prisma.lessonProgress.findMany).mockResolvedValue([] as never)

    const res = await GET(makeGET('course_sfm_001'))
    const json = await res.json()
    expect(json.data).toEqual({})
  })
})

// ── POST tests ────────────────────────────────────────────────────────────────

describe('POST /api/progress', () => {
  beforeEach(() => vi.clearAllMocks())

  const VALID_BODY = {
    lessonId: 'lesson_1',
    courseId: 'course_sfm_001',
    isCompleted: true,
    watchedSeconds: 300,
  }

  it('returns 401 for unauthenticated request', async () => {
    mockNoAuth()
    const res = await POST(makePOST(VALID_BODY))
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid body (missing isCompleted)', async () => {
    mockAuth()
    const res = await POST(makePOST({ lessonId: 'l1', courseId: 'c1' }))
    expect(res.status).toBe(400)
  })

  it('returns 403 when user is not enrolled in the course', async () => {
    mockAuth()
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue(null)

    const res = await POST(makePOST(VALID_BODY))
    expect(res.status).toBe(403)
    const json = await res.json()
    expect(json.error).toBe('Not enrolled')
  })

  it('upserts lesson progress and returns success', async () => {
    mockAuth()
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue({ id: 'enr_001' } as never)
    vi.mocked(prisma.lessonProgress.upsert).mockResolvedValue({
      id: 'prog_001', lessonId: 'lesson_1', isCompleted: true, watchedSeconds: 300,
    } as never)
    vi.mocked(prisma.lesson.findMany).mockResolvedValue([{ id: 'lesson_1' }] as never)
    vi.mocked(prisma.lessonProgress.count).mockResolvedValue(0) // not all complete yet

    const res = await POST(makePOST(VALID_BODY))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.courseCompleted).toBe(false)
  })

  it('marks enrollment COMPLETED and creates certificate when last lesson done', async () => {
    mockAuth('user_cert')
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue({ id: 'enr_001' } as never)
    vi.mocked(prisma.lessonProgress.upsert).mockResolvedValue({
      id: 'prog_001', lessonId: 'lesson_3', isCompleted: true,
    } as never)
    // Course has 3 lessons, all now complete
    vi.mocked(prisma.lesson.findMany).mockResolvedValue([
      { id: 'lesson_1' }, { id: 'lesson_2' }, { id: 'lesson_3' },
    ] as never)
    vi.mocked(prisma.lessonProgress.count).mockResolvedValue(3)
    vi.mocked(prisma.enrollment.update).mockResolvedValue({ status: 'COMPLETED' } as never)
    vi.mocked(prisma.certificate.findUnique).mockResolvedValue(null) // no cert yet
    vi.mocked(prisma.certificate.count).mockResolvedValue(0)
    vi.mocked(prisma.certificate.create).mockResolvedValue({
      id: 'cert_001', certificateNo: 'NSA-2025-00001',
    } as never)

    const res = await POST(makePOST({ ...VALID_BODY, lessonId: 'lesson_3' }))
    const json = await res.json()
    expect(json.courseCompleted).toBe(true)
    expect(json.certificateId).toBe('cert_001')

    expect(prisma.enrollment.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ status: 'COMPLETED' }) })
    )
    expect(prisma.certificate.create).toHaveBeenCalledTimes(1)
  })

  it('does not create duplicate certificate if one already exists', async () => {
    mockAuth()
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue({ id: 'enr_001' } as never)
    vi.mocked(prisma.lessonProgress.upsert).mockResolvedValue({ id: 'prog_001' } as never)
    vi.mocked(prisma.lesson.findMany).mockResolvedValue([{ id: 'lesson_1' }] as never)
    vi.mocked(prisma.lessonProgress.count).mockResolvedValue(1)
    vi.mocked(prisma.enrollment.update).mockResolvedValue({} as never)
    // Certificate already exists
    vi.mocked(prisma.certificate.findUnique).mockResolvedValue({ id: 'cert_existing' } as never)

    const res = await POST(makePOST(VALID_BODY))
    const json = await res.json()
    expect(json.courseCompleted).toBe(true)
    expect(json.certificateId).toBe('cert_existing')
    // Must NOT create a new certificate
    expect(prisma.certificate.create).not.toHaveBeenCalled()
  })

  it('does not trigger completion when marking a lesson incomplete', async () => {
    mockAuth()
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue({ id: 'enr_001' } as never)
    vi.mocked(prisma.lessonProgress.upsert).mockResolvedValue({ id: 'prog_001' } as never)

    const res = await POST(makePOST({ ...VALID_BODY, isCompleted: false }))
    const json = await res.json()
    expect(json.courseCompleted).toBe(false)
    // Should not query lessons or check completion count
    expect(prisma.lesson.findMany).not.toHaveBeenCalled()
  })

  it('returns 500 on database error', async () => {
    mockAuth()
    vi.mocked(prisma.enrollment.findUnique).mockRejectedValue(new Error('DB error'))

    const res = await POST(makePOST(VALID_BODY))
    expect(res.status).toBe(500)
  })
})
