# NS Academy

Marketing website for **CA Nikesh Shah's CA Final SFM course**.  
Built with Next.js 16, Tailwind CSS v4, Sanity CMS, and Resend for email.

> **Phase 1 complete.** `main` is the single active branch — all code is here.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.3 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | v4 |
| Animations | Framer Motion | ^12 |
| CMS | Sanity Studio (embedded at `/studio`) | ^5.21 |
| CMS Client | next-sanity | ^12.3 |
| UI Primitives | Radix UI (Accordion, Avatar, Dialog, NavigationMenu, Separator) | ^1 |
| Forms | react-hook-form | ^7 |
| Icons | lucide-react | ^1.8 |
| Email | Resend | ^6 |
| Unit Tests | Vitest + Testing Library | ^4.1 |
| E2E Tests | Playwright | ^1.59 |
| Linting | ESLint + lint-staged | ^9 |
| Git Hooks | Husky | ^9 |
| Deployment | Vercel | — |

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — all marketing sections |
| `/contact` | Contact page with form, WhatsApp, email, location |
| `/blog` | Blog placeholder ("Coming soon") |
| `/privacy` | Privacy Policy (static) |
| `/terms` | Terms of Service (static) |
| `/refund` | Refund Policy (static) |
| `/studio` | Sanity Studio — embedded CMS editor |

---

## Homepage Sections (in order)

| Section | Component | CMS Group |
|---|---|---|
| Hero | `HeroSection.tsx` | `hero` |
| Stats Bar | `StatsBar.tsx` | `stats` |
| About Educator | `AboutSection.tsx` | `about` |
| YouTube Section | `YouTubeSection.tsx` | `youtube` |
| Video Grid | `VideoGrid.tsx` | `videos` |
| Teaching Philosophy | `TeachingPhilosophy.tsx` | `philosophy` |
| About Series | `AboutSeries.tsx` | `series` |
| Who Is It For | `WhyUs.tsx` | `whoFor` |
| Testimonials | `Testimonials.tsx` | `testimonials` |
| FAQ | `FAQSection.tsx` | `faq` |
| YouTube Subscribe Banner | `YouTubeSubscribeBanner.tsx` | `banner` |

Every section reads data from Sanity. All sections have hardcoded defaults so the site never breaks if Sanity is unavailable.

---

## Sanity CMS

### Studio

The Sanity Studio is embedded inside the Next.js app at `/studio`.  
All site content is managed from a **single document** of type `siteContent`.

| Studio URL | Purpose |
|---|---|
| `http://localhost:3000/studio` | Studio home |
| `http://localhost:3000/studio/structure/siteContent` | Edit all site content |
| `http://localhost:3000/studio/presentation` | Live preview side-by-side with the site |

Shortcut redirects are configured in `next.config.ts`:
- `/structure/*` → `/studio/structure/*`
- `/presentation/*` → `/studio/presentation/*`

### Content Schema — `siteContent` groups

| Group | Fields |
|---|---|
| **Hero** | `badgeText`, `headline`, `subtext`, `bulletPoints[]`, `primaryButton {text, url}`, `secondaryButton {text, url}`, `profileImage`, `youtubeVideoId`, `youtubeNote` |
| **Stats Bar** | `stats[] {value, label}` |
| **About Educator** | `name`, `title`, `profileImage`, `ratingBadge`, `credentialBadge`, `bio1`, `bio2`, `bio3`, `pullQuote`, `credentials[] {text}`, `badges[] {text}` |
| **Philosophy** | `sectionLabel`, `heading`, `cards[] {icon, title, description}` |
| **YouTube Section** | `sectionLabel`, `heading`, `subtext`, `featuredVideoId`, `channelUrl`, `playlistNote`, `ctaButton {text, url}`, `topics[] {title, description}` |
| **Video Grid** | `heading`, `videos[] {videoId, title, duration}` |
| **Series Info** | `heading`, `subtext`, `topics[]` |
| **Who Is It For** | `sectionLabel`, `heading`, `cards[] {title, description}` |
| **Testimonials** | `sectionLabel`, `heading`, `subtext`, `overallRating`, `items[] {name, college, initials, color, quote}` |
| **FAQ** | `sectionLabel`, `heading`, `subtext`, `emailLinkText`, `email`, `items[] {question, answer}` |
| **Contact** | `whatsappNumber`, `whatsappMessage`, `email`, `location` |
| **Footer** | `tagline`, `youtubeUrl`, `instagramUrl`, `linkedinUrl` |
| **Subscribe Banner** | `text`, `button {text, url}` |

