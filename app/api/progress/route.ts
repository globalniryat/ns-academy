import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { progressSchema } from '@/lib/validations'

// GET /api/progress?courseId=xxx — get all lesson progress for a course
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const courseId = searchParams.get('courseId')
  if (!courseId) return NextResponse.json({ success: false, error: 'courseId required' }, { status: 400 })

  try {
    // Verify the user is enrolled before exposing any lesson data
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
    })
    if (!enrollment) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    // Get all lesson IDs in the course
    const lessons = await prisma.lesson.findMany({
      where: { section: { courseId } },
      select: { id: true },
    })
    const lessonIds = lessons.map((l) => l.id)

    const progress = await prisma.lessonProgress.findMany({
      where: { userId: user.id, lessonId: { in: lessonIds } },
    })

    // Return as a map of lessonId → progress
    const progressMap: Record<string, { isCompleted: boolean; watchedSeconds: number }> = {}
    for (const p of progress) {
      progressMap[p.lessonId] = {
        isCompleted: p.isCompleted,
        watchedSeconds: p.watchedSeconds,
      }
    }

    return NextResponse.json({ success: true, data: progressMap })
  } catch (error) {
    console.error('[GET /api/progress]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch progress' }, { status: 500 })
  }
}

// POST /api/progress — mark lesson complete/incomplete
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = progressSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    const { lessonId, courseId, isCompleted, watchedSeconds } = parsed.data

    // Verify user is enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
    })
    if (!enrollment) {
      return NextResponse.json({ success: false, error: 'Not enrolled' }, { status: 403 })
    }

    // Upsert progress
    const progress = await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId } },
      update: { isCompleted, watchedSeconds, lastWatchedAt: new Date() },
      create: { userId: user.id, lessonId, isCompleted, watchedSeconds },
    })

    // Check if ALL lessons in course are completed → generate certificate
    let courseCompleted = false
    let certificateId: string | null = null

    if (isCompleted) {
      const allLessons = await prisma.lesson.findMany({
        where: { section: { courseId } },
        select: { id: true },
      })
      const allIds = allLessons.map((l) => l.id)

      const completedCount = await prisma.lessonProgress.count({
        where: { userId: user.id, lessonId: { in: allIds }, isCompleted: true },
      })

      if (completedCount >= allIds.length && allIds.length > 0) {
        // All lessons done — mark enrollment complete
        await prisma.enrollment.update({
          where: { userId_courseId: { userId: user.id, courseId } },
          data: { status: 'COMPLETED', completedAt: new Date() },
        })

        // Create certificate if doesn't exist
        const existing = await prisma.certificate.findUnique({
          where: { userId_courseId: { userId: user.id, courseId } },
        })

        if (!existing) {
          const year = new Date().getFullYear()
          const count = await prisma.certificate.count()
          const certNo = `NSA-${year}-${String(count + 1).padStart(5, '0')}`
          const cert = await prisma.certificate.create({
            data: { userId: user.id, courseId, certificateNo: certNo },
          })
          certificateId = cert.id
          courseCompleted = true
        } else {
          certificateId = existing.id
          courseCompleted = true
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: progress,
      courseCompleted,
      certificateId,
    })
  } catch (error) {
    console.error('[POST /api/progress]', error)
    return NextResponse.json({ success: false, error: 'Failed to update progress' }, { status: 500 })
  }
}
