import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  registerSchema,
  courseSchema,
  createOrderSchema,
  verifyPaymentSchema,
  progressSchema,
  noteSchema,
  testimonialSchema,
  faqSchema,
} from '@/lib/validations'

// ── loginSchema ───────────────────────────────────────────────────────────────

describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginSchema.safeParse({ email: 'student@example.com', password: 'secret123' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'secret123' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Invalid email address')
  })

  it('rejects password shorter than 6 characters', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: '12345' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/6 characters/)
  })

  it('rejects missing password', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com' })
    expect(result.success).toBe(false)
  })
})

// ── registerSchema ────────────────────────────────────────────────────────────

describe('registerSchema', () => {
  const valid = {
    name: 'Nikesh Shah',
    email: 'nikesh@example.com',
    password: 'SecurePass1',
    confirmPassword: 'SecurePass1',
  }

  it('accepts valid registration data', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects name shorter than 2 characters', () => {
    const result = registerSchema.safeParse({ ...valid, name: 'N' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/2 characters/)
  })

  it('rejects password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({ ...valid, password: 'Short1', confirmPassword: 'Short1' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toMatch(/8 characters/)
  })

  it('rejects when passwords do not match', () => {
    const result = registerSchema.safeParse({ ...valid, confirmPassword: 'DifferentPass1' })
    expect(result.success).toBe(false)
    const issue = result.error?.issues.find((i) => i.path.includes('confirmPassword'))
    expect(issue?.message).toBe('Passwords do not match')
  })

  it('accepts registration without optional phone', () => {
    const { ...data } = valid
    expect(registerSchema.safeParse(data).success).toBe(true)
  })

  it('accepts registration with optional phone', () => {
    expect(registerSchema.safeParse({ ...valid, phone: '9876543210' }).success).toBe(true)
  })
})

// ── courseSchema ──────────────────────────────────────────────────────────────

