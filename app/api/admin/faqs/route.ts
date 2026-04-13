import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { faqSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const faqs = await prisma.fAQ.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ success: true, data: faqs })
  } catch (error) {
    console.error('[GET /api/admin/faqs]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch FAQs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const parsed = faqSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    const faq = await prisma.fAQ.create({ data: parsed.data })
    revalidatePath('/')
    return NextResponse.json({ success: true, data: faq }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/faqs]', error)
    return NextResponse.json({ success: false, error: 'Failed to create FAQ' }, { status: 500 })
  }
}
