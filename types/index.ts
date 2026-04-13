/**
 * Shared domain types for NS Academy CA Learning Portal.
 *
 * These are the canonical TypeScript types for the application domain.
 * They mirror the Prisma schema and are used across pages, components,
 * and API routes. Prisma-generated types are used for DB queries directly;
 * these types represent the shapes passed through the UI layer.
 */

// ── Enums (mirrors Prisma schema) ─────────────────────────────────────────────

export type Role = 'STUDENT' | 'ADMIN'

export type CourseLevel = 'FOUNDATION' | 'INTERMEDIATE' | 'FINAL'

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export type EnrollmentStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED' | 'REFUNDED'

export type PaymentStatus = 'CREATED' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED'

// ── Course ────────────────────────────────────────────────────────────────────

export interface Course {
  id: string
  slug: string
  title: string
  shortDescription: string
  description: string
  instructor: string
  level: CourseLevel
  status: CourseStatus
  /** Price in paise (₹1 = 100 paise) */
  price: number
  /** Original/crossed-out price in paise */
  originalPrice: number | null
  duration: string
  thumbnailUrl: string | null
  freePreviewUrl: string | null
  accentColor: string
  whatYoullLearn: string[]
  metaTitle: string | null
  metaDescription: string | null
  createdAt: Date
}

export interface Section {
  id: string
  courseId: string
  title: string
  sortOrder: number
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  sectionId: string
  title: string
  videoUrl: string
  duration: string | null
  isFreePreview: boolean
  sortOrder: number
}

export interface CourseNote {
  id: string
  courseId: string
  title: string
  fileUrl: string
}

// ── User / Auth ───────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string
  name: string | null
  email: string
  phone: string
  role: Role
  isActive: boolean
  createdAt: Date
}

// ── Enrollment ────────────────────────────────────────────────────────────────

export interface Enrollment {
  id: string
  userId: string
  courseId: string
  status: EnrollmentStatus
  enrolledAt: Date
  expiresAt: Date | null
  completedAt: Date | null
}

// ── Payment ───────────────────────────────────────────────────────────────────

export interface Payment {
  id: string
  userId: string
  courseId: string
  /** Amount in paise */
  amount: number
  status: PaymentStatus
  razorpayOrderId: string | null
  razorpayPaymentId: string | null
  createdAt: Date
}

// ── Certificate ───────────────────────────────────────────────────────────────

export interface Certificate {
  id: string
  userId: string
  courseId: string
  certificateNo: string
  issuedAt: Date
  pdfUrl: string | null
}

// ── Content / CMS ─────────────────────────────────────────────────────────────

export interface SiteContentItem {
  id: string
  key: string
  value: string
  type: string
}

// ── Testimonial ───────────────────────────────────────────────────────────────

export interface Testimonial {
  id: string
  name: string
  college: string | null
  role: string | null
  quote: string
  /** Rating 1–5 */
  rating: number
  isActive: boolean
  sortOrder: number
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

export interface FAQ {
  id: string
  question: string
  answer: string
  isActive: boolean
  sortOrder: number
}

// ── API response wrapper ──────────────────────────────────────────────────────

export type ApiSuccess<T> = { success: true; data: T }
export type ApiError = { success: false; error: string }
export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ── UI helpers ────────────────────────────────────────────────────────────────

export type LevelVariant = 'foundation' | 'intermediate' | 'final'

export type EnrollmentFilterStatus = 'ALL' | EnrollmentStatus

export type PaymentFilterStatus = 'ALL' | PaymentStatus