describe('courseSchema', () => {
  const validCourse = {
    slug: 'ca-final-sfm',
    title: 'CA Final SFM',
    shortDescription: 'Learn SFM from scratch',
    description: 'Comprehensive course covering all SFM topics for CA Final.',
    level: 'FINAL' as const,
    price: 399900,
    originalPrice: 800000,
    duration: '35 hours',
    whatYoullLearn: ['Portfolio theory', 'Derivatives'],
  }

  it('accepts a valid course', () => {
    expect(courseSchema.safeParse(validCourse).success).toBe(true)
  })

  it('rejects invalid level enum', () => {
    const result = courseSchema.safeParse({ ...validCourse, level: 'BEGINNER' })
    expect(result.success).toBe(false)
  })

  it('rejects price of 0', () => {
    const result = courseSchema.safeParse({ ...validCourse, price: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects negative price', () => {
    const result = courseSchema.safeParse({ ...validCourse, price: -100 })
    expect(result.success).toBe(false)
  })

  it('rejects empty whatYoullLearn array', () => {
    const result = courseSchema.safeParse({ ...validCourse, whatYoullLearn: [] })
    expect(result.success).toBe(false)
  })

  it('rejects title shorter than 3 characters', () => {
    const result = courseSchema.safeParse({ ...validCourse, title: 'CA' })
    expect(result.success).toBe(false)
  })

  it('defaults color to #16a34a when omitted', () => {
    const result = courseSchema.safeParse(validCourse)
    expect(result.success).toBe(true)
    expect(result.data?.color).toBe('#16a34a')
  })

  it('defaults status to DRAFT when omitted', () => {
    const result = courseSchema.safeParse(validCourse)
    expect(result.data?.status).toBe('DRAFT')
  })
})

// ── createOrderSchema ─────────────────────────────────────────────────────────

describe('createOrderSchema', () => {
  it('accepts a non-empty courseId', () => {
    expect(createOrderSchema.safeParse({ courseId: 'course_sfm_001' }).success).toBe(true)
  })

  it('rejects empty courseId', () => {
    expect(createOrderSchema.safeParse({ courseId: '' }).success).toBe(false)
  })

  it('rejects missing courseId', () => {
    expect(createOrderSchema.safeParse({}).success).toBe(false)
  })
})

// ── verifyPaymentSchema ───────────────────────────────────────────────────────

describe('verifyPaymentSchema', () => {
  const valid = {
    razorpay_order_id: 'order_abc123',
    razorpay_payment_id: 'pay_xyz789',
    razorpay_signature: 'abc123def456',
    courseId: 'course_sfm_001',
  }

  it('accepts all required fields', () => {
    expect(verifyPaymentSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects missing signature', () => {
    const { razorpay_signature: _sig, ...rest } = valid
    expect(verifyPaymentSchema.safeParse(rest).success).toBe(false)
  })

  it('rejects missing courseId', () => {
    const { courseId: _cid, ...rest } = valid
    expect(verifyPaymentSchema.safeParse(rest).success).toBe(false)
  })
})

// ── progressSchema ────────────────────────────────────────────────────────────

describe('progressSchema', () => {
  it('accepts valid mark-complete payload', () => {
    const result = progressSchema.safeParse({
      lessonId: 'lesson_001',
      courseId: 'course_sfm_001',
      isCompleted: true,
      watchedSeconds: 300,
    })
    expect(result.success).toBe(true)
  })

  it('defaults watchedSeconds to 0', () => {
    const result = progressSchema.safeParse({
      lessonId: 'lesson_001',
      courseId: 'course_sfm_001',
      isCompleted: false,
    })
    expect(result.success).toBe(true)
    expect(result.data?.watchedSeconds).toBe(0)
  })

  it('rejects negative watchedSeconds', () => {
    const result = progressSchema.safeParse({
      lessonId: 'lesson_001',
      courseId: 'course_sfm_001',
      isCompleted: true,
      watchedSeconds: -10,
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-boolean isCompleted', () => {
    const result = progressSchema.safeParse({
      lessonId: 'lesson_001',
      courseId: 'course_sfm_001',
      isCompleted: 'yes',
      watchedSeconds: 0,
    })
    expect(result.success).toBe(false)
  })
})

// ── noteSchema ────────────────────────────────────────────────────────────────

describe('noteSchema', () => {
  it('accepts content with lessonId', () => {
    expect(noteSchema.safeParse({ lessonId: 'l1', content: 'My note' }).success).toBe(true)
  })

  it('accepts content without lessonId or courseId (both optional)', () => {
    expect(noteSchema.safeParse({ content: 'General note' }).success).toBe(true)
  })

  it('accepts empty string content (saving blank note is valid)', () => {
    expect(noteSchema.safeParse({ lessonId: 'l1', content: '' }).success).toBe(true)
  })
})

// ── testimonialSchema ─────────────────────────────────────────────────────────

describe('testimonialSchema', () => {
  const valid = { name: 'Priya S', quote: 'Amazing course, cleared my concepts.' }

  it('accepts valid testimonial', () => {
    expect(testimonialSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects rating above 5', () => {
    expect(testimonialSchema.safeParse({ ...valid, rating: 6 }).success).toBe(false)
  })

  it('rejects rating below 1', () => {
    expect(testimonialSchema.safeParse({ ...valid, rating: 0 }).success).toBe(false)
  })

  it('rejects quote shorter than 10 characters', () => {
    expect(testimonialSchema.safeParse({ ...valid, quote: 'Short' }).success).toBe(false)
  })

  it('defaults rating to 5', () => {
    const result = testimonialSchema.safeParse(valid)
    expect(result.data?.rating).toBe(5)
  })
})

// ── faqSchema ─────────────────────────────────────────────────────────────────

describe('faqSchema', () => {
  it('accepts valid FAQ', () => {
    expect(
      faqSchema.safeParse({ question: 'What is CA Final?', answer: 'It is the final level of CA exams.' }).success
    ).toBe(true)
  })

  it('rejects question shorter than 5 characters', () => {
    expect(faqSchema.safeParse({ question: 'Why?', answer: 'Because it is.' }).success).toBe(false)
  })

  it('rejects answer shorter than 10 characters', () => {
    expect(faqSchema.safeParse({ question: 'What is it?', answer: 'Short' }).success).toBe(false)
  })
})
