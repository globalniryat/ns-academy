import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const noteSchema = z.object({
  title: z.string().min(1),
  fileUrl: z.string().min(1),
})

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const { id } = await params
  try {
    const notes = await prisma.courseNote.findMany({
      where: { courseId: id },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json({ success: true, data: notes })
  } catch (error) {
    console.error('[GET /api/admin/courses/[id]/notes]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch notes' }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const { id } = await params
  try {
    const body = await request.json()
    const parsed = noteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Title and URL are required.' }, { status: 400 })
    }

    const count = await prisma.courseNote.count({ where: { courseId: id } })
    const note = await prisma.courseNote.create({
      data: { courseId: id, title: parsed.data.title, fileUrl: parsed.data.fileUrl, sortOrder: count },
    })
    return NextResponse.json({ success: true, data: note }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/courses/[id]/notes]', error)
    return NextResponse.json({ success: false, error: 'Failed to create note' }, { status: 500 })
  }
}
