import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'
import { createAdminClient } from '@/lib/supabase/admin'
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

export async function DELETE(_req: Request, { params }: Props) {
  const auth = await requireAdmin()
  if (auth.error) return auth.error
  const { id } = await params

  // Prevent admin from deleting themselves
  if (id === auth.userId) {
    return NextResponse.json({ success: false, error: 'Cannot delete your own account' }, { status: 400 })
  }

  try {
    // 1. Verify student exists and is not an admin
    const student = await prisma.profile.findUnique({
      where: { id },
      select: { role: true, email: true },
    })
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 })
    }
    if (student.role === 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Cannot delete an admin account' }, { status: 400 })
    }

    // 2. Delete from Prisma — onDelete: Cascade handles:
    //    Enrollment, LessonProgress, Payment, Certificate, UserNote
    await prisma.profile.delete({ where: { id } })

    // 3. Delete from Supabase auth.users (service role — bypasses RLS)
    const adminClient = createAdminClient()
    const { error: authError } = await adminClient.auth.admin.deleteUser(id)
    if (authError) {
      // Profile already deleted from DB; log but don't fail — user can't log in anyway
      console.error('[DELETE /api/admin/students/[id]] Supabase auth delete failed:', authError.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/students/[id]]', error)
    return NextResponse.json({ success: false, error: 'Failed to delete student' }, { status: 500 })
  }
}
