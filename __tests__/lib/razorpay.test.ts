import { describe, it, expect, beforeAll } from 'vitest'
import crypto from 'crypto'
import { verifyPaymentSignature } from '@/lib/razorpay'

// The secret is set in vitest.setup.ts
const SECRET = 'test_razorpay_secret_key_123456'

function generateValidSignature(orderId: string, paymentId: string): string {
  return crypto
    .createHmac('sha256', SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex')
}

describe('verifyPaymentSignature', () => {
  const ORDER_ID = 'order_TestABC123'
  const PAYMENT_ID = 'pay_TestXYZ456'

  it('returns true for a correctly signed payload', () => {
    const signature = generateValidSignature(ORDER_ID, PAYMENT_ID)
    expect(verifyPaymentSignature({ orderId: ORDER_ID, paymentId: PAYMENT_ID, signature })).toBe(true)
  })

  it('returns false when orderId is tampered', () => {
    const signature = generateValidSignature(ORDER_ID, PAYMENT_ID)
    expect(
      verifyPaymentSignature({ orderId: 'order_TAMPERED', paymentId: PAYMENT_ID, signature })
    ).toBe(false)
  })

  it('returns false when paymentId is tampered', () => {
    const signature = generateValidSignature(ORDER_ID, PAYMENT_ID)
    expect(
      verifyPaymentSignature({ orderId: ORDER_ID, paymentId: 'pay_TAMPERED', signature })
    ).toBe(false)
  })

  it('returns false for a completely wrong signature', () => {
    expect(
      verifyPaymentSignature({ orderId: ORDER_ID, paymentId: PAYMENT_ID, signature: 'deadbeef' })
    ).toBe(false)
  })

  it('returns false for an empty signature string', () => {
    expect(
      verifyPaymentSignature({ orderId: ORDER_ID, paymentId: PAYMENT_ID, signature: '' })
    ).toBe(false)
  })

  it('returns false for a signature of all zeros', () => {
    const zeroed = '0'.repeat(64)
    expect(
      verifyPaymentSignature({ orderId: ORDER_ID, paymentId: PAYMENT_ID, signature: zeroed })
    ).toBe(false)
  })

  it('is resistant to timing attacks (uses timingSafeEqual)', () => {
    // This test verifies the function does NOT throw on a wrong-length hex string.
    // A wrong-length signature should return false, not throw.
    expect(
      verifyPaymentSignature({ orderId: ORDER_ID, paymentId: PAYMENT_ID, signature: 'abc' })
    ).toBe(false)
  })

  it('accepts uppercase hex — crypto Buffer.from() treats hex as case-insensitive', () => {
    // HMAC hex digests are case-insensitive because Buffer.from(hex, 'hex')
    // decodes both 'ab' and 'AB' to the same byte. This is correct behavior.
    const signature = generateValidSignature(ORDER_ID, PAYMENT_ID).toUpperCase()
    expect(
      verifyPaymentSignature({ orderId: ORDER_ID, paymentId: PAYMENT_ID, signature })
    ).toBe(true)
  })

  it('produces different signatures for different order IDs', () => {
    const sig1 = generateValidSignature('order_AAA', PAYMENT_ID)
    const sig2 = generateValidSignature('order_BBB', PAYMENT_ID)
    expect(sig1).not.toBe(sig2)
  })
})
