# NS Academy — Phase 1 Marketing Site

Lead-capture marketing website for **CA Nikesh Shah's CA Final SFM course**.  
Built with Next.js 16, Tailwind CSS v4, and Resend for email.

> **Branch:** `phase-1` — production-ready marketing site with zero database, zero auth, zero payments.  
> Phase 2 (full platform with auth, payments, dashboard, admin) lives on `main`.

---

## What's in Phase 1

| Feature | Route | Description |
|---|---|---|
| Landing page | `/` | Hero, stats, instructor profile, featured course, testimonials, FAQ, CTA |
| Courses listing | `/courses` | Static course card — links to detail page |
| Course detail | `/courses/ca-final-sfm` | Curriculum, instructor bio, free preview embed, pricing |
| WhatsApp button | All pages | Fixed floating button — opens pre-filled WhatsApp chat |
| Show Interest modal | Triggered by all "Enroll Now" buttons | Collects Name, Phone, Email, CA Level, Attempt — emails Nikesh |
| Contact page | `/contact` | WhatsApp card, email card, contact form |
| Lead emails | Server | Resend sends lead notification to mentor + confirmation to student |
| Blog | `/blog` | "Coming soon" placeholder |
| Legal pages | `/privacy`, `/terms`, `/refund` | Static policy pages |

**Zero database. Zero auth. Zero payments. ~$0/month to run.**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.3 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
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

1. Push this `phase-1` branch to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. **Set the branch to `phase-1`** (not `main`)
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
│   ├── home/                     # All homepage sections
│   ├── layout/                   # Navbar, Footer, ConditionalPublicLayout
│   ├── contact/ContactForm.tsx
│   ├── courses/CourseCard.tsx
│   └── ui/
│       ├── WhatsAppButton.tsx    # Floating WhatsApp CTA
│       ├── InterestModal.tsx     # Lead capture form modal
│       └── EnrollButton.tsx     # Drop-in button → opens InterestModal
│
└── lib/
    ├── static-data.ts            # All content: course, testimonials, FAQs
    └── utils.ts                  # cn() helper
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

## Branch Strategy

| Branch | What it is |
|---|---|
| `main` | Full platform (Phase 2) — auth, Supabase, Razorpay, admin, student dashboard |
| `phase-1` | This branch — static marketing site, no backend dependencies |

**Never merge `phase-1` into `main`.** They are parallel deployments for different audiences.
