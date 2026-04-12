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
    const [enrollments, userCertificates] = await Promise.all([
      prisma.enrollment.findMany({
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
      }),
      prisma.certificate.findMany({
        where: { userId: user.id },
        select: { id: true, courseId: true },
      }),
    ])

    const certByCourseId = new Map(userCertificates.map((c) => [c.courseId, c.id]))

    // Collect ALL lesson IDs in one pass, then do a single groupBy query
    const allLessonIds = enrollments.flatMap((e) =>
      e.course.sections.flatMap((s) => s.lessons.map((l) => l.id))
    )
    const completedProgress = await prisma.lessonProgress.groupBy({
      by: ['lessonId'],
      where: { userId: user.id, lessonId: { in: allLessonIds }, isCompleted: true },
      _count: { lessonId: true },
    })
    const completedSet = new Set(completedProgress.map((p) => p.lessonId))

    const enriched = enrollments.map((enrollment) => {
      const lessonIds = enrollment.course.sections.flatMap((s) => s.lessons.map((l) => l.id))
      const completedCount = lessonIds.filter((id) => completedSet.has(id)).length
      const totalLessons = lessonIds.length
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

    return NextResponse.json({ success: true, data: enriched })
  } catch (error) {
    console.error('[GET /api/enrollments]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch enrollments' }, { status: 500 })
  }
}
