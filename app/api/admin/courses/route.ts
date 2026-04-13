import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { courseSchema } from '@/lib/validations'

export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const courses = await prisma.course.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { enrollments: true, sections: true } } },
    })
    return NextResponse.json({ success: true, data: courses })
  } catch (error) {
    console.error('[GET /api/admin/courses]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const parsed = courseSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    const course = await prisma.course.create({ data: parsed.data })
    return NextResponse.json({ success: true, data: course }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/courses]', error)
    return NextResponse.json({ success: false, error: 'Failed to create course' }, { status: 500 })
  }
}
