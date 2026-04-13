import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks (hoisted) ───────────────────────────────────────────────────────────
vi.mock('@/lib/admin-auth', () => ({ requireAdmin: vi.fn() }))
vi.mock('@/lib/prisma', () => ({
  prisma: {
    section: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    lesson: { create: vi.fn(), update: vi.fn(), delete: vi.fn() },
  },
}))

import { POST as CREATE_SECTION } from '@/app/api/admin/sections/route'
import { PATCH as PATCH_SECTION, DELETE as DELETE_SECTION } from '@/app/api/admin/sections/[id]/route'
import { POST as CREATE_LESSON } from '@/app/api/admin/lessons/route'
import { PATCH as PATCH_LESSON, DELETE as DELETE_LESSON } from '@/app/api/admin/lessons/[id]/route'
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

function makeRequest(method: string, url: string, body?: unknown) {
  return new Request(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
}

const MOCK_SECTION = {
  id: 'sec_001',
  courseId: 'course_001',
  title: 'Introduction to SFM',
  sortOrder: 0,
  createdAt: new Date(),
}

const MOCK_LESSON = {
  id: 'les_001',
  sectionId: 'sec_001',
  title: 'What is Financial Management?',
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  duration: '45 min',
  isFreePreview: false,
  sortOrder: 0,
  createdAt: new Date(),
}

const sectionParams = { params: Promise.resolve({ id: 'sec_001' }) }
const lessonParams = { params: Promise.resolve({ id: 'les_001' }) }

// ── POST /api/admin/sections ──────────────────────────────────────────────────

describe('POST /api/admin/sections', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await CREATE_SECTION(makeRequest('POST', 'http://localhost', {
      courseId: 'course_001',
      title: 'Introduction',
      sortOrder: 0,
    }))
    expect(res.status).toBe(401)
  })

  it('returns 400 when courseId is missing', async () => {
    mockAdmin()
    const res = await CREATE_SECTION(makeRequest('POST', 'http://localhost', {
      title: 'Introduction',
      sortOrder: 0,
    }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when title is too short (< 2 chars)', async () => {
    mockAdmin()
    const res = await CREATE_SECTION(makeRequest('POST', 'http://localhost', {
      courseId: 'course_001',
      title: 'A',
      sortOrder: 0,
    }))
    expect(res.status).toBe(400)
  })

  it('creates section and returns 201', async () => {
    mockAdmin()
    vi.mocked(prisma.section.create).mockResolvedValue(MOCK_SECTION as never)

    const res = await CREATE_SECTION(makeRequest('POST', 'http://localhost', {
      courseId: 'course_001',
      title: 'Introduction to SFM',
      sortOrder: 0,
    }))
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('sec_001')
  })

  it('stores section linked to the provided courseId', async () => {
    mockAdmin()
    vi.mocked(prisma.section.create).mockResolvedValue(MOCK_SECTION as never)

    await CREATE_SECTION(makeRequest('POST', 'http://localhost', {
      courseId: 'course_001',
      title: 'Introduction to SFM',
    }))

    expect(prisma.section.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ courseId: 'course_001', title: 'Introduction to SFM' }),
      })
    )
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.section.create).mockRejectedValue(new Error('DB error'))

    const res = await CREATE_SECTION(makeRequest('POST', 'http://localhost', {
      courseId: 'course_001',
      title: 'Introduction to SFM',
    }))
    expect(res.status).toBe(500)
  })
})

// ── PATCH /api/admin/sections/[id] ────────────────────────────────────────────

describe('PATCH /api/admin/sections/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await PATCH_SECTION(makeRequest('PATCH', 'http://localhost', { title: 'New Title' }), sectionParams)
    expect(res.status).toBe(401)
  })

  it('renames section title', async () => {
    mockAdmin()
    vi.mocked(prisma.section.update).mockResolvedValue({ ...MOCK_SECTION, title: 'Renamed Section' } as never)

    const res = await PATCH_SECTION(makeRequest('PATCH', 'http://localhost', { title: 'Renamed Section' }), sectionParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('calls prisma.section.update with correct id', async () => {
    mockAdmin()
    vi.mocked(prisma.section.update).mockResolvedValue(MOCK_SECTION as never)

    await PATCH_SECTION(makeRequest('PATCH', 'http://localhost', { title: 'Updated' }), sectionParams)

    expect(prisma.section.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'sec_001' } })
    )
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.section.update).mockRejectedValue(new Error('DB error'))

    const res = await PATCH_SECTION(makeRequest('PATCH', 'http://localhost', { title: 'Updated' }), sectionParams)
    expect(res.status).toBe(500)
  })
})

// ── DELETE /api/admin/sections/[id] ───────────────────────────────────────────

describe('DELETE /api/admin/sections/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await DELETE_SECTION(new Request('http://localhost'), sectionParams)
    expect(res.status).toBe(401)
  })

  it('deletes section and returns success', async () => {
    mockAdmin()
    vi.mocked(prisma.section.delete).mockResolvedValue(MOCK_SECTION as never)

    const res = await DELETE_SECTION(new Request('http://localhost'), sectionParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('calls prisma.section.delete with correct id', async () => {
    mockAdmin()
    vi.mocked(prisma.section.delete).mockResolvedValue(MOCK_SECTION as never)

    await DELETE_SECTION(new Request('http://localhost'), sectionParams)

    expect(prisma.section.delete).toHaveBeenCalledWith({ where: { id: 'sec_001' } })
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.section.delete).mockRejectedValue(new Error('DB error'))

    const res = await DELETE_SECTION(new Request('http://localhost'), sectionParams)
    expect(res.status).toBe(500)
  })
})

