import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/content?keys=hero.headline,stats.1.number,...
// Returns { key: value } map for the requested keys
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keysParam = searchParams.get('keys')

    let items
    if (keysParam) {
      const keys = keysParam.split(',').map((k) => k.trim())
      items = await prisma.siteContent.findMany({ where: { key: { in: keys } } })
    } else {
      items = await prisma.siteContent.findMany({ orderBy: { key: 'asc' } })
    }

    const data: Record<string, string> = {}
    for (const item of items) {
      data[item.key] = item.value
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[GET /api/content]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch content' }, { status: 500 })
  }
}
