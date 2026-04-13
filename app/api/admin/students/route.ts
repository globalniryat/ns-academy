import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const students = await prisma.profile.findMany({
      where: { role: 'STUDENT' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true, phone: true,
        isActive: true, createdAt: true,
        _count: { select: { enrollments: true, certificates: true } },
      },
    })
    return NextResponse.json({ success: true, data: students })
  } catch (error) {
    console.error('[GET /api/admin/students]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch students' }, { status: 500 })
  }
}
