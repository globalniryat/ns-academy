import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { getRazorpay } from '@/lib/razorpay'
import { NextResponse } from 'next/server'
import { createOrderSchema } from '@/lib/validations'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = createOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    const { courseId } = parsed.data

    // Fetch course (price is server-authoritative — never trust client-side price)
    const course = await prisma.course.findUnique({
      where: { id: courseId, status: 'PUBLISHED' },
      select: { id: true, title: true, price: true, slug: true },
    })
    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
    }

    // Check not already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: user.id, courseId } },
    })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Already enrolled' }, { status: 409 })
    }

    // Create Razorpay order
    const rzp = getRazorpay()
    const receiptId = `rcpt_${Date.now()}_${user.id.slice(0, 8)}`
    const order = await rzp.orders.create({
      amount: course.price, // already in paise
      currency: 'INR',
      receipt: receiptId,
      notes: { courseId, userId: user.id, courseTitle: course.title },
    })

    // Persist payment record (CREATED state)
    await prisma.payment.create({
      data: {
        userId: user.id,
        courseId,
        amount: course.price,
        currency: 'INR',
        status: 'CREATED',
        razorpayOrderId: order.id,
        receiptId,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: course.price,
        currency: 'INR',
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        courseTitle: course.title,
      },
    })
  } catch (error) {
    console.error('[POST /api/payments/create-order]', error)
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 })
  }
}
