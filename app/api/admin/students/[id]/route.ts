import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { NextResponse } from 'next/server'

interface Props { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { id } = await params

  try {
    const student = await prisma.profile.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: { course: { select: { title: true, slug: true } } },
          orderBy: { enrolledAt: 'desc' },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            status: true,
            razorpayOrderId: true,
            razorpayPaymentId: true,
            // razorpaySignature intentionally excluded — never expose HMAC secrets
            createdAt: true,
            course: { select: { title: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        certificates: {
          include: { course: { select: { title: true } } },
          orderBy: { issuedAt: 'desc' },
        },
      },
    })
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: student })
  } catch (error) {
    console.error('[GET /api/admin/students/[id]]', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch student' }, { status: 500 })
  }
}
