# NS Academy — CA Learning Portal

A full-stack EdTech platform for CA (Chartered Accountant) exam preparation, built by **CA Nikesh Shah**. The portal offers structured, logic-first video courses for CA Final, with real payments, progress tracking, and certificate generation.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | 16.2.3 |
| Language | TypeScript | 5 |
| Styling | Tailwind CSS v4 (custom `@theme` tokens) | 4 |
| Animation | Framer Motion | 12 |
| UI Primitives | Radix UI (Dialog, Accordion, Slot, etc.) | latest |
| Component Variants | Class Variance Authority (CVA) | 0.7 |
| Icons | Lucide React | latest |
| Database | PostgreSQL (via Supabase) | — |
| ORM | Prisma 7 (with `PrismaClient` + `PrismaPg` adapter) | 7.7 |
| Auth | Supabase Auth (email/password + Google OAuth) | 2.x |
| Payments | Razorpay | 2.9 |
| PDF Generation | @react-pdf/renderer | 4.4 |
| Validation | Zod | 4 |
| Runtime | React 19 | 19.2 |

---

## Architecture Overview

The app follows the **Next.js App Router** pattern with a strict SSR/CSR split:

- **Server Components** handle all data fetching (Prisma queries run on the server — no API round-trips for page loads)
- **Client Components** (`"use client"`) are used only for interactivity: payment flow, course player controls, forms, and admin CRUD UIs
- **ISR (Incremental Static Regeneration)** is used on public pages (`revalidate = 60`) to serve cached HTML with periodic background refresh
- **API Routes** (`app/api/`) are used only for mutations and browser-initiated requests (payment, progress, notes, admin operations)

### SSR/CSR split by page

| Page | Rendering | Why |
|---|---|---|
| Homepage | Server + ISR | Static-ish content, fast load |
| Course listing | Server + ISR | Public data, SEO |
| Course detail | Server + ISR | SEO + structured data |
| Dashboard | Server Component | Auth-gated, user-specific data |
| Course player | Server → Client | Server fetches course + progress, client handles video/notes/progress interactivity |
| Checkout | Server → Client | Server fetches course + user, client handles Razorpay |
| Admin panel | Client Component | Heavy interactivity, not public |

---

## Project Structure

