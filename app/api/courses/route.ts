import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        shortDescription: true,
        level: true,
        price: true,
        originalPrice: true,
        duration: true,
        thumbnailUrl: true,
        freePreviewUrl: true,
        color: true,
        instructor: true,
        rating: true,
        totalRatings: true,
        _count: {
          select: { sections: true, enrollments: true },
        },
      },
    })

    return NextResponse.json({ success: true, data: courses })
  } catch (error) {
    console.error('[GET /api/courses]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch courses' }, { status: 500 })
  }
}
