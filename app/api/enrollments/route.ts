import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id, status: { in: ['ACTIVE', 'COMPLETED'] } },
      include: {
        course: {
          include: {
            sections: {
              include: {
                lessons: { select: { id: true } },
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    })

    // Calculate progress for each enrollment
    // Fetch all user certificates in one query to avoid N+1
    const userCertificates = await prisma.certificate.findMany({
      where: { userId: user.id },
      select: { id: true, courseId: true },
    })
    const certByCourseId = new Map(userCertificates.map((c) => [c.courseId, c.id]))

    const enriched = await Promise.all(
      enrollments.map(async (enrollment) => {
        const totalLessons = enrollment.course.sections.reduce(
          (sum, s) => sum + s.lessons.length, 0
        )
        const lessonIds = enrollment.course.sections.flatMap((s) => s.lessons.map((l) => l.id))

        const completedCount = await prisma.lessonProgress.count({
          where: {
            userId: user.id,
            lessonId: { in: lessonIds },
            isCompleted: true,
          },
        })

        const progressPercent = totalLessons > 0
          ? Math.round((completedCount / totalLessons) * 100)
          : 0

        return {
          id: enrollment.id,
          status: enrollment.status,
          enrolledAt: enrollment.enrolledAt,
          certificateId: certByCourseId.get(enrollment.course.id) ?? null,
          course: {
            id: enrollment.course.id,
            slug: enrollment.course.slug,
            title: enrollment.course.title,
            level: enrollment.course.level,
            duration: enrollment.course.duration,
            color: enrollment.course.color,
            thumbnailUrl: enrollment.course.thumbnailUrl,
          },
          progress: {
            completed: completedCount,
            total: totalLessons,
            percent: progressPercent,
          },
        }
      })
    )

    return NextResponse.json({ success: true, data: enriched })
  } catch (error) {
    console.error('[GET /api/enrollments]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch enrollments' }, { status: 500 })
  }
}
