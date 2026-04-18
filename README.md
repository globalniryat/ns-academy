# NS Academy — CA Learning Portal

A full-stack e-learning platform for Chartered Accountancy (CA) exam preparation, built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, Prisma 7, and Supabase.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.3 |
| UI | React | 19.2.4 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS v4 | ^4 |
| Components | Radix UI + Lucide React | latest |
| Animation | Framer Motion | ^12 |
| Database ORM | Prisma | ^7.7.0 |
| Database | PostgreSQL (via Supabase) | — |
| Auth | Supabase Auth (email + Google OAuth) | ^2 |
| Payments | Razorpay (webhook-verified) | ^2.9.6 |
| PDF | @react-pdf/renderer | ^4 |
| Unit Tests | Vitest + Testing Library | ^4 |
| E2E Tests | Playwright | ^1.59 |
| Deployment | Vercel | — |

---

## Features

### Student-Facing
- **Home page** — Hero, stats bar, instructor profile, featured course, testimonials, FAQ (all CMS-driven)
- **Course catalog** — Level-filtered listing (Foundation / Intermediate / Final), price display, enrollment CTA
- **Course detail page** — Full curriculum, what-you-learn, pricing, one-click enrollment
- **Checkout & payment** — Razorpay modal with UPI, cards, netbanking; HMAC webhook verification; automatic enrollment on capture
- **Payment success** — 5-second countdown redirect to course player after verified payment
- **Student dashboard** — Enrolled courses, per-course progress bar, certificate download buttons, stat cards
- **Course player** — Section/lesson sidebar, video playback (Bunny.net + YouTube auto-detected), lesson progress tracking, notes per lesson
- **Certificate generation** — PDF certificates via `@react-pdf/renderer`, unique certificate numbers, downloadable
- **Authentication** — Email/password + Google OAuth, forgot-password flow, protected routes

### Admin Panel (`/admin`)
- **Dashboard** — Total students, courses, enrollments, revenue; 7-day revenue bar chart; top courses; recent enrollments
- **Courses** — Full CRUD; create/edit/publish/draft; section & lesson editor (inline, reorderable); color picker; video URL with provider auto-detection
- **Students** — List with enrollment/certificate counts; detail view with full activity (enrollments, payments, certificates, progress); **delete user** (cascades all data + removes Supabase auth entry)
- **Enrollments** — List all enrollments; manual enroll any student to any course; update status (ACTIVE/COMPLETED/EXPIRED/CANCELLED); set expiry date; delete
- **Payments** — View all payment records with status badges
- **FAQs** — Create, edit inline, toggle visibility, delete; reorders on save
- **Testimonials** — Create, toggle visibility, delete
- **Site Content** — CMS for hero headline, subheadline, stats bar values, instructor bio/photo — no redeploy needed
- **Settings** — Admin account management

### Security
- Supabase Row Level Security on all tables
- All admin routes guarded by `requireAdmin()` — checks both Supabase session and `Profile.role === 'ADMIN'`
- Razorpay webhook signature verified with HMAC-SHA256 + timing-safe comparison
- Payment secrets never exposed client-side (`razorpaySignature` excluded from all API responses)
- Content Security Policy headers configured for Razorpay, Supabase, and Bunny.net
- Admin cannot delete their own account or other admin accounts

---

## Project Structure

```
portal/
├── app/
│   ├── (admin)/admin/          # Admin panel pages (dashboard, courses, students, …)
│   ├── api/
│   │   ├── admin/              # Admin REST endpoints (courses, students, enrollments, …)
│   │   ├── payments/           # create-order, verify
│   │   ├── progress/           # lesson progress
│   │   ├── notes/              # per-lesson student notes
│   │   ├── certificates/       # PDF generation & download
│   │   └── webhooks/razorpay/  # payment webhook handler
│   ├── auth/callback/          # Supabase OAuth callback
│   ├── checkout/[courseId]/    # Checkout page + Razorpay integration
│   ├── courses/                # Public catalog + course detail
│   ├── dashboard/              # Student dashboard + course player
│   ├── login/ register/ forgot-password/
│   └── payment-success/
├── components/
│   ├── admin/                  # Admin-specific components
│   ├── auth/                   # GoogleAuthButton, etc.
│   ├── ui/                     # Design system (Button, Badge, Input, …)
│   └── VideoPlayer.tsx         # Bunny.net / YouTube unified player
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── supabase/               # server / client / admin clients
│   ├── admin-auth.ts           # requireAdmin() guard
│   ├── video-provider.ts       # Detects Bunny.net vs YouTube from URL
│   └── validations.ts          # Shared Zod schemas
├── prisma/
│   ├── schema.prisma           # 13 models
│   ├── seed.ts                 # Production seed data
│   └── seed-test.ts            # Test seed data
├── __tests__/                  # Vitest unit + API tests (320 tests)
├── e2e/                        # Playwright E2E tests
└── .github/workflows/ci.yml   # CI: unit tests, type check, E2E (on PR to main)
```

