# CA Learning Portal

A professional online learning platform for CA (Chartered Accountant) exam preparation, built by **CA Nikesh Shah**. The portal offers structured, logic-first video courses for CA Final — designed to take students from zero prior knowledge to exam-confident.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (custom `@theme` tokens) |
| Animation | Framer Motion 12 |
| UI Primitives | Radix UI (Dialog, Accordion, Slot, etc.) |
| Component Variants | Class Variance Authority (CVA) |
| Icons | Lucide React |
| Fonts | Inter, Playfair Display, Plus Jakarta Sans (via Google Fonts) |
| State / Auth | React Context + `localStorage` (client-side only, no backend) |

---

## 📁 Project Structure

```
portal/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (Navbar, Footer, AuthProvider)
│   ├── globals.css             # Design system: tokens, utilities, animations
│   ├── page.tsx                # Homepage
│   ├── courses/
│   │   ├── page.tsx            # All Courses listing
│   │   └── [slug]/page.tsx     # Course detail page
│   ├── checkout/
│   │   └── [courseId]/page.tsx # Payment / checkout page
│   ├── dashboard/
│   │   └── page.tsx            # Student dashboard
│   ├── payment-success/
│   │   └── page.tsx            # Post-payment confirmation page
│   ├── login/page.tsx          # Student login
│   ├── register/page.tsx       # Student registration
│   ├── blog/                   # Blog (placeholder)
│   ├── privacy/page.tsx        # Privacy Policy
│   ├── terms/page.tsx          # Terms of Service
│   └── refund/page.tsx         # Refund Policy
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky top nav with scroll-aware styling
│   │   └── Footer.tsx          # Full-width footer with links & socials
│   ├── home/                   # Homepage section components
│   │   ├── HeroSection.tsx     # Full-screen hero with instructor photo + video
│   │   ├── StatsBar.tsx        # 4-stat quick-facts strip
│   │   ├── InstructorProfile.tsx # CA Nikesh Shah bio, philosophy, credentials
│   │   ├── FeaturedCourse.tsx  # Single featured course card with CTA
│   │   ├── WhyUs.tsx           # 6-feature grid + money-back banner
│   │   ├── Testimonials.tsx    # 6 student reviews (Symbiosis Pune + others)
│   │   ├── CTABanner.tsx       # Final CTA strip (gold gradient)
│   │   ├── HowItWorks.tsx      # 4-step process (currently unused on homepage)
│   │   └── PricingSection.tsx  # Pricing tiers (currently unused on homepage)
│   ├── courses/
│   │   └── CourseCard.tsx      # Reusable card for course listings
│   ├── auth/
│   │   └── AuthGuard.tsx       # Route guard: redirects unauthenticated users
│   └── ui/                     # Primitive UI components
│       ├── button.tsx          # CVA-based Button with 7 variants
│       ├── card.tsx            # Card, CardHeader, CardContent, CardFooter
│       ├── badge.tsx           # Level badges (Foundation/Intermediate/Final)
│       ├── input.tsx           # Styled text input
│       └── label.tsx           # Form label
│
├── lib/
│   ├── auth.tsx                # AuthContext, AuthProvider, useAuth hook
│   ├── courses.ts              # Course data, VIDEO_IDs map, types
│   └── utils.ts                # `cn()` utility (clsx + tailwind-merge)
│
├── public/
│   ├── nikesh-shah.png         # Instructor profile photo
│   └── upi-qr.png              # UPI payment QR code
│
├── tailwind.config.ts          # Tailwind v4 config (minimal — tokens in CSS)
├── next.config.ts              # CSP headers for YouTube iframes
└── tsconfig.json
```

---

## 🎨 Design System

All design tokens are defined in `app/globals.css` under `@theme`:

| Token | Value | Usage |
|---|---|---|
| `--color-navy` | `#1A2744` | Primary headings, buttons, navbar bg |
| `--color-blue` | `#2563EB` | CTAs, links, active states |
| `--color-teal` | `#0D9488` | Checkmarks, success, accent |
| `--color-gold` | `#D4A843` | CTA banners, discount badges |
| `--color-offwhite` | `#F7F8FA` | Page backgrounds, section alternation |
| `--color-bodytext` | `#334155` | Paragraph text |
| `--color-muted` | `#94A3B8` | Secondary labels, placeholders |

