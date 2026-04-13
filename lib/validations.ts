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
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  title: z.string().min(3).max(200),
  shortDescription: z.string().min(10).max(500),
  description: z.string().min(20).max(10000),
  level: z.enum(['FOUNDATION', 'INTERMEDIATE', 'FINAL']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  price: z.number().int().positive().max(10_000_000), // max ₹1,00,000 (in paise)
  originalPrice: z.number().int().positive().max(10_000_000),
  duration: z.string().max(50),
  color: z.string().max(20).default('#16a34a'),
  instructor: z.string().max(100).default('CA Nikesh Shah'),
  whatYoullLearn: z.array(z.string().max(200)).min(1).max(20),
  metaTitle: z.string().max(100).optional(),
  metaDescription: z.string().max(300).optional(),
  freePreviewUrl: z.string().url().optional().or(z.literal('')),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
})

export const sectionSchema = z.object({
  courseId: z.string(),
  title: z.string().min(2),
  sortOrder: z.number().int().default(0),
})

export const lessonSchema = z.object({
  sectionId: z.string(),
  title: z.string().min(2).max(200),
  videoUrl: z.string().url('Must be a valid URL'),
  duration: z.string().max(20).optional(),
  description: z.string().max(2000).optional(),
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
  name: z.string().min(2).max(100),
  college: z.string().max(150).optional(),
  role: z.string().max(100).optional(),
  quote: z.string().min(10).max(1000),
  rating: z.number().int().min(1).max(5).default(5),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})

// ── FAQ ───────────────────────────────────────────────────

export const faqSchema = z.object({
  question: z.string().min(5).max(300),
  answer: z.string().min(10).max(3000),
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
