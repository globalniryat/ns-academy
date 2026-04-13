import Razorpay from 'razorpay'
import crypto from 'crypto'

// Singleton to avoid recreating on every request in development
let _razorpay: Razorpay | null = null

export function getRazorpay(): Razorpay {
  if (!_razorpay) {
    _razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
  }
  return _razorpay
}

/**
 * Verify Razorpay payment signature (HMAC-SHA256).
 * The signed payload is: `${orderId}|${paymentId}`
 */
export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string
  paymentId: string
  signature: string
}): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(signature, 'hex')
    )
  } catch {
    // Malformed or wrong-length signature
    return false
  }
}