### Fonts
- **`--font-sans`** → Inter — body text
- **`--font-heading`** → Plus Jakarta Sans — section headings, UI labels
- **`--font-display`** → Playfair Display — large hero headings, instructor name

### Utility Classes (globals.css)
| Class | Purpose |
|---|---|
| `.hero-grid-pattern` | Subtle dot-grid overlay for dark sections |
| `.gradient-text` | Blue-to-teal gradient for headline spans |
| `.card-hover` | `translateY(-4px)` lift on hover |
| `.progress-bar` / `.progress-fill` | Course progress bar styling |
| `.navbar-sticky` | Backdrop blur for sticky nav |
| `.video-container` | 16:9 ratio iframe container |

### Button Variants (`components/ui/button.tsx`)
| Variant | Appearance |
|---|---|
| `default` | Blue fill, white text |
| `outline` | Blue border, transparent fill → blue fill on hover |
| `ghost` | Transparent, gray hover |
| `navy` | Navy fill, white text |
| `gold` | Gold fill, navy text |
| `teal` | Teal fill, white text |
| `destructive` | Red fill, white text |
| `link` | Blue underline text |

---

## 📄 Pages

### `/` — Homepage

**File:** `app/page.tsx`

Assembled from 7 section components rendered top-to-bottom:

| Order | Section | Component | Description |
|---|---|---|---|
| 1 | Hero | `HeroSection` | Full-viewport dark hero with instructor photo, course headline, benefits list, 100% money-back badge, and embedded YouTube preview |
| 2 | Stats | `StatsBar` | White bar showing 4 quick stats: 2,000+ students, 4.9/5 rating, 35 hrs content, 100% money-back |
| 3 | Instructor | `InstructorProfile` | CA Nikesh Shah's profile photo, bio, quote, credentials (ICAI, Symbiosis College Pune), teaching philosophy (3-card grid) |
| 4 | Course | `FeaturedCourse` | "Now Launching" featured CA Final SFM course card — highlights, pricing, money-back guarantee, free preview embed, "Who is this for" section |
| 5 | Why Us | `WhyUs` | 6-feature grid (logic-first, money-back, DRM-protected, zero prior knowledge, UPI payments, lifetime access) + prominent green guarantee banner |
| 6 | Reviews | `Testimonials` | 6 student testimonials (Symbiosis College Pune + others), 4.9 aggregate rating bar, highlight tags per review |
| 7 | CTA | `CTABanner` | Gold-gradient CTA with price, enrollment button, and trust signals row |

---

### `/courses` — All Courses

**File:** `app/courses/page.tsx`

- Dark navy hero banner with course count
- **Filter Tabs:** All / Foundation / Intermediate / Final
- Responsive grid of `CourseCard` components
- Filter updates instantly (client-side state)

---

### `/courses/[slug]` — Course Detail

**File:** `app/courses/[slug]/page.tsx`

Two-column layout (desktop) / single column (mobile):

**Left column:**
- Course title, level badge, rating, enrollment count, duration, video count
- Description + instructor name
- "What You'll Learn" card — 6 bullet points
- **Curriculum accordion** — sections collapse/expand, lessons show lock icon or "Free Preview" button
- Instructor bio card

**Right column (sticky, desktop only):**
- Embedded YouTube free preview iframe
- Price display with discount percentage
- "Enroll Now" CTA button
- Course includes list (lifetime access, HD videos, mobile, certificate)

**Mobile:**
- Sticky bottom bar with price + "Enroll Now" button

---

### `/checkout/[courseId]` — Checkout & Payment

**File:** `app/checkout/[courseId]/page.tsx`

**Auth-gated:** Redirects to `/login` if not logged in. Redirects to `/dashboard` if already enrolled.

Two-column layout:

**Left — Payment Form:**
Three payment method tabs:
1. **UPI** — QR code + copy UPI ID (`caportal@ybl`) + optional UPI ID input field, accepted app badges (PhonePe, GPay, Paytm, BHIM, Amazon Pay)
2. **Card** — Card number (formatted), cardholder name, expiry (MM/YY), CVV, SSL note
3. **Net Banking** — Grid of 8 bank buttons (SBI, HDFC, ICICI, Axis, Kotak, PNB, BOB, Union Bank)

