import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json({ success: true, data: testimonials })
  } catch (error) {
    console.error('[GET /api/testimonials]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch testimonials' }, { status: 500 })
  }
}
