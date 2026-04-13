import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { sectionSchema } from '@/lib/validations'

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const parsed = sectionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    const section = await prisma.section.create({ data: parsed.data })
    return NextResponse.json({ success: true, data: section }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/sections]', error)
    return NextResponse.json({ success: false, error: 'Failed to create section' }, { status: 500 })
  }
}
