import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { noteSchema } from '@/lib/validations'

// GET /api/notes?lessonId=xxx — get user's notes for a lesson
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const lessonId = searchParams.get('lessonId')
  const courseId = searchParams.get('courseId')

  try {
    const where: Record<string, unknown> = { userId: user.id }
    if (lessonId) where.lessonId = lessonId
    if (courseId) where.courseId = courseId

    const notes = await prisma.userNote.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: notes })
  } catch (error) {
    console.error('[GET /api/notes]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch notes' }, { status: 500 })
  }
}

// POST /api/notes — upsert user note for a lesson
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = noteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    const { lessonId, courseId, content } = parsed.data

    // Verify enrollment before allowing note creation
    if (courseId) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: user.id, courseId } },
      })
      if (!enrollment) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      }
    }

    // Upsert note for this user+lesson combo
    let note
    if (lessonId) {
      const existing = await prisma.userNote.findFirst({
        where: { userId: user.id, lessonId },
      })
      if (existing) {
        note = await prisma.userNote.update({
          where: { id: existing.id },
          data: { content },
        })
      } else {
        note = await prisma.userNote.create({
          data: { userId: user.id, lessonId, courseId, content },
        })
      }
    } else {
      note = await prisma.userNote.create({
        data: { userId: user.id, courseId, content },
      })
    }

    return NextResponse.json({ success: true, data: note })
  } catch (error) {
    console.error('[POST /api/notes]', error)
    return NextResponse.json({ success: false, error: 'Failed to save note' }, { status: 500 })
  }
}
