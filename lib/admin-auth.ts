import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

type AdminAuthResult =
  | { userId: string; error?: never }
  | { error: NextResponse; userId?: never }

/**
 * Verify the request comes from an authenticated ADMIN user.
 * Returns `{ userId }` on success or `{ error: NextResponse }` to short-circuit the handler.
 */
export async function requireAdmin(): Promise<AdminAuthResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }) }
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: { role: true },
  })

  if (!profile || profile.role !== 'ADMIN') {
    return { error: NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 }) }
  }

  return { userId: user.id }
}
