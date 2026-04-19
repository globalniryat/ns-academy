/**
 * Seed script — run once to pre-fill all Sanity CMS fields with defaults.
 * Usage: npx tsx scripts/seed-sanity.ts
 *
 * Requires SANITY_API_TOKEN in .env.local (write token from sanity.io → API → Tokens)
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

const siteContent = {
  _id: 'siteContent',
  _type: 'siteContent',

  hero: {
    badgeText: 'Taught by CA Nikesh Shah · CA Final Expert',
    headline: 'Understand CA Final SFM — Not Just Memorize It',
    subtext: "CA Nikesh Shah's logic-first approach to Strategic Financial Management — built for students with zero prior knowledge. Walk into the exam room confident.",
    bulletPoints: [
      'Logic-first teaching — understand, don\'t memorize',
      'Zero prior knowledge required to start',
      'Full CA Final SFM syllabus covered',
      'Free on YouTube — watch before you decide',
    ],
    primaryButtonText: 'Watch Free Lectures on YouTube →',
    primaryButtonUrl: 'https://www.youtube.com/@CANikeshShah',
    secondaryButtonText: 'Get in Touch',
    secondaryButtonUrl: '/contact',
    youtubeVideoId: 'dQw4w9WgXcQ',
    youtubeNote: 'New lectures added every week',
  },

  stats: [
    { _key: 's1', value: '2,000+', label: 'Students Mentored' },
    { _key: 's2', value: '4.9 / 5', label: 'Average Student Rating' },
    { _key: 's3', value: '35 Hrs', label: 'Structured Video Content' },
    { _key: 's4', value: 'Free', label: 'Available on YouTube' },
  ],

  about: {
    name: 'CA Nikesh Shah',
    title: 'CA Final SFM Expert · Symbiosis College Pune',
    bio1: 'CA Nikesh Shah is a Chartered Accountant and faculty at Symbiosis College, Pune with over 10 years of experience teaching Strategic Financial Management to CA Final students.',
    bio2: 'His teaching philosophy is simple: if you understand the logic, you never need to memorize. Every concept in the SFM series is explained from first principles using real-world examples.',
    bio3: 'The entire CA Final SFM series is available free on YouTube — no enrollment, no payment, no catch. Just open and learn.',
    pullQuote: 'If you understand the logic, you never need to memorize.',
    credentials: [
      { _key: 'c1', text: 'Chartered Accountant (ICAI)' },
      { _key: 'c2', text: '10+ Years Teaching Experience' },
      { _key: 'c3', text: 'Faculty, Symbiosis College Pune' },
      { _key: 'c4', text: 'CA Final SFM Specialist' },
    ],
  },

  teachingPhilosophy: {
    sectionLabel: 'THE NS ACADEMY DIFFERENCE',
    heading: 'Logic Over Memorization',
    cards: [
      { _key: 'tp1', title: 'First Principles Thinking', description: 'Every concept is built from the ground up. You understand why a formula exists before you use it.' },
      { _key: 'tp2', title: 'Student-Centred Pace', description: 'Lectures are structured so each concept flows naturally into the next — no gaps, no confusion.' },
      { _key: 'tp3', title: 'Exam-Focused Practice', description: 'Every topic is connected to ICAI exam patterns. You study what matters and skip what doesn\'t.' },
    ],
  },

  youtubeSection: {
    sectionLabel: 'FREE ON YOUTUBE',
    heading: 'Watch the Full SFM Series — Free',
    subtext: "CA Nikesh Shah's complete CA Final Strategic Financial Management lecture series. Available free on YouTube. New lectures every week.",
    featuredVideoId: 'dQw4w9WgXcQ',
    channelUrl: 'https://www.youtube.com/@CANikeshShah',
    playlistNote: 'New lectures added every week',
    ctaButtonText: 'View Full Playlist on YouTube →',
    topics: [
      { _key: 'yt1', title: 'Portfolio Theory & CAPM', description: 'Risk, return, efficient frontier, and CAPM explained from first principles.' },
      { _key: 'yt2', title: 'Derivatives — Options & Futures', description: 'Options pricing, futures hedging, and real market examples.' },
      { _key: 'yt3', title: 'Mergers & Acquisitions', description: 'Valuation methods, deal structures, and exam-focused practice.' },
      { _key: 'yt4', title: 'International Finance', description: 'Exchange rates, hedging strategies, and international parity conditions.' },
    ],
  },

  videoGrid: {
    heading: 'Recent Lectures',
    videos: [
      { _key: 'v1', videoId: 'dQw4w9WgXcQ', title: 'Portfolio Theory — Introduction', duration: '48 min' },
      { _key: 'v2', videoId: 'dQw4w9WgXcQ', title: 'CAPM Explained Simply', duration: '52 min' },
      { _key: 'v3', videoId: 'dQw4w9WgXcQ', title: 'Options Pricing — Black Scholes', duration: '61 min' },
      { _key: 'v4', videoId: 'dQw4w9WgXcQ', title: 'Futures & Hedging Strategies', duration: '55 min' },
      { _key: 'v5', videoId: 'dQw4w9WgXcQ', title: 'Foreign Exchange Management', duration: '49 min' },
      { _key: 'v6', videoId: 'dQw4w9WgXcQ', title: 'Corporate Valuation Methods', duration: '58 min' },
    ],
  },

  aboutSeries: {
    heading: 'What the Series Covers',
    subtext: 'Complete CA Final SFM syllabus. Every topic. Every concept. All free.',
    topics: [
      'Portfolio Theory', 'CAPM', 'Sharpe & Treynor', 'Options Pricing',
      'Futures Hedging', 'Swaps', 'Forex Management', 'Interest Rate Risk',
      'Corporate Valuation', 'M&A', 'LBO', 'Capital Budgeting',
      'Dividend Policy', 'Working Capital', 'Leasing', 'Mutual Funds',
    ],
  },

  whoIsItFor: {
    sectionLabel: 'WHO IS THIS FOR?',
    heading: 'Built for CA Final Students',
    cards: [
      { _key: 'w1', title: 'First-time CA Final Aspirants', description: 'Starting SFM from scratch with zero finance background — this series is designed for you.' },
      { _key: 'w2', title: 'CA Final Repeaters', description: 'Have attempted before and want to finally crack SFM? The logic-first approach will change how you see the subject.' },
      { _key: 'w3', title: 'Students Between Attempts', description: 'Waiting for your next attempt and want to build a stronger foundation? Use this time to master every concept.' },
    ],
  },

  testimonials: {
    sectionLabel: 'STUDENT STORIES',
    heading: 'Results That Speak for Themselves',
    subtext: 'Students from Symbiosis College Pune and across India share their experience.',
    overallRating: '4.9',
    items: [
      { _key: 't1', name: 'Priya Sharma', college: 'CA Final · Delhi', initials: 'PS', color: 'bg-green-600', quote: 'CA Nikesh Sir explains SFM like no one else. The CAPM module was crystal clear — I attempted every derivatives question in my exam. Something I never thought was possible for me.' },
      { _key: 't2', name: 'Rahul Mehta', college: 'Symbiosis College · Pune', initials: 'RM', color: 'bg-blue-600', quote: 'Free on YouTube means I could watch, rewatch, and rewatch again without any pressure. Passed CA Final with SFM as my strongest subject. Genuinely life-changing, thank you sir.' },
      { _key: 't3', name: 'Ananya Joshi', college: 'CA Final · Mumbai', initials: 'AJ', color: 'bg-purple-600', quote: 'I came from commerce with zero finance background. After the first 10 lectures, everything clicked. The logic-first approach is unlike any coaching I have tried before.' },
      { _key: 't4', name: 'Karan Patel', college: 'CA Final · Ahmedabad', initials: 'KP', color: 'bg-amber-600', quote: 'The portfolio theory series changed how I think about finance. Sir connects every concept to the next — SFM stops feeling like disconnected chapters and becomes one clear story.' },
      { _key: 't5', name: 'Sneha Iyer', college: 'CA Final · Bangalore', initials: 'SI', color: 'bg-teal-600', quote: 'M&A valuation used to terrify me. Three lectures in, I was solving problems independently. The clarity you get here is only possible when the teacher truly understands the subject.' },
      { _key: 't6', name: 'Varun Gupta', college: 'CA Final · Hyderabad', initials: 'VG', color: 'bg-red-600', quote: 'The foreign exchange module alone is worth subscribing for. Real market examples, zero jargon, complete syllabus coverage — and it is all free. This is the only SFM resource you need.' },
    ],
  },

  faq: {
    sectionLabel: 'GOT QUESTIONS?',
    heading: 'Frequently Asked Questions',
    subtext: 'Everything you need to know. Still have questions?',
    emailLinkText: 'Email us',
    email: 'contact@nsacademy.in',
    items: [
      { _key: 'f1', question: 'What topics does the CA Final SFM series cover?', answer: 'The series covers the complete CA Final SFM syllabus: Portfolio Theory & CAPM, Derivatives (Options & Futures), Foreign Exchange Management, Corporate Valuation, Mergers & Acquisitions, Interest Rate Risk Management, and more — all mapped to the ICAI exam pattern.' },
      { _key: 'f2', question: 'Do I need prior finance knowledge to start?', answer: 'No. The series starts from absolute zero. CA Nikesh Shah builds every concept from first principles using logic — if you understand basic arithmetic, you are ready to begin.' },
      { _key: 'f3', question: 'How often are new lectures uploaded?', answer: 'New lectures are added every week. Subscribe to the YouTube channel and turn on notifications so you never miss an upload.' },
      { _key: 'f4', question: 'Is this useful for the ICAI CA Final exam?', answer: 'Yes. Every lecture is mapped directly to the ICAI CA Final SFM syllabus. The focus is on building the kind of deep understanding that helps in both theory and numerical questions under exam pressure.' },
      { _key: 'f5', question: 'Can I watch on my mobile or tablet?', answer: 'Absolutely — the entire series is on YouTube and works on any device: phone, tablet, laptop, or desktop. No app, no login, no download required.' },
      { _key: 'f6', question: 'How do I get help if I am stuck on a concept?', answer: 'Drop a comment on the YouTube video — CA Nikesh Shah personally reads and replies to student questions. For direct queries, reach out via WhatsApp or the Contact page.' },
    ],
  },

  contact: {
    whatsappNumber: '91XXXXXXXXXX',
    whatsappMessage: 'Hi CA Nikesh Shah, I watched your YouTube series and wanted to get in touch.',
    email: 'contact@nsacademy.in',
    location: 'Pune, Maharashtra · Symbiosis College',
  },

  footer: {
    tagline: 'Free CA Final SFM lectures on YouTube. Logic-first teaching by CA Nikesh Shah.',
    youtubeUrl: 'https://www.youtube.com/@CANikeshShah',
    instagramUrl: 'https://instagram.com',
    linkedinUrl: 'https://linkedin.com',
  },

  youtubeSubscribeBanner: {
    text: 'Never miss a new lecture — new videos every week',
    buttonText: 'Subscribe on YouTube →',
    channelUrl: 'https://www.youtube.com/@CANikeshShah',
  },
}

async function seed() {
  console.log('🌱 Seeding Sanity with default content...')

  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ SANITY_API_TOKEN is not set in .env.local')
    console.error('   Get a write token from: sanity.io → API → Tokens → Add API token')
    process.exit(1)
  }

  try {
    const result = await client.createOrReplace(siteContent)
    console.log('✅ Done! Document created:', result._id)
    console.log('   Go to localhost:3000/studio → Structure → Site Content to see all pre-filled fields.')
  } catch (err) {
    console.error('❌ Seed failed:', err)
    process.exit(1)
  }
}

seed()
