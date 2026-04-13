import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  // params is a Promise in Next.js 16
  const { slug } = await params

  try {
    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { sortOrder: 'asc' },
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                title: true,
                description: true,
                videoUrl: true,
                duration: true,
                isFreePreview: true,
                sortOrder: true,
              },
            },
          },
        },
        courseNotes: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, title: true, fileUrl: true, sortOrder: true },
        },
        _count: { select: { enrollments: true } },
      },
    })

    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: course })
  } catch (error) {
    console.error(`[GET /api/courses/${slug}]`, error)
    return NextResponse.json({ success: false, error: 'Failed to fetch course' }, { status: 500 })
  }
}
