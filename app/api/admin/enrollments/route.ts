import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const createSchema = z.object({
  userId: z.string().min(1),
  courseId: z.string().min(1),
  status: z.enum(['ACTIVE', 'COMPLETED', 'EXPIRED', 'REFUNDED']).default('ACTIVE'),
})

export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const enrollments = await prisma.enrollment.findMany({
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
      },
    })
    return NextResponse.json({ success: true, data: enrollments })
  } catch (error) {
    console.error('[GET /api/admin/enrollments]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch enrollments' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'userId and courseId are required.' }, { status: 400 })
    }

    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: parsed.data.userId, courseId: parsed.data.courseId } },
      update: { status: parsed.data.status },
      create: {
        userId: parsed.data.userId,
        courseId: parsed.data.courseId,
        status: parsed.data.status,
      },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    })
    return NextResponse.json({ success: true, data: enrollment }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/enrollments]', error)
    return NextResponse.json({ success: false, error: 'Failed to create enrollment' }, { status: 500 })
  }
}
