import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { sectionSchema } from '@/lib/validations'

interface Props { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Props) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { id } = await params

  try {
    const body = await request.json()
    const parsed = sectionSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    const section = await prisma.section.update({ where: { id }, data: parsed.data })
    return NextResponse.json({ success: true, data: section })
  } catch (error) {
    console.error('[PATCH /api/admin/sections/[id]]', error)
    return NextResponse.json({ success: false, error: 'Failed to update section' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { id } = await params

  try {
    await prisma.section.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/sections/[id]]', error)
    return NextResponse.json({ success: false, error: 'Failed to delete section' }, { status: 500 })
  }
}
