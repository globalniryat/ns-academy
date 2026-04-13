import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Mocks (hoisted) ───────────────────────────────────────────────────────────
vi.mock('@/lib/admin-auth', () => ({ requireAdmin: vi.fn() }))
vi.mock('@/lib/prisma', () => ({
  prisma: {
    siteContent: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
  },
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

import { GET, POST } from '@/app/api/admin/content/route'
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

function makePostRequest(body: unknown) {
  return new Request('http://localhost/api/admin/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const MOCK_CONTENT_ITEMS = [
  { id: 'cnt_001', key: 'hero_title', value: 'Master CA with NS Academy', type: 'text', updatedAt: new Date() },
  { id: 'cnt_002', key: 'hero_subtitle', value: 'Industry-leading CA coaching', type: 'text', updatedAt: new Date() },
  { id: 'cnt_003', key: 'stats_students', value: '5000+', type: 'text', updatedAt: new Date() },
]

// ── GET /api/admin/content ────────────────────────────────────────────────────

describe('GET /api/admin/content', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns all site content items', async () => {
    mockAdmin()
    vi.mocked(prisma.siteContent.findMany).mockResolvedValue(MOCK_CONTENT_ITEMS as never)

    const res = await GET()
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.data).toHaveLength(3)
    expect(json.data[0].key).toBe('hero_title')
  })

  it('queries content ordered by key ascending', async () => {
    mockAdmin()
    vi.mocked(prisma.siteContent.findMany).mockResolvedValue([])

    await GET()

    expect(prisma.siteContent.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { key: 'asc' } })
    )
  })

  it('returns empty array when no content exists', async () => {
    mockAdmin()
    vi.mocked(prisma.siteContent.findMany).mockResolvedValue([])

    const res = await GET()
    const json = await res.json()
    expect(json.data).toEqual([])
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.siteContent.findMany).mockRejectedValue(new Error('DB error'))

    const res = await GET()
    expect(res.status).toBe(500)
  })
})

// ── POST /api/admin/content (bulk upsert) ─────────────────────────────────────

describe('POST /api/admin/content', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 when not authenticated', async () => {
    mockUnauthorized()
    const res = await POST(makePostRequest({ updates: [{ key: 'hero_title', value: 'New Title' }] }))
    expect(res.status).toBe(401)
  })

  it('returns 400 when updates field is missing', async () => {
    mockAdmin()
    const res = await POST(makePostRequest({}))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
  })

  it('returns 400 when updates is not an array', async () => {
    mockAdmin()
    const res = await POST(makePostRequest({ updates: 'not-an-array' }))
    expect(res.status).toBe(400)
  })

  it('upserts all content items in a single request', async () => {
    mockAdmin()
    vi.mocked(prisma.siteContent.upsert).mockResolvedValue(MOCK_CONTENT_ITEMS[0] as never)

    const updates = [
      { key: 'hero_title', value: 'Updated Hero Title', type: 'text' },
      { key: 'hero_subtitle', value: 'Updated Subtitle', type: 'text' },
    ]

    const res = await POST(makePostRequest({ updates }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('calls prisma.siteContent.upsert once per update item', async () => {
    mockAdmin()
    vi.mocked(prisma.siteContent.upsert).mockResolvedValue(MOCK_CONTENT_ITEMS[0] as never)

    const updates = [
      { key: 'hero_title', value: 'Title 1', type: 'text' },
      { key: 'hero_subtitle', value: 'Subtitle 1', type: 'text' },
      { key: 'stats_students', value: '6000+', type: 'text' },
    ]

    await POST(makePostRequest({ updates }))

    expect(prisma.siteContent.upsert).toHaveBeenCalledTimes(3)
  })

  it('uses correct upsert shape: where=key, update+create with value and type', async () => {
    mockAdmin()
    vi.mocked(prisma.siteContent.upsert).mockResolvedValue(MOCK_CONTENT_ITEMS[0] as never)

    await POST(makePostRequest({
      updates: [{ key: 'hero_title', value: 'Test Value', type: 'text' }],
    }))

    expect(prisma.siteContent.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { key: 'hero_title' },
        update: expect.objectContaining({ value: 'Test Value', type: 'text' }),
        create: expect.objectContaining({ key: 'hero_title', value: 'Test Value', type: 'text' }),
      })
    )
  })

  it('revalidates both "/" and "/courses" paths after save', async () => {
    mockAdmin()
    vi.mocked(prisma.siteContent.upsert).mockResolvedValue(MOCK_CONTENT_ITEMS[0] as never)

    await POST(makePostRequest({ updates: [{ key: 'hero_title', value: 'Test' }] }))

    expect(revalidatePath).toHaveBeenCalledWith('/')
    expect(revalidatePath).toHaveBeenCalledWith('/courses')
  })

  it('handles empty updates array (no-op)', async () => {
    mockAdmin()
    const res = await POST(makePostRequest({ updates: [] }))
    expect(res.status).toBe(200)
    expect(prisma.siteContent.upsert).not.toHaveBeenCalled()
  })

  it('defaults type to "text" when not provided', async () => {
    mockAdmin()
    vi.mocked(prisma.siteContent.upsert).mockResolvedValue(MOCK_CONTENT_ITEMS[0] as never)

    await POST(makePostRequest({
      updates: [{ key: 'hero_title', value: 'Some Value' }],
    }))

    expect(prisma.siteContent.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({ type: 'text' }),
      })
    )
  })

  it('returns 500 on database error', async () => {
    mockAdmin()
    vi.mocked(prisma.siteContent.upsert).mockRejectedValue(new Error('DB error'))

    const res = await POST(makePostRequest({
      updates: [{ key: 'hero_title', value: 'Test' }],
    }))
    expect(res.status).toBe(500)
  })
})
