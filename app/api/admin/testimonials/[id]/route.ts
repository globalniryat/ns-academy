import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { testimonialSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

interface Props { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Props) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { id } = await params

  try {
    const body = await request.json()
    const parsed = testimonialSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    const testimonial = await prisma.testimonial.update({ where: { id }, data: parsed.data })
    revalidatePath('/')
    return NextResponse.json({ success: true, data: testimonial })
  } catch (error) {
    console.error('[PATCH /api/admin/testimonials/[id]]', error)
    return NextResponse.json({ success: false, error: 'Failed to update testimonial' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { id } = await params

  try {
    await prisma.testimonial.delete({ where: { id } })
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/testimonials/[id]]', error)
    return NextResponse.json({ success: false, error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
