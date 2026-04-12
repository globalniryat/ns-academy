import { z } from 'zod'

// ── AUTH ──────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// ── COURSES ───────────────────────────────────────────────

export const courseSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(3),
  shortDescription: z.string().min(10),
  description: z.string().min(20),
  level: z.enum(['FOUNDATION', 'INTERMEDIATE', 'FINAL']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  price: z.number().int().positive(),
  originalPrice: z.number().int().positive(),
  duration: z.string(),
  color: z.string().default('#16a34a'),
  instructor: z.string().default('CA Nikesh Shah'),
  whatYoullLearn: z.array(z.string()).min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  freePreviewUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
})

export const sectionSchema = z.object({
  courseId: z.string(),
  title: z.string().min(2),
  sortOrder: z.number().int().default(0),
})

export const lessonSchema = z.object({
  sectionId: z.string(),
  title: z.string().min(2),
  videoUrl: z.string(),
  duration: z.string().optional(),
  description: z.string().optional(),
  isFreePreview: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
})

// ── PAYMENTS ──────────────────────────────────────────────

export const createOrderSchema = z.object({
  courseId: z.string().min(1),
})

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  courseId: z.string(),
})

// ── CONTENT ───────────────────────────────────────────────

export const updateContentSchema = z.object({
  updates: z.array(z.object({
    key: z.string(),
    value: z.string(),
    type: z.string().default('text'),
  })),
})

// ── TESTIMONIAL ───────────────────────────────────────────

export const testimonialSchema = z.object({
  name: z.string().min(2),
  college: z.string().optional(),
  role: z.string().optional(),
  quote: z.string().min(10),
  rating: z.number().int().min(1).max(5).default(5),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})

// ── FAQ ───────────────────────────────────────────────────

export const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})

// ── PROGRESS ──────────────────────────────────────────────

export const progressSchema = z.object({
  lessonId: z.string(),
  courseId: z.string(),
  isCompleted: z.boolean(),
  watchedSeconds: z.number().int().min(0).default(0),
})

// ── NOTES ─────────────────────────────────────────────────

export const noteSchema = z.object({
  lessonId: z.string().optional(),
  courseId: z.string().optional(),
  content: z.string(),
})
