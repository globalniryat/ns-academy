import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { testimonialSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ success: true, data: testimonials })
  } catch (error) {
    console.error('[GET /api/admin/testimonials]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const parsed = testimonialSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    const testimonial = await prisma.testimonial.create({ data: parsed.data })
    revalidatePath('/')
    return NextResponse.json({ success: true, data: testimonial }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/testimonials]', error)
    return NextResponse.json({ success: false, error: 'Failed to create testimonial' }, { status: 500 })
  }
}
