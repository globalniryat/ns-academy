# NS Academy — Marketing Site

Lead-capture marketing website for **CA Nikesh Shah's CA Final SFM course**.  
Built with Next.js 16, Tailwind CSS v4, and Resend for email.

> **Phase 1 is complete.** All updated code lives on `master`. This is the active, production-ready branch.

---

## What's in the Site

### Pages

| Route | Page | Description |
|---|---|---|
| `/` | Landing page | Full marketing homepage — Hero, Stats bar, How It Works, Instructor Profile, Featured Course, Why Us, Testimonials, Pricing, FAQ, CTA Banner |
| `/courses` | Courses listing | Static course card grid — links to course detail |
| `/courses/ca-final-sfm` | Course detail | Full course page — curriculum accordion, instructor bio, free YouTube preview embed, pricing, "Enroll Now" CTA |
| `/contact` | Contact page | WhatsApp card, email card, location, response time, contact form |
| `/blog` | Blog | "Coming soon" placeholder |
| `/privacy` | Privacy Policy | Static legal page |
| `/terms` | Terms of Service | Static legal page |
| `/refund` | Refund Policy | Static legal page |

### Homepage Sections (in order)

| Section | Component | What it shows |
|---|---|---|
| Hero | `HeroSection.tsx` | Headline, sub-headline, CTA buttons ("Enroll Now", "Watch Free Lecture"), course badge, background gradient |
| Stats Bar | `StatsBar.tsx` | Key numbers — students enrolled, years experience, pass rate, etc. |
| How It Works | `HowItWorks.tsx` | 3-step process: enroll → learn → pass |
| Featured Course | `FeaturedCourse.tsx` | CA Final SFM course card with curriculum highlights, price, "Enroll Now" |
| Instructor Profile | `InstructorProfile.tsx` | CA Nikesh Shah bio, qualifications, teaching style |
| Why Us | `WhyUs.tsx` | Differentiators — simplified teaching, past paper focus, doubt support |
| Testimonials | `Testimonials.tsx` | 6 student testimonials with rating, CA level, attempt |
| Pricing | `PricingSection.tsx` | Course price (₹3,999), original price (₹8,000), included features |
| FAQ | `FAQSection.tsx` | 6 expandable FAQs (Radix Accordion) |
| CTA Banner | `CTABanner.tsx` | Final conversion banner — "Enroll Now" button |

### Lead Capture Features

| Feature | How it works |
|---|---|
| **Floating WhatsApp button** | Fixed bottom-right on all pages. Tapping opens a pre-filled WhatsApp chat with Nikesh. Replace `WHATSAPP_NUMBER` in `components/ui/WhatsAppButton.tsx`. |
| **Show Interest modal** | Triggered by every "Enroll Now" button on the entire site. Collects: Name, Phone (+91), Email, CA Level, Attempt, optional Message. Submits to `/api/show-interest`. |
| **Lead emails (Resend)** | On modal submit: (1) lead notification email to mentor with student details + one-click WhatsApp reply link; (2) confirmation email to student. |
| **Contact form** | On `/contact` page. Collects: Name, Phone, Email, Subject, Message. Submits to `/api/contact`. Sends email to mentor with `replyTo` set to student's email. |

### Navigation & Layout

- **Navbar**: Transparent on homepage hero, white on scroll. Active section highlighting. Courses pill. "Enroll Now" CTA button. Mobile hamburger drawer.
- **Footer**: Links to all pages including legal. Social links.
- **Floating WhatsApp button**: Visible on every page, z-index above all content.
- **ScrollToTop**: Auto-scrolls to top on route change.

**Zero database. Zero auth. Zero payments. ~$0/month to run.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.3 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| UI Primitives | Radix UI (Accordion, Dialog, NavigationMenu) |
| Forms | react-hook-form |
| Email | Resend (free tier — 3,000 emails/month) |
| Deployment | Vercel (free hobby plan) |

---

## Getting Started

### 1. Install dependencies

```bash
cd portal
npm install
```

### 2. Configure environment variables

Edit `.env.local`:

```env
# Get from https://resend.com → API Keys (free)
RESEND_API_KEY=re_your_key_here

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=NS Academy
```

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Before Going Live — Replace These Placeholders

| File | Find | Replace with |
|---|---|---|
| `components/ui/WhatsAppButton.tsx` | `WHATSAPP_NUMBER = "91XXXXXXXXXX"` | CA Nikesh Shah's number e.g. `919876543210` |
| `app/contact/page.tsx` | `WHATSAPP_NUMBER`, `EMAIL` | Real contact details |
| `app/api/show-interest/route.ts` | `MENTOR_EMAIL`, `FROM_EMAIL` | Real email + Resend sender |
| `app/api/contact/route.ts` | `MENTOR_EMAIL`, `FROM_EMAIL` | Same |
| `.env.local` | `RESEND_API_KEY=re_xxx...` | Real key from resend.com |

### Resend sender domain

Until the domain `nsacademy.in` is verified in Resend, use `onboarding@resend.dev` as `FROM_EMAIL` for testing — it delivers to your Resend account email.

---

## Deployment (Vercel)

1. Push the `master` branch to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. **Set the branch to `master`**
4. Add environment variables:
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_APP_URL` ← set to your Vercel domain
   - `NEXT_PUBLIC_APP_NAME=NS Academy`
5. Deploy

---

## Project Structure

```
portal/
├── app/
│   ├── page.tsx                  # Homepage
│   ├── courses/
│   │   ├── page.tsx              # Course listing (static)
│   │   └── [slug]/page.tsx       # Course detail (static)
│   ├── contact/page.tsx          # Contact page
│   ├── api/
│   │   ├── show-interest/        # Lead capture — emails Nikesh + student
│   │   └── contact/              # Contact form — emails Nikesh
│   ├── blog/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   └── refund/page.tsx
│
├── components/
│   ├── home/                     # All homepage sections (Hero, Stats, FAQ, etc.)
│   ├── layout/                   # Navbar, Footer, ConditionalPublicLayout
│   ├── contact/ContactForm.tsx
│   ├── courses/CourseCard.tsx
│   └── ui/
│       ├── WhatsAppButton.tsx    # Floating WhatsApp CTA
│       ├── InterestModal.tsx     # Lead capture form modal
│       └── EnrollButton.tsx      # Drop-in button → opens InterestModal
│
├── lib/
│   ├── static-data.ts            # All content: course, testimonials, FAQs
│   └── utils.ts                  # cn() helper
│
└── .husky/
    └── pre-commit                # ESLint + unit tests on every commit
```

---

## Updating Content

All course, testimonial, and FAQ content lives in [`lib/static-data.ts`](lib/static-data.ts).

- **Course details** (price, title, curriculum) → `STATIC_COURSE`
- **Courses listing card** → `STATIC_COURSE_CARD`
- **Testimonials** → `STATIC_TESTIMONIALS`
- **FAQs** → `STATIC_FAQS`

Edit that file and redeploy — no database changes needed.

---

## Tests

```bash
npm test          # unit tests (Vitest) — badge, button, utils
npm run test:e2e  # e2e (Playwright) — homepage, courses
```

---

## Branch

`master` is the single active branch. All Phase 1 work is complete and merged here.
