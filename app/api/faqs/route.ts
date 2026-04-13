import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json({ success: true, data: faqs })
  } catch (error) {
    console.error('[GET /api/faqs]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch FAQs' }, { status: 500 })
  }
}
