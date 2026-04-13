import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { courseSchema } from '@/lib/validations'

interface Props { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { id } = await params

  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { sortOrder: 'asc' },
          include: { lessons: { orderBy: { sortOrder: 'asc' } } },
        },
        _count: { select: { enrollments: true } },
      },
    })
    if (!course) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: course })
  } catch (error) {
    console.error('[GET /api/admin/courses/[id]]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch course' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: Props) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { id } = await params

  try {
    const body = await request.json()
    const parsed = courseSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    const course = await prisma.course.update({ where: { id }, data: parsed.data })
    return NextResponse.json({ success: true, data: course })
  } catch (error) {
    console.error('[PATCH /api/admin/courses/[id]]', error)
    return NextResponse.json({ success: false, error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { id } = await params

  try {
    await prisma.course.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/courses/[id]]', error)
    return NextResponse.json({ success: false, error: 'Failed to delete course' }, { status: 500 })
  }
}