```
portal/
├── app/
│   ├── layout.tsx                    # Root layout (Navbar, Footer)
│   ├── globals.css                   # Design tokens, utility classes, animations
│   ├── page.tsx                      # Homepage (Server, ISR)
│   │
│   ├── courses/
│   │   ├── page.tsx                  # All courses listing (Server, ISR)
│   │   ├── CoursesClient.tsx         # Filter tabs (Client)
│   │   └── [slug]/
│   │       ├── page.tsx              # Course detail (Server, ISR + generateMetadata)
│   │       └── CourseDetailClient.tsx # Accordion curriculum (Client)
│   │
│   ├── checkout/
│   │   └── [courseId]/
│   │       ├── page.tsx              # Auth-gated checkout (Server)
│   │       └── CheckoutClient.tsx    # Razorpay integration (Client)
│   │
│   ├── dashboard/
│   │   ├── page.tsx                  # Student dashboard (Server, Prisma direct)
│   │   ├── DashboardClient.tsx       # Logout button only (Client)
│   │   └── [courseId]/
│   │       ├── page.tsx              # Course player shell (Server)
│   │       └── CoursePlayerClient.tsx # Video + progress + notes (Client)
│   │
│   ├── payment-success/page.tsx      # Payment confirmation (Client — useSearchParams)
│   ├── verify/[certificateNo]/page.tsx # Certificate verification (Server)
│   │
│   ├── login/page.tsx                # Supabase email/Google login
│   ├── register/page.tsx             # Supabase registration
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   │
│   ├── (admin)/admin/                # Admin panel (all Client Components)
│   │   ├── layout.tsx                # Admin auth guard + sidebar
│   │   ├── login/page.tsx            # Separate admin login
│   │   ├── page.tsx                  # Dashboard stats (Server)
│   │   ├── courses/                  # Course CRUD
│   │   ├── students/                 # Student management
│   │   ├── payments/                 # Payment history
│   │   ├── content/page.tsx          # Site content CMS
│   │   ├── testimonials/page.tsx     # Testimonial management
│   │   ├── faqs/page.tsx             # FAQ management
│   │   └── settings/page.tsx         # Admin settings
│   │
│   └── api/
│       ├── courses/                  # Public course API
│       ├── enrollments/              # Enrollment read
│       ├── certificates/             # Certificate info + PDF download
│       ├── progress/                 # Mark lesson complete
│       ├── notes/                    # Per-lesson user notes (CRUD)
│       ├── payments/
│       │   ├── create-order/         # Create Razorpay order
│       │   └── verify/               # Verify signature + enroll
│       ├── testimonials/             # Public testimonials
│       ├── faqs/                     # Public FAQs
│       ├── content/                  # Public site content
│       └── admin/                    # Admin-only CRUD APIs (requireAdmin guard)
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                # Sticky nav, scroll-aware, mobile drawer
│   │   └── Footer.tsx                # Full footer with links + socials
│   ├── home/                         # Homepage section components
│   │   ├── HeroSection.tsx
│   │   ├── StatsBar.tsx
│   │   ├── InstructorProfile.tsx
│   │   ├── FeaturedCourse.tsx
│   │   ├── WhyUs.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQSection.tsx
│   │   └── CTABanner.tsx
│   ├── admin/                        # Admin UI components (StatsCard, etc.)
│   └── ui/                           # Primitive UI components
│       ├── button.tsx                # CVA button with loading spinner
│       ├── badge.tsx                 # Level badges
│       ├── input.tsx
│       └── label.tsx
│
├── lib/
│   ├── prisma.ts                     # Prisma singleton with PrismaPg adapter
│   ├── admin-auth.ts                 # requireAdmin() guard for API routes
│   ├── razorpay.ts                   # Razorpay client
│   ├── content.ts                    # SiteContent helpers
│   ├── validations.ts                # Zod schemas
│   └── utils.ts                      # cn() utility (clsx + tailwind-merge)
│
├── lib/supabase/
│   ├── server.ts                     # createClient() for Server Components + API routes
│   └── client.ts                     # createBrowserClient() for Client Components
│
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Seed script
│
├── prisma.config.ts                  # Prisma 7 config (uses DIRECT_URL for CLI)
├── public/
│   ├── nikesh-shah.png               # Instructor photo
│   └── meta.json                     # Prevents Razorpay 404 on /meta.json
├── next.config.ts                    # CSP headers + image domains
└── tailwind.config.ts
```

---

## Database Schema

PostgreSQL via Supabase, managed by Prisma 7.

### Models

| Model | Purpose |
|---|---|
| `Profile` | Mirror of `auth.users` — created by DB trigger on signup. Stores name, email, phone, role |
| `Course` | Course metadata: title, slug, price (paise), level, status, color, SEO fields |
| `Section` | Course chapters, ordered by `sortOrder` |
| `Lesson` | Individual video lessons with YouTube URL, duration, free preview flag |
| `CourseNote` | Downloadable PDF notes attached to a course |
| `Enrollment` | User ↔ Course link with status: ACTIVE / COMPLETED / EXPIRED / REFUNDED |
| `LessonProgress` | Per-lesson completion + watched seconds per user |
| `UserNote` | User's personal per-lesson notes (auto-saved) |
| `Payment` | Razorpay payment record: orderId, paymentId, signature, status, amount in paise |
| `Certificate` | Issued on course completion — has unique `certificateNo`, links to PDF |
| `SiteContent` | Key-value CMS for editable homepage text (hero, stats, instructor, etc.) |
| `Testimonial` | Student testimonials with rating, active toggle, sort order |
| `FAQ` | FAQ items with active toggle and sort order |

### Enums

```
Role:             STUDENT | ADMIN
CourseLevel:      FOUNDATION | INTERMEDIATE | FINAL
CourseStatus:     DRAFT | PUBLISHED | ARCHIVED
EnrollmentStatus: ACTIVE | COMPLETED | EXPIRED | REFUNDED
PaymentStatus:    CREATED | AUTHORIZED | CAPTURED | FAILED | REFUNDED
```

### Price convention

All monetary amounts are stored in **paise** (1 INR = 100 paise). Convert for display: `Math.round(priceInPaise / 100)`.

---

## Authentication

Powered by **Supabase Auth**.

### Flows
- **Email/Password** — standard signup and login
- **Google OAuth** — one-click login via Google
- **Forgot Password** — email reset link via Supabase
- **Admin login** — separate `/admin/login` page; role checked against `Profile.role === 'ADMIN'`