// ── POST /api/admin/lessons ───────────────────────────────────────────────────

describe('POST /api/admin/lessons', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await CREATE_LESSON(makeRequest('POST', 'http://localhost', {
      sectionId: 'sec_001',
      title: 'Lesson Title',
      videoUrl: 'https://youtube.com/watch?v=abc',
    }))
    expect(res.status).toBe(401)
  })

  it('returns 400 when sectionId is missing', async () => {
    mockAdmin()
    const res = await CREATE_LESSON(makeRequest('POST', 'http://localhost', {
      title: 'Lesson Title',
      videoUrl: 'https://youtube.com/watch?v=abc',
    }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when title is too short (< 2 chars)', async () => {
    mockAdmin()
    const res = await CREATE_LESSON(makeRequest('POST', 'http://localhost', {
      sectionId: 'sec_001',
      title: 'A',
      videoUrl: 'https://youtube.com/watch?v=abc',
    }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when videoUrl is missing', async () => {
    mockAdmin()
    const res = await CREATE_LESSON(makeRequest('POST', 'http://localhost', {
      sectionId: 'sec_001',
      title: 'Valid Lesson Title',
    }))
    expect(res.status).toBe(400)
  })

  it('creates lesson and returns 201', async () => {
    mockAdmin()
    vi.mocked(prisma.lesson.create).mockResolvedValue(MOCK_LESSON as never)

    const res = await CREATE_LESSON(makeRequest('POST', 'http://localhost', {
      sectionId: 'sec_001',
      title: 'What is Financial Management?',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      duration: '45 min',
      isFreePreview: false,
    }))
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data.id).toBe('les_001')
  })

  it('isFreePreview defaults to false when not provided', async () => {
    mockAdmin()
    vi.mocked(prisma.lesson.create).mockResolvedValue(MOCK_LESSON as never)

    await CREATE_LESSON(makeRequest('POST', 'http://localhost', {
      sectionId: 'sec_001',
      title: 'Valid Lesson Title',
      videoUrl: 'https://youtube.com/watch?v=abc',
    }))

    expect(prisma.lesson.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ isFreePreview: false }),
      })
    )
  })

  it('stores lesson linked to the provided sectionId', async () => {
    mockAdmin()
    vi.mocked(prisma.lesson.create).mockResolvedValue(MOCK_LESSON as never)

    await CREATE_LESSON(makeRequest('POST', 'http://localhost', {
      sectionId: 'sec_001',
      title: 'Valid Lesson Title',
      videoUrl: 'https://youtube.com/watch?v=abc',
    }))

    expect(prisma.lesson.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ sectionId: 'sec_001' }),
      })
    )
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.lesson.create).mockRejectedValue(new Error('DB error'))

    const res = await CREATE_LESSON(makeRequest('POST', 'http://localhost', {
      sectionId: 'sec_001',
      title: 'Valid Lesson Title',
      videoUrl: 'https://youtube.com/watch?v=abc',
    }))
    expect(res.status).toBe(500)
  })
})

// ── PATCH /api/admin/lessons/[id] ─────────────────────────────────────────────

describe('PATCH /api/admin/lessons/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await PATCH_LESSON(makeRequest('PATCH', 'http://localhost', { title: 'Updated' }), lessonParams)
    expect(res.status).toBe(401)
  })

  it('updates lesson title and returns updated data', async () => {
    mockAdmin()
    vi.mocked(prisma.lesson.update).mockResolvedValue({ ...MOCK_LESSON, title: 'Updated Title' } as never)

    const res = await PATCH_LESSON(makeRequest('PATCH', 'http://localhost', { title: 'Updated Title' }), lessonParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('can mark lesson as free preview', async () => {
    mockAdmin()
    vi.mocked(prisma.lesson.update).mockResolvedValue({ ...MOCK_LESSON, isFreePreview: true } as never)

    const res = await PATCH_LESSON(makeRequest('PATCH', 'http://localhost', { isFreePreview: true }), lessonParams)
    expect(res.status).toBe(200)
  })

  it('calls prisma.lesson.update with correct id', async () => {
    mockAdmin()
    vi.mocked(prisma.lesson.update).mockResolvedValue(MOCK_LESSON as never)

    await PATCH_LESSON(makeRequest('PATCH', 'http://localhost', { title: 'New Title' }), lessonParams)

    expect(prisma.lesson.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'les_001' } })
    )
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.lesson.update).mockRejectedValue(new Error('DB error'))

    const res = await PATCH_LESSON(makeRequest('PATCH', 'http://localhost', { title: 'Updated' }), lessonParams)
    expect(res.status).toBe(500)
  })
})

// ── DELETE /api/admin/lessons/[id] ────────────────────────────────────────────

describe('DELETE /api/admin/lessons/[id]', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await DELETE_LESSON(new Request('http://localhost'), lessonParams)
    expect(res.status).toBe(401)
  })

  it('deletes lesson and returns success', async () => {
    mockAdmin()
    vi.mocked(prisma.lesson.delete).mockResolvedValue(MOCK_LESSON as never)

    const res = await DELETE_LESSON(new Request('http://localhost'), lessonParams)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('calls prisma.lesson.delete with correct id', async () => {
    mockAdmin()
    vi.mocked(prisma.lesson.delete).mockResolvedValue(MOCK_LESSON as never)

    await DELETE_LESSON(new Request('http://localhost'), lessonParams)

    expect(prisma.lesson.delete).toHaveBeenCalledWith({ where: { id: 'les_001' } })
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.lesson.delete).mockRejectedValue(new Error('DB error'))

    const res = await DELETE_LESSON(new Request('http://localhost'), lessonParams)
    expect(res.status).toBe(500)
  })
})