"Pay Now" button triggers a 2.5s simulated payment → calls `enrollCourse()` → redirects to `/payment-success`.

**Right — Order Summary (sticky):**
- Course name, video count, duration, lifetime access, mobile access
- Price breakdown: original → discount → GST (inclusive) → total
- 30-day money-back guarantee badge

---

### `/payment-success` — Confirmation

**File:** `app/payment-success/page.tsx`

- Animated checkmark (spring animation via Framer Motion)
- Course name pill
- What's unlocked list
- Two CTAs: "Start Learning Now" → `/dashboard/[courseId]`, "Go to Dashboard" → `/dashboard`
- Refund policy link

---

### `/dashboard` — Student Dashboard

**File:** `app/dashboard/page.tsx`

**Auth-gated** via `AuthGuard` component.

**Header section (navy bg):**
- User avatar + welcome message
- Logout button
- 3 stat cards: Courses Enrolled, Lessons Completed, Overall Progress

**Content:**
- **My Courses** — enrolled course cards with color strip, level badge, progress bar (static 30%), "Continue Learning" button
- **Explore More Courses** — unenrolled courses with pricing, "Enroll Now" button → checkout

---

### `/login` — Student Login

**File:** `app/login/page.tsx`

- Demo credentials info box (`student@demo.com` / `demo123`)
- Email + password form with show/hide toggle
- Error messaging on invalid credentials
- Redirect to `?redirect=` param after login (or `/dashboard`)

---

### `/register` — Student Registration

**File:** `app/register/page.tsx`

- Name, email, phone, password fields
- **Mock registration:** any input → logs in as demo user → redirects to dashboard
- Benefits list (free previews, progress tracking, course unlocking)

---

### `/privacy`, `/terms`, `/refund` — Legal Pages

Static content pages for Privacy Policy, Terms of Service, and Refund Policy.

---

## 🔐 Authentication System

**File:** `lib/auth.tsx`

Pure client-side auth using React Context + `localStorage`. **No backend.**

### How It Works

1. **`AuthProvider`** wraps the entire app in `app/layout.tsx`
2. On mount, reads `ca_portal_user` from `localStorage` to restore session (hydration)
3. `isLoading: true` during hydration — prevents redirect flicker
4. Login checks against hardcoded demo credentials
5. On login, user object `{ name, email, enrolled: [] }` is stored to `localStorage`
6. `enrollCourse(courseId)` appends to `enrolled[]` and persists to `localStorage`
7. Logout clears `localStorage` and resets state

### User Object Structure
```ts
interface User {
  name: string;
  email: string;
  enrolled: string[];  // courseIds the user has paid for
}
```

### Demo Credentials
```
Email:    student@demo.com
Password: demo123
```

### `AuthGuard` Component
`components/auth/AuthGuard.tsx` — wraps protected pages. Shows spinner during hydration, redirects to `/login?redirect=[current-path]` if not authenticated.

---

## 📚 Course Data

**File:** `lib/courses.ts`

All course data is statically defined in this file. No database.

### Course Type
```ts
interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: "Foundation" | "Intermediate" | "Final";
  price: number;
  originalPrice: number;
  duration: string;
  videoCount: number;
  instructor: string;
  rating: number;
  enrollments: number;
  thumbnail: null;
  freePreviewUrl: string;     // YouTube embed URL for course card/detail
  color: string;              // Hex color for course card gradient
  curriculum: CurriculumSection[];
}

interface CurriculumSection {
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  title: string;
  isFreePreview?: boolean;
  videoId: string;            // YouTube video ID
}
```

### Current Courses

| ID | Title | Level | Price | Duration | Videos |
|---|---|---|---|---|---|
| `ca-foundation-accounts` | CA Foundation — Accounts & Auditing | Foundation | ₹1,499 | 18 hrs | 24 |
| `ca-intermediate-financial` | CA Intermediate — Financial Management | Intermediate | ₹2,999 | 28 hrs | 38 |
| `ca-final-strategic` | CA Final — Strategic Financial Management | Final | ₹3,999 | 35 hrs | 45 |