### How it works
1. Supabase issues a session cookie (via `@supabase/ssr`)
2. Server Components read the session with `createClient()` from `lib/supabase/server.ts`
3. Client Components use `createBrowserClient()` from `lib/supabase/client.ts`
4. A PostgreSQL trigger on `auth.users` automatically creates a `Profile` row on signup
5. Admin access is guarded by `requireAdmin()` in `lib/admin-auth.ts` — checks Supabase session + `Profile.role`

### Protected routes

| Route | Guard |
|---|---|
| `/dashboard` | Server: `supabase.auth.getUser()` → redirect to `/login` |
| `/dashboard/[courseId]` | Server: auth + enrollment check → redirect |
| `/checkout/[courseId]` | Server: auth check → redirect; enrollment check → redirect to player |
| `/admin/*` | Layout: admin auth guard + `Profile.role === ADMIN` |
| `POST /api/payments/*` | API: Supabase session |
| `GET/POST /api/admin/*` | API: `requireAdmin()` — 401/403 on failure |

---

## Payment Flow (Razorpay)

```
1. User clicks "Pay Now" on /checkout/[courseId]
2. POST /api/payments/create-order
   └── Creates Razorpay order (server-side with secret key)
   └── Saves Payment record (status: CREATED)
3. Razorpay checkout modal opens in browser
4. User completes payment
5. POST /api/payments/verify
   └── Verifies HMAC signature
   └── Updates Payment → CAPTURED
   └── Creates/updates Enrollment → ACTIVE
6. Redirect to /payment-success?course=...&title=...
```

All amounts in paise. Razorpay keys come from env: `RAZORPAY_KEY_ID` (secret) and `NEXT_PUBLIC_RAZORPAY_KEY_ID` (public, used in browser).

---

## Certificate Generation

Certificates are generated as PDF using **@react-pdf/renderer**.

- Triggered automatically when a student marks the last lesson complete (`POST /api/progress`)
- `Certificate` row created in DB with a unique `certificateNo` (format: `NSA-YYYY-XXXXXX`)
- PDF rendered server-side and streamed at `GET /api/certificates/[id]/download`
- Students can verify any certificate at `/verify/[certificateNo]`
- Design: gold border, forest-green header, ornamental divider, NSA seal

---

## Design System

All tokens are defined in `app/globals.css` under `@theme`:

| Token | Value | Usage |
|---|---|---|
| `--color-navy` | `#1A2744` | Primary headings, dark backgrounds |
| `--color-blue` | `#2563EB` | CTAs, links, active states |
| `--color-teal` | `#0D9488` | Checkmarks, success, accent |
| `--color-gold` | `#D4A843` | CTA banners, certificates |
| `--color-offwhite` | `#F7F8FA` | Page backgrounds |
| `--color-bodytext` | `#334155` | Paragraph text |
| `--color-muted` | `#94A3B8` | Secondary labels |

### Fonts
- **Inter** — body text (`font-sans`)
- **Plus Jakarta Sans** — UI headings (`font-heading`)
- **Playfair Display** — large display headings (`font-display`)

### Button variants (`components/ui/button.tsx`)

All buttons support `loading` and `loadingText` props that show an inline spinner and disable the button during async actions.

| Variant | Appearance |
|---|---|
| `default` | Blue fill, white text |
| `outline` | Blue border, transparent → blue on hover |
| `ghost` | Transparent, gray hover |
| `navy` | Navy fill, white text |
| `gold` | Gold fill, navy text |
| `teal` | Teal fill, white text |
| `destructive` | Red fill, white text |
| `link` | Blue underline text |

---

## Environment Variables

Create `portal/.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Database (Supabase pooler — Transaction mode, port 6543)
DATABASE_URL=postgresql://<user>:<password>@aws-0-<region>.pooler.supabase.com:6543/<db>

# Direct connection (for Prisma CLI migrations, port 5432)
DIRECT_URL=postgresql://<user>:<password>@aws-0-<region>.pooler.supabase.com:5432/<db>

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
```

### Where to find these values

