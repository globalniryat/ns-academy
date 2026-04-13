import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
})

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Valid email is required.' }, { status: 400 })
    }

    const profile = await prisma.profile.findUnique({
      where: { email: parsed.data.email },
      select: { id: true, email: true, name: true, role: true },
    })

    if (!profile) {
      return NextResponse.json({ success: false, error: 'No account found with that email.' }, { status: 404 })
    }

    if (profile.role === 'ADMIN') {
      return NextResponse.json({ success: false, error: 'This user is already an admin.' }, { status: 409 })
    }

    const updated = await prisma.profile.update({
      where: { id: profile.id },
      data: { role: 'ADMIN' },
      select: { id: true, email: true, name: true, role: true },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('[POST /api/admin/settings/promote]', error)
    return NextResponse.json({ success: false, error: 'Failed to promote user.' }, { status: 500 })
  }
}
