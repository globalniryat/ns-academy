import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/certificates — get all certificates for the authenticated user
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const certificates = await prisma.certificate.findMany({
      where: { userId: user.id },
      include: {
        course: { select: { title: true, slug: true } },
      },
      orderBy: { issuedAt: 'desc' },
    })

    return NextResponse.json({ success: true, data: certificates })
  } catch (error) {
    console.error('[GET /api/certificates]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch certificates' }, { status: 500 })
  }
}