| Variable | Location |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → `anon public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Project Settings → API → `service_role secret` key |
| `DATABASE_URL` | Supabase Dashboard → Project Settings → Database → Connection String → Transaction pooler (port 6543) |
| `DIRECT_URL` | Supabase Dashboard → Project Settings → Database → Connection String → Session pooler (port 5432) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay Dashboard → Settings → API Keys |

---

## Prisma Setup (v7)

Prisma 7 no longer supports `url` in `schema.prisma`. Connection is configured in two places:

| File | Used for | Connection |
|---|---|---|
| `lib/prisma.ts` | Runtime (app server) | `DATABASE_URL` via `pg.Pool` → `PrismaPg` adapter (Transaction pooler, port 6543) |
| `prisma.config.ts` | Prisma CLI (`db push`, `migrate`, `studio`) | `DIRECT_URL` (Session pooler, port 5432) |

The `lib/prisma.ts` singleton pattern prevents connection pool exhaustion during Next.js hot-reload in development.

### Database commands

```bash
# Push schema changes to DB (no migration files)
npm run db:push

# Run seed script
npm run db:seed

# Open Prisma Studio (visual DB browser)
npm run db:studio
```

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in all values as described above

# 3. Push schema to your Supabase database
npm run db:push

# 4. (Optional) Seed with sample data
npm run db:seed

# 5. Start development server
npm run dev
```

Dev server runs at `http://localhost:3000`  
Admin panel at `http://localhost:3000/admin`

```bash
# Production build
npm run build
npm run start
```

---

## Admin Panel

Protected at `/admin` — requires a user with `Profile.role = 'ADMIN'`.

To promote a user to admin, run directly in Supabase SQL editor:
```sql
UPDATE "Profile" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

### Admin sections

| Route | Function |
|---|---|
| `/admin` | Dashboard: total students, courses, revenue, recent enrollments |
| `/admin/courses` | List, create, edit, archive courses |
| `/admin/courses/new` | Create course with sections + lessons |
| `/admin/courses/[id]/edit` | Edit course details, reorder sections/lessons |
| `/admin/students` | View all students, enrollment history |
| `/admin/students/[id]` | Individual student detail |
| `/admin/payments` | Full payment log |
| `/admin/content` | Edit homepage text (hero, stats, instructor, CTA, footer) |
| `/admin/testimonials` | Add/remove/toggle testimonials |
| `/admin/faqs` | Add/remove/toggle FAQs |
| `/admin/settings` | Site settings |

---

## URL Map

| Route | Page | Auth |
|---|---|---|
| `/` | Homepage | Public |
| `/courses` | All courses | Public |
| `/courses/:slug` | Course detail | Public |
| `/checkout/:courseId` | Payment | Student |
| `/payment-success` | Confirmation | Public |
| `/dashboard` | Student dashboard | Student |
| `/dashboard/:courseId` | Course player | Student + enrolled |
| `/verify/:certificateNo` | Certificate verification | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/forgot-password` | Password reset request | Public |
| `/reset-password` | Set new password | Public |
| `/admin` | Admin dashboard | Admin |
| `/admin/*` | Admin sub-pages | Admin |
| `/privacy` | Privacy Policy | Public |
| `/terms` | Terms of Service | Public |
| `/refund` | Refund Policy | Public |

---

## Data & Request Flow

### Public page load (e.g. homepage)
```
Browser → Next.js Server
  └── Server Component renders with Prisma data (ISR cached)
  └── HTML streamed to browser (no client fetch needed)
```

### Student dashboard load
```
Browser → Next.js Server
  └── supabase.auth.getUser() — verify session
  └── prisma.enrollment.findMany() + prisma.certificate.findMany() — parallel
  └── prisma.lessonProgress.groupBy() — single batch query for all lesson progress
  └── Full HTML with data rendered, no client-side waterfall
```

### Payment flow
```
Browser (CheckoutClient)
  └── POST /api/payments/create-order → Razorpay API → returns orderId
  └── Razorpay modal opens
  └── User pays
  └── POST /api/payments/verify → HMAC check → Enrollment created → 200
  └── Browser redirects to /payment-success
```

### Progress + certificate
```
Browser (CoursePlayerClient)
  └── POST /api/progress { lessonId, isCompleted: true }
      └── Upsert LessonProgress
      └── Count completed lessons for course
      └── If all complete:
          └── Update Enrollment → COMPLETED
          └── Create Certificate (certificateNo: NSA-YYYY-XXXXXX)
          └── Return { courseCompleted: true, certificateId }
  └── Browser shows completion modal with download link
```

---

## Google OAuth Setup

1. Google Cloud Console → Create OAuth 2.0 Client (Web Application)
2. Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
3. Supabase Dashboard → Authentication → Providers → Google → enable, add Client ID + Secret
4. The login page calls `supabase.auth.signInWithOAuth({ provider: 'google' })`
