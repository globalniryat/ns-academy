import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const updateSchema = z.object({
  status: z.enum(['ACTIVE', 'COMPLETED', 'EXPIRED', 'REFUNDED']).optional(),
  expiresAt: z.string().datetime({ offset: true }).nullable().optional(),
  completedAt: z.string().datetime({ offset: true }).nullable().optional(),
})

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const { id } = await params
  try {
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid data.' }, { status: 400 })
    }

    const data: Record<string, unknown> = {}
    if (parsed.data.status !== undefined) data.status = parsed.data.status
    if (parsed.data.expiresAt !== undefined) data.expiresAt = parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null
    if (parsed.data.completedAt !== undefined) data.completedAt = parsed.data.completedAt ? new Date(parsed.data.completedAt) : null
    if (parsed.data.status === 'COMPLETED' && !parsed.data.completedAt) data.completedAt = new Date()

    const enrollment = await prisma.enrollment.update({ where: { id }, data })
    return NextResponse.json({ success: true, data: enrollment })
  } catch (error) {
    console.error('[PATCH /api/admin/enrollments/[id]]', error)
    return NextResponse.json({ success: false, error: 'Failed to update enrollment' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  const { id } = await params
  try {
    await prisma.enrollment.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/enrollments/[id]]', error)
    return NextResponse.json({ success: false, error: 'Failed to delete enrollment' }, { status: 500 })
  }
}