### Live Preview

The Presentation Tool in the Studio allows side-by-side live preview:
- Enable draft mode via `/api/draft-mode/enable`
- Disable via `/api/draft-mode/disable`
- Live updates powered by `SanityLive` component (rendered in root layout)
- `draftClient` uses `perspective: 'previewDrafts'` and `useCdn: false`

### Cache & Revalidation

- Pages use `export const revalidate = 60` (ISR — rebuild every 60 seconds)
- On Sanity content publish, a webhook calls `POST /api/revalidate?secret=<SANITY_REVALIDATE_SECRET>`
- Revalidation clears the Next.js data cache for `/` (layout) and `/contact`
- In **development**, `useCdn: false` is set automatically so changes appear instantly

**Webhook setup in Sanity:**
1. Go to [sanity.io](https://sanity.io) → your project → API → Webhooks
2. URL: `https://your-domain.vercel.app/api/revalidate?secret=NsAcademy`
3. Trigger on: `publish` of `siteContent`

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/contact` | POST | Contact form — emails mentor via Resend. Fields: `name`, `email`, `phone`, `subject`, `message` |
| `/api/show-interest` | POST | Lead capture form — emails mentor + confirmation to student. Fields: `name`, `phone`, `email`, `caLevel`, `attempt`, `message` |
| `/api/revalidate` | POST | Sanity webhook — clears ISR cache. Requires `?secret=` query param |
| `/api/draft-mode/enable` | GET | Enables Next.js draft mode for Sanity live preview |
| `/api/draft-mode/disable` | GET | Disables draft mode, redirects to `/` |

Email sender: `NS Academy <leads@nsacademy.in>`  
Mentor email: `nikesh@nsacademy.in`

---

## Lead Capture

| Feature | Details |
|---|---|
| **Floating WhatsApp button** | Fixed bottom-right on every page. Number and pre-filled message come from Sanity `contact.whatsappNumber` + `contact.whatsappMessage` |
| **Show Interest form** | On `/contact` — collects Name, Phone, Email, CA Level, Attempt, Message. Sends lead email to mentor (with one-click WhatsApp reply link) + confirmation email to student |
| **Contact form** | Also on `/contact` — collects Name, Phone, Email, Subject, Message. Sends email to mentor with `replyTo` set to student's email |

---

## Navigation & Layout

- **Navbar** (`Navbar.tsx`): Transparent on hero, white on scroll. Mobile hamburger drawer. Links to Contact, Blog, YouTube.
- **Footer** (`Footer.tsx`): Links to all pages + legal. Social links (YouTube, Instagram, LinkedIn).
- **WhatsApp button**: Rendered in root layout, visible on every page.
- **ScrollToTop** (`ScrollToTop.tsx`): Auto-scrolls to top on route change.
- **SectionErrorBoundary**: Wraps every homepage section — if one section crashes, the rest still render.
- **CSP headers**: Strict Content Security Policy on all routes. Studio has a permissive policy to allow Sanity CDN scripts. HSTS enabled in production.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local`:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=i9bqo0t1
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=sk...          # from sanity.io → project → API → Tokens
SANITY_REVALIDATE_SECRET=NsAcademy

# Resend
RESEND_API_KEY=re_...           # from resend.com → API Keys

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=NS Academy
```

### 3. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site.  
Open [http://localhost:3000/studio](http://localhost:3000/studio) — the CMS.

---

## Scripts

```bash
npm run dev              # start dev server
npm run build            # production build
npm run start            # start production server
npm run lint             # ESLint
npm run type-check       # TypeScript check (tsc --noEmit)
npm test                 # unit tests (Vitest)
npm run test:watch       # Vitest in watch mode
npm run test:coverage    # unit tests with coverage report
npm run test:e2e         # E2E tests (Playwright, requires running dev server)
npm run test:e2e:headed  # E2E with browser visible
npm run test:all         # unit + E2E
node scripts/verify-sanity-fields.mjs  # verify all 51 Sanity fields live on localhost
```

---

## Tests

### Unit tests (Vitest)

```
__tests__/
├── api/
│   ├── contact.test.ts         # POST /api/contact
│   └── revalidate.test.ts      # POST /api/revalidate
├── components/
│   ├── badge.test.tsx
│   └── button.test.tsx
├── home/
│   └── sections.test.tsx       # CMS resilience — every section renders with null/empty/partial data
├── lib/
│   └── utils.test.ts
└── sanity/
    └── field-rendering.test.tsx  # 74 field tests — every Sanity field renders in the DOM
```

**180 tests, 7 test files.**

### E2E tests (Playwright — Chromium)

```
e2e/
├── homepage.spec.ts        # SEO, Hero, Nav, YouTube, Testimonials, FAQ, Footer, WhatsApp
└── sanity-content.spec.ts  # 28 tests — every CMS section visible on live site, revalidation webhook, draft mode
```

### Sanity field verification script

`scripts/verify-sanity-fields.mjs` — patches each of the 51 Sanity fields with a unique test value, triggers revalidation, fetches the page, and confirms the value appears. Restores all original values at the end.

```bash
node scripts/verify-sanity-fields.mjs
```

---

## Project Structure

```
ns-academy/
├── app/
│   ├── page.tsx                        # Homepage — fetches all Sanity data, renders sections
│   ├── layout.tsx                      # Root layout — Navbar, Footer, WhatsAppButton, SanityLive
│   ├── contact/page.tsx                # Contact page
│   ├── blog/page.tsx                   # Blog placeholder
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── refund/page.tsx
│   ├── studio/[[...tool]]/page.tsx     # Embedded Sanity Studio
│   └── api/
│       ├── contact/route.ts            # Contact form email
│       ├── show-interest/route.ts      # Lead capture email
│       ├── revalidate/route.ts         # Sanity webhook → ISR revalidation
│       └── draft-mode/
│           ├── enable/route.ts
│           └── disable/route.ts
│
├── components/
│   ├── home/                           # One file per homepage section
│   │   ├── HeroSection.tsx
│   │   ├── StatsBar.tsx
│   │   ├── AboutSection.tsx
│   │   ├── YouTubeSection.tsx
│   │   ├── VideoGrid.tsx
│   │   ├── TeachingPhilosophy.tsx
│   │   ├── AboutSeries.tsx
│   │   ├── WhyUs.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FAQSection.tsx
│   │   └── YouTubeSubscribeBanner.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ConditionalPublicLayout.tsx
│   ├── contact/
│   │   └── ContactForm.tsx
│   ├── shared/
│   │   ├── SectionErrorBoundary.tsx
│   │   ├── AnimateOnScroll.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── SectionHeading.tsx
│   └── ui/
│       ├── WhatsAppButton.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── label.tsx
│
├── lib/
│   └── sanity/
│       ├── client.ts       # Sanity client (useCdn: false in dev, true in prod)
│       ├── queries.ts      # SITE_CONTENT_QUERY — fetches full siteContent document
│       ├── types.ts        # TypeScript interfaces for all CMS data
│       └── image.ts        # urlFor() image URL builder
│
├── sanity/
│   ├── schemaTypes/
│   │   ├── index.ts
│   │   └── siteContent.ts  # Full schema — all 13 groups and 50+ fields
│   ├── lib/
│   │   ├── client.ts       # Studio-side Sanity client
│   │   ├── image.ts
│   │   └── live.ts         # SanityLive + sanityFetch (real-time updates)
│   ├── structure.ts        # Studio sidebar structure
│   └── env.ts              # Env var validation
│
├── scripts/
│   └── verify-sanity-fields.mjs   # End-to-end field verification (51 fields)
│
├── __tests__/              # Vitest unit tests
├── e2e/                    # Playwright E2E tests
├── sanity.config.ts        # Sanity Studio config (Structure + Presentation tools)
├── next.config.ts          # Next.js config (redirects, image domains, CSP headers)
├── vitest.config.ts
├── playwright.config.ts
└── .husky/
    └── pre-commit          # Runs lint-staged (ESLint) + Vitest on every commit
```

---

## Deployment (Vercel)

1. Push `main` branch to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import `globalniryat/ns-academy`
3. Set Production Branch to `main`
4. Add all environment variables (see list above)
5. Deploy

**After deploying**, set up the Sanity revalidation webhook so content changes go live immediately:
- URL: `https://<your-vercel-domain>/api/revalidate?secret=NsAcademy`
- Trigger: document published, type `siteContent`

---

## Git Flow

```
main      ← production, deployed to Vercel
develop   ← integration branch
feature/* ← individual features (git flow feature start <name>)
bugfix/*  ← bug fixes
release/* ← release preparation
hotfix/*  ← urgent production fixes
```

```bash
git flow feature start my-feature
git flow feature finish my-feature   # merges into develop
```

---

## Branch

`main` is the production branch. `develop` is the integration branch. All work goes through `develop` before merging to `main`.
