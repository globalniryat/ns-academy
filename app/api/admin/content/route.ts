import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'
import { updateContentSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const content = await prisma.siteContent.findMany({ orderBy: { key: 'asc' } })
    return NextResponse.json({ success: true, data: content })
  } catch (error) {
    console.error('[GET /api/admin/content]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const parsed = updateContentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    await Promise.all(
      parsed.data.updates.map(({ key, value, type }) =>
        prisma.siteContent.upsert({
          where: { key },
          update: { value, type },
          create: { key, value, type },
        })
      )
    )

    revalidatePath('/')
    revalidatePath('/courses')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[POST /api/admin/content]', error)
    return NextResponse.json({ success: false, error: 'Failed to update content' }, { status: 500 })
  }
}