---

## Database Models

| Model | Purpose |
|---|---|
| Profile | User profile (name, email, phone, role: STUDENT/ADMIN) |
| Course | Course with level, price (paise), color, sections |
| Section | Ordered course sections |
| Lesson | Video lessons within sections |
| Enrollment | Student ↔ Course (ACTIVE/COMPLETED/EXPIRED/CANCELLED) |
| LessonProgress | Per-lesson completion tracking |
| Payment | Razorpay payment records |
| Certificate | Issued certificates with unique cert numbers |
| UserNote | Per-lesson student notes |
| CourseNote | Admin notes on a course |
| SiteContent | CMS key/value store for homepage content |
| Testimonial | Student testimonials for homepage |
| FAQ | Frequently asked questions for homepage |

All user-related models cascade-delete when a `Profile` is deleted.

---

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (Supabase recommended)
- Razorpay account (test keys for development)

### Setup

```bash
cd portal
npm install

# Copy and fill in environment variables
cp .env.example .env.local

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_WEBHOOK_SECRET=...
```

---

## Testing

```bash
# Unit + API tests (Vitest)
npm run test

# With coverage report
npm run test:coverage

# E2E tests (Playwright) — requires running server + seeded DB
npm run test:e2e

# All tests
npm run test:all
```

**Current test coverage:** 320 unit/API tests across 19 test files. E2E suite covers full admin CRUD, student auth flows, course player, and checkout.

---

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on every push and PR:

1. **Unit & API Tests** — Vitest with coverage thresholds (70% lines/functions)
2. **TypeScript Type Check** — `tsc --noEmit` after Prisma generate
3. **E2E Tests** — Playwright (Chromium only, runs on PRs to `main`/`master` only)

Deployment is via Vercel connected to the `master` branch.

---

## Development Phases

### Phase 1 — Portfolio Site (no login)
Static marketing site: Home, Courses listing, Course detail, About, Contact. No auth, no payment, no admin panel. Tech: Next.js + Tailwind + Radix UI (accordion) + Vercel.

### Phase 2 — Full Learning Platform (current)
Complete e-learning platform with student auth, payments, course player, certificates, and admin panel. All features documented above.

---

## Changelog

### Latest (feature/ui-enhancements-and-fixes)
- **Admin: Delete Student** — Admins can permanently delete a student and all related data (enrollments, progress, payments, certificates, notes) from the student detail page. Cascades via Prisma + removes Supabase auth entry via service-role client. Self-deletion and admin account deletion are blocked.
- **Video Player** — Unified `VideoPlayer` component auto-detects Bunny.net (iframe embed) and YouTube (nocookie iframe) from URL format.
- **Course Player** — Friendly empty state when a course has no lessons yet.
- **Checkout** — Razorpay UPI flow with user-friendly failure messages for declined/unsupported scenarios.
- **Payment Success** — 5-second countdown auto-redirect to course player after successful payment.
- **Razorpay Webhook** — HMAC-SHA256 signature verification; auto-enrolls student on `payment.captured` event.
- **CSP** — Content Security Policy expanded to cover all Razorpay domains, Supabase, and Bunny.net.
- **Admin Sidebar** — Sticky sidebar so logout button stays visible regardless of page scroll.
- **Google OAuth** — Full sign-in + callback flow; new Google users are auto-provisioned in `Profile` table.
