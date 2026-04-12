import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { NextResponse } from 'next/server'
import { verifyPaymentSchema } from '@/lib/validations'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const parsed = verifyPaymentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = parsed.data

    // Verify HMAC-SHA256 signature — financial security boundary
    const isValid = verifyPaymentSignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    })

    if (!isValid) {
      // Mark payment as failed in DB for audit trail
      await prisma.payment.updateMany({
        where: { razorpayOrderId: razorpay_order_id, userId: user.id },
        data: { status: 'FAILED', failureReason: 'Invalid signature' },
      })
      return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 400 })
    }

    // Update payment to CAPTURED
    await prisma.payment.updateMany({
      where: { razorpayOrderId: razorpay_order_id, userId: user.id },
      data: {
        status: 'CAPTURED',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
    })

    // Create enrollment (idempotent — skip if already exists)
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId } },
      update: {}, // already enrolled — do nothing
      create: { userId: user.id, courseId, status: 'ACTIVE' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[POST /api/payments/verify]', error)
    return NextResponse.json({ success: false, error: 'Failed to verify payment' }, { status: 500 })
  }
}
