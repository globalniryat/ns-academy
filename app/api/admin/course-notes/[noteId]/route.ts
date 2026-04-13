import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

export async function DELETE(_req: Request, { params }: { params: Promise<{ noteId: string }> }) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const { noteId } = await params
  try {
    await prisma.courseNote.delete({ where: { id: noteId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/course-notes/[noteId]]', error)
    return NextResponse.json({ success: false, error: 'Failed to delete note' }, { status: 500 })
  }
}
