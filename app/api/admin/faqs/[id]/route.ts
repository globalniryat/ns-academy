import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { faqSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

interface Props { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Props) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { id } = await params

  try {
    const body = await request.json()
    const parsed = faqSchema.partial().safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    const faq = await prisma.fAQ.update({ where: { id }, data: parsed.data })
    revalidatePath('/')
    return NextResponse.json({ success: true, data: faq })
  } catch (error) {
    console.error('[PATCH /api/admin/faqs/[id]]', error)
    return NextResponse.json({ success: false, error: 'Failed to update FAQ' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { id } = await params

  try {
    await prisma.fAQ.delete({ where: { id } })
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/faqs/[id]]', error)
    return NextResponse.json({ success: false, error: 'Failed to delete FAQ' }, { status: 500 })
  }
}