### `VIDEO_IDs` Map
All YouTube video IDs are centralized in `VIDEO_IDs` at the top of `lib/courses.ts`. Organized by level and lesson, they're referenced by both the curriculum and all homepage/course preview embeds.

---

## 🧩 Key Components

### `Navbar` (`components/layout/Navbar.tsx`)
- Fixed top, `z-50`
- **Transparent** on homepage hero, **white/blur** after scroll or on inner pages
- Desktop: logo + nav links + auth buttons
- Mobile: hamburger → right-drawer with full nav
- Shows user's first name + logout when logged in

### `Footer` (`components/layout/Footer.tsx`)
- Navy background
- Brand column + 3 link groups (Platform, Company, Legal)
- Social icon buttons (YouTube, Twitter/X, Instagram, Email)

### `CourseCard` (`components/courses/CourseCard.tsx`)
- Gradient thumbnail (level-specific)
- Level `Badge`, star rating, title, instructor name
- Duration, video count, enrollment count
- Discounted price with strikethrough
- "Enroll Now" → `/courses/[slug]`
- Free Preview + discount % badges

### `InstructorProfile` (`components/home/InstructorProfile.tsx`)
- Instructor photo with floating credential badge and rating badge
- Two-column: photo left, bio right
- Credentials checklist, large quote block, award pills
- Teaching philosophy 3-card grid (Logic-First, Zero Prior Knowledge, Exam-Confident)

### `Testimonials` (`components/home/Testimonials.tsx`)
- 4.9/5 aggregate rating bar
- 6 cards in 3-column grid (dark navy bg)
- Each card: highlight tag, quote, 5 stars, author with colored avatar

---

## 🏃 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Dev server runs at `http://localhost:3000`

---

## ⚙️ Configuration

### `next.config.ts`
Sets Content Security Policy headers allowing:
- YouTube iframes from `www.youtube-nocookie.com` and `www.youtube.com`
- Google Fonts loading
- Standard self-hosted assets

### `app/globals.css`
Primary style file — all design tokens, custom utility classes, and base resets live here. Tailwind v4 uses `@import "tailwindcss"` and `@theme {}` for token injection.

---

## 🗺️ URL Map

| Route | Page | Auth Required |
|---|---|---|
| `/` | Homepage | No |
| `/courses` | All courses | No |
| `/courses/:slug` | Course detail | No |
| `/checkout/:courseId` | Payment | ✅ Yes |
| `/dashboard` | Student dashboard | ✅ Yes |
| `/dashboard/:courseId` | Course player (wip) | ✅ Yes |
| `/payment-success` | Confirmation | No |
| `/login` | Login | No |
| `/register` | Registration | No |
| `/privacy` | Privacy Policy | No |
| `/terms` | Terms of Service | No |
| `/refund` | Refund Policy | No |
| `/blog` | Blog (placeholder) | No |

---

## 🔄 Data & State Flow

```
lib/courses.ts (static data)
       │
       ├──▶ /courses page (filter + display)
       ├──▶ /courses/[slug] (detail page)
       ├──▶ /checkout/[courseId] (price, title lookup)
       ├──▶ /dashboard (enrolled vs unenrolled split)
       └──▶ homepage FeaturedCourse (hardcoded to ca-final-strategic)

lib/auth.tsx (AuthContext)
       │
       ├──▶ localStorage: ca_portal_user
       ├──▶ Navbar (login state, user name)
       ├──▶ AuthGuard (route protection)
       ├──▶ /checkout (enrollCourse() on pay)
       └──▶ /dashboard (enrolled[] list)
```

---

## 📌 Known Limitations (Current State)

- **No real backend** — all auth and enrollment is localStorage-only; clears on browser data wipe
- **No real payment gateway** — payment is simulated (2.5s delay → auto-enroll)
- **Static course content** — courses and curriculum are hardcoded in `lib/courses.ts`
- **Single demo user** — only one student account (`student@demo.com`) works
- **Course player** — `/dashboard/[courseId]` route exists but is not fully built yet
- **Blog** — placeholder route, no content yet
- **No admin panel** — content and courses can only be updated by editing source files
