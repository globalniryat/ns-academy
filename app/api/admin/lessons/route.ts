import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { lessonSchema } from '@/lib/validations'

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const parsed = lessonSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    const lesson = await prisma.lesson.create({ data: parsed.data })
    return NextResponse.json({ success: true, data: lesson }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/lessons]', error)
    return NextResponse.json({ success: false, error: 'Failed to create lesson' }, { status: 500 })
  }
}
