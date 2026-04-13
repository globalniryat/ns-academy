import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    profile: { findUnique: vi.fn() },
  },
}))

import { requireAdmin } from '@/lib/admin-auth'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockAuth(userId: string | null) {
  vi.mocked(createClient).mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: userId ? { id: userId } : null },
      }),
    },
  } as never)
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('requireAdmin', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 401 NextResponse when no user is authenticated', async () => {
    mockAuth(null)

    const result = await requireAdmin()
    expect(result.error).toBeDefined()

    const json = await result.error!.json()
    expect(json.error).toBe('Unauthorized')
    // Verify HTTP status
    expect(result.error!.status).toBe(401)
  })

  it('returns 403 when authenticated user has STUDENT role', async () => {
    mockAuth('user_student_001')
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({ role: 'STUDENT' } as never)

    const result = await requireAdmin()
    expect(result.error).toBeDefined()
    expect(result.error!.status).toBe(403)
    const json = await result.error!.json()
    expect(json.error).toBe('Forbidden')
  })

  it('returns 403 when profile does not exist in DB', async () => {
    mockAuth('user_ghost')
    vi.mocked(prisma.profile.findUnique).mockResolvedValue(null)

    const result = await requireAdmin()
    expect(result.error).toBeDefined()
    expect(result.error!.status).toBe(403)
  })

  it('returns userId when user has ADMIN role', async () => {
    mockAuth('user_admin_001')
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)

    const result = await requireAdmin()
    expect(result.error).toBeUndefined()
    expect(result.userId).toBe('user_admin_001')
  })

  it('queries profile with the correct userId from Supabase session', async () => {
    mockAuth('user_specific_id')
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)

    await requireAdmin()

    expect(prisma.profile.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user_specific_id' },
      })
    )
  })

  it('only selects the role field from profile (minimal query)', async () => {
    mockAuth('user_admin_001')
    vi.mocked(prisma.profile.findUnique).mockResolvedValue({ role: 'ADMIN' } as never)

    await requireAdmin()

    expect(prisma.profile.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        select: { role: true },
      })
    )
  })
})
