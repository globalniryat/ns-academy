import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    userNote: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    enrollment: { findUnique: vi.fn() },
  },
}))

import { GET, POST } from '@/app/api/notes/route'
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

// ── GET tests ─────────────────────────────────────────────────────────────────

describe('GET /api/notes', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 for unauthenticated request', async () => {
    mockNoAuth()
    const res = await GET(new Request('http://localhost/api/notes?lessonId=l1'))
    expect(res.status).toBe(401)
  })

  it('returns notes for a given lessonId', async () => {
    mockAuth()
    const NOTES = [{ id: 'note_1', content: 'Important point', lessonId: 'l1' }]
    vi.mocked(prisma.userNote.findMany).mockResolvedValue(NOTES as never)

    const res = await GET(new Request('http://localhost/api/notes?lessonId=l1'))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toEqual(NOTES)
  })

  it('returns empty array when user has no notes for lesson', async () => {
    mockAuth()
    vi.mocked(prisma.userNote.findMany).mockResolvedValue([] as never)

    const res = await GET(new Request('http://localhost/api/notes?lessonId=l_empty'))
    const json = await res.json()
    expect(json.data).toEqual([])
  })

  it('filters by userId — does not return other users notes', async () => {
    mockAuth('user_alice')
    vi.mocked(prisma.userNote.findMany).mockResolvedValue([])

    await GET(new Request('http://localhost/api/notes?lessonId=l1'))

    // Verify the prisma query includes the authenticated userId
    expect(prisma.userNote.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: 'user_alice' }),
      })
    )
  })
})

// ── POST tests ────────────────────────────────────────────────────────────────

describe('POST /api/notes', () => {
  beforeEach(() => vi.clearAllMocks())

  const makePOST = (body: unknown) =>
    new Request('http://localhost/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

  it('returns 401 for unauthenticated request', async () => {
    mockNoAuth()
    const res = await POST(makePOST({ lessonId: 'l1', content: 'Note' }))
    expect(res.status).toBe(401)
  })

  it('creates a new note when none exists for the lesson', async () => {
    mockAuth()
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue({ id: 'enr_001' } as never)
    vi.mocked(prisma.userNote.findFirst).mockResolvedValue(null)
    vi.mocked(prisma.userNote.create).mockResolvedValue({ id: 'note_new', content: 'New note' } as never)

    const res = await POST(makePOST({ lessonId: 'l1', courseId: 'c1', content: 'New note' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(prisma.userNote.create).toHaveBeenCalledTimes(1)
  })

  it('updates an existing note instead of creating a duplicate', async () => {
    mockAuth()
    vi.mocked(prisma.userNote.findFirst).mockResolvedValue({ id: 'note_existing', content: 'Old content' } as never)
    vi.mocked(prisma.userNote.update).mockResolvedValue({ id: 'note_existing', content: 'Updated content' } as never)

    const res = await POST(makePOST({ lessonId: 'l1', content: 'Updated content' }))
    expect(res.status).toBe(200)
    expect(prisma.userNote.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { content: 'Updated content' } })
    )
    // Must NOT create a duplicate
    expect(prisma.userNote.create).not.toHaveBeenCalled()
  })

  it('creates a note without lessonId when only courseId is provided', async () => {
    mockAuth()
    vi.mocked(prisma.enrollment.findUnique).mockResolvedValue({ id: 'enr_001' } as never)
    vi.mocked(prisma.userNote.create).mockResolvedValue({ id: 'note_course' } as never)

    const res = await POST(makePOST({ courseId: 'c1', content: 'Course note' }))
    expect(res.status).toBe(200)
    expect(prisma.userNote.create).toHaveBeenCalledTimes(1)
  })

  it('saves empty content (clearing a note is valid)', async () => {
    mockAuth()
    vi.mocked(prisma.userNote.findFirst).mockResolvedValue({ id: 'note_1', content: 'Old' } as never)
    vi.mocked(prisma.userNote.update).mockResolvedValue({ id: 'note_1', content: '' } as never)

    const res = await POST(makePOST({ lessonId: 'l1', content: '' }))
    expect(res.status).toBe(200)
    expect(prisma.userNote.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { content: '' } })
    )
  })

  it('returns 500 on database error', async () => {
    mockAuth()
    vi.mocked(prisma.userNote.findFirst).mockRejectedValue(new Error('DB down'))

    const res = await POST(makePOST({ lessonId: 'l1', content: 'Note' }))
    expect(res.status).toBe(500)
  })
})
