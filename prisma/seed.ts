import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(__dirname, '../.env.local') })

import { PrismaClient, CourseLevel, CourseStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { createClient } from '@supabase/supabase-js'

function parseDbUrl(url: string) {
  const parsed = new URL(url)
  return {
    host: parsed.hostname,
    port: parseInt(parsed.port || '5432'),
    database: parsed.pathname.replace(/^\//, ''),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    ssl: { rejectUnauthorized: false },
  }
}

// Use pooler URL (port 6543) — reachable from GitHub Actions / Vercel.
const pool = new Pool(parseDbUrl(process.env.DATABASE_URL!))
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  console.log('🌱 Seeding database...')

  // ─── ADMIN USER ───────────────────────────────────────────
  console.log('Creating admin user...')
  const { data: adminAuth, error: adminError } = await supabaseAdmin.auth.admin.createUser({
    email: 'admin@nsacademy.com',
    password: 'admin123',
    email_confirm: true,
    user_metadata: { full_name: 'CA Nikesh Shah', role: 'ADMIN' },
  })
  if (adminError && !adminError.message.includes('already been registered')) {
    console.error('Admin creation error:', adminError.message)
  }

  // Update or create admin profile
  if (adminAuth?.user) {
    await prisma.profile.upsert({
      where: { id: adminAuth.user.id },
      update: { role: 'ADMIN', name: 'CA Nikesh Shah' },
      create: {
        id: adminAuth.user.id,
        email: 'admin@nsacademy.com',
        name: 'CA Nikesh Shah',
        role: 'ADMIN',
      },
    })
    // Set role in auth metadata for middleware check
    await supabaseAdmin.auth.admin.updateUserById(adminAuth.user.id, {
      user_metadata: { full_name: 'CA Nikesh Shah', role: 'ADMIN' },
    })
    console.log('✅ Admin user created')
  }

  // ─── DEMO STUDENT ─────────────────────────────────────────
  console.log('Creating demo student...')
  const { data: studentAuth, error: studentError } = await supabaseAdmin.auth.admin.createUser({
    email: 'student@demo.com',
    password: 'demo123',
    email_confirm: true,
    user_metadata: { full_name: 'Demo Student' },
  })
  if (studentError && !studentError.message.includes('already been registered')) {
    console.error('Student creation error:', studentError.message)
  }
  if (studentAuth?.user) {
    await prisma.profile.upsert({
      where: { id: studentAuth.user.id },
      update: { name: 'Demo Student' },
      create: {
        id: studentAuth.user.id,
        email: 'student@demo.com',
        name: 'Demo Student',
        role: 'STUDENT',
      },
    })
    console.log('✅ Demo student created')
  }

  // ─── COURSE: CA FINAL SFM ─────────────────────────────────
  console.log('Creating CA Final SFM course...')
  const course = await prisma.course.upsert({
    where: { slug: 'ca-final-sfm' },
    update: {},
    create: {
      slug: 'ca-final-sfm',
      title: 'CA Final — Strategic Financial Management',
      shortDescription: 'Master SFM with simplified logic. Pass CA Finals confidently.',
      description: `Strategic Financial Management (SFM) is one of the most feared subjects in CA Finals — but it doesn't have to be. CA Nikesh Shah breaks down every concept using real-world logic, not rote memorization.

This course covers the complete SFM syllabus as per ICAI curriculum, with step-by-step video explanations, worked examples, and formula sheets. Even students with zero prior knowledge of finance can follow along and pass.

**What makes this different:** CA Nikesh Shah's signature approach — understand the logic first, and the formula follows naturally. You'll never forget a concept again.`,
      level: CourseLevel.FINAL,
      status: CourseStatus.PUBLISHED,
      price: 299900,
      originalPrice: 599900,
      duration: '35 hours',
      color: '#166534',
      instructor: 'CA Nikesh Shah',
      rating: 4.9,
      totalRatings: 312,
      sortOrder: 1,
      whatYoullLearn: [
        'Master Financial Policy & Corporate Strategy with clarity',
        'Understand derivatives, futures, options & risk management from scratch',
        'Value securities using DCF, relative valuation, and bond pricing',
        'Build & optimise investment portfolios using Markowitz & CAPM',
        'Handle forex transactions, hedging, and international finance confidently',
        'Solve any SFM problem in exams using structured logical frameworks',
      ],
      metaTitle: 'CA Final SFM Course | CA Nikesh Shah — NS Academy',
      metaDescription:
        'Pass CA Finals Strategic Financial Management with simplified logic. 35 hours, 5 modules, 100% money-back guarantee. Taught by CA Nikesh Shah.',
    },
  })

  // ─── SECTIONS & LESSONS ───────────────────────────────────
  const curriculumData = [
    {
      title: 'Financial Policy & Corporate Strategy',
      lessons: [
        { title: 'Introduction to Financial Policy', duration: '14:32', isFreePreview: true },
        { title: 'Corporate Strategy & Financial Objectives', duration: '18:45', isFreePreview: false },
        { title: 'Capital Structure Decisions', duration: '22:10', isFreePreview: false },
        { title: 'Dividend Policy — Theories & Models', duration: '20:55', isFreePreview: false },
        { title: 'Working Capital Management', duration: '16:30', isFreePreview: false },
      ],
    },
    {
      title: 'Risk Management & Derivatives',
      lessons: [
        { title: 'Types of Financial Risk', duration: '12:20', isFreePreview: false },
        { title: 'Futures Contracts — Mechanics & Pricing', duration: '24:15', isFreePreview: false },
        { title: 'Options — Calls, Puts & Strategies', duration: '28:40', isFreePreview: false },
        { title: 'Swaps & Interest Rate Derivatives', duration: '19:05', isFreePreview: false },
      ],
    },
    {
      title: 'Security Analysis & Valuation',
      lessons: [
        { title: 'Fundamental Analysis Framework', duration: '15:50', isFreePreview: false },
        { title: 'DCF Valuation — Step by Step', duration: '26:35', isFreePreview: false },
        { title: 'Bond Valuation & Duration', duration: '21:10', isFreePreview: false },
        { title: 'Equity Valuation Models', duration: '23:45', isFreePreview: false },
        { title: 'Relative Valuation — P/E, EV/EBITDA', duration: '17:20', isFreePreview: false },
      ],
    },
    {
      title: 'Portfolio Management',
      lessons: [
        { title: 'Portfolio Theory — Markowitz Model', duration: '25:00', isFreePreview: false },
        { title: 'Capital Asset Pricing Model (CAPM)', duration: '22:30', isFreePreview: false },
        { title: 'Portfolio Performance Evaluation', duration: '18:15', isFreePreview: false },
        { title: 'Mutual Funds & Index Funds', duration: '14:50', isFreePreview: false },
      ],
    },
    {
      title: 'Foreign Exchange & International Finance',
      lessons: [
        { title: 'Forex Market — Basics & Quotations', duration: '16:40', isFreePreview: false },
        { title: 'Exchange Rate Theories', duration: '20:25', isFreePreview: false },
        { title: 'Forex Hedging — Forward, Futures, Options', duration: '24:55', isFreePreview: false },
        { title: 'International Capital Budgeting', duration: '21:15', isFreePreview: false },
        { title: 'ADR, GDR & Foreign Investment', duration: '13:30', isFreePreview: false },
      ],
    },
  ]

  // Delete existing sections for this course (clean reseed)
  await prisma.section.deleteMany({ where: { courseId: course.id } })

  for (let sIdx = 0; sIdx < curriculumData.length; sIdx++) {
    const sectionData = curriculumData[sIdx]
    const section = await prisma.section.create({
      data: {
        courseId: course.id,
        title: sectionData.title,
        sortOrder: sIdx,
      },
    })
    for (let lIdx = 0; lIdx < sectionData.lessons.length; lIdx++) {
      const lesson = sectionData.lessons[lIdx]
      await prisma.lesson.create({
        data: {
          sectionId: section.id,
          title: lesson.title,
          videoUrl: 'dQw4w9WgXcQ', // placeholder YouTube ID
          duration: lesson.duration,
          isFreePreview: lesson.isFreePreview,
          sortOrder: lIdx,
          description: `In this lesson, CA Nikesh Shah explains ${lesson.title.toLowerCase()} using real-world examples and simplified logic.`,
        },
      })
    }
  }
  console.log('✅ Course + curriculum created (5 sections, 23 lessons)')

  // Course notes
  await prisma.courseNote.deleteMany({ where: { courseId: course.id } })
  await prisma.courseNote.createMany({
    data: [
      { courseId: course.id, title: 'SFM Complete Formula Sheet', fileUrl: '/placeholder-formula-sheet.pdf', sortOrder: 0 },
      { courseId: course.id, title: 'Chapter Summary Notes', fileUrl: '/placeholder-summary-notes.pdf', sortOrder: 1 },
    ],
  })

  // ─── SITE CONTENT ─────────────────────────────────────────
  console.log('Seeding site content...')
  const contentData = [
    { key: 'hero.headline', value: 'Pass CA Finals with Simplified Logic — Not Memorization', type: 'text' },
    { key: 'hero.subtext', value: "Even if you've never studied this subject before — with CA Nikesh Shah's logic-based approach, you WILL pass. Guaranteed.", type: 'text' },
    { key: 'hero.badge', value: 'Trusted by 2,000+ CA Students', type: 'text' },
    { key: 'hero.cta_primary', value: 'Explore the Course', type: 'text' },
    { key: 'hero.cta_secondary', value: 'Watch Free Lecture', type: 'text' },
    { key: 'stats.1.number', value: '2,000+', type: 'text' },
    { key: 'stats.1.label', value: 'Students Enrolled', type: 'text' },
    { key: 'stats.2.number', value: '89%', type: 'text' },
    { key: 'stats.2.label', value: 'Pass Rate', type: 'text' },
    { key: 'stats.3.number', value: '100%', type: 'text' },
    { key: 'stats.3.label', value: 'Money-Back Guarantee', type: 'text' },
    { key: 'stats.4.number', value: '1', type: 'text' },
    { key: 'stats.4.label', value: 'Subject, Complete Mastery', type: 'text' },
    { key: 'instructor.name', value: 'CA Nikesh Shah', type: 'text' },
    { key: 'instructor.title', value: 'Chartered Accountant | CA Finals Specialist', type: 'text' },
    {
      key: 'instructor.bio',
      value:
        "CA Nikesh Shah is a Chartered Accountant and dedicated educator with over 10 years of experience teaching CA Finals students at Symbiosis College, Pune. His teaching philosophy is simple: if you understand the logic, you never need to memorize.\n\nHis students consistently outperform national averages, with an 89% pass rate across SFM batches. Whether you're a complete beginner or a repeat candidate, CA Nikesh Shah's systematic, logic-first approach will transform how you think about financial management.",
      type: 'text',
    },
    { key: 'instructor.photo', value: '/nikesh-shah.jpg', type: 'image_url' },
    {
      key: 'instructor.credentials',
      value: JSON.stringify(['ICAI Member', '10+ Years Teaching', 'Symbiosis College Pune', 'CA Finals Specialist']),
      type: 'json',
    },
    { key: 'cta.headline', value: 'Ready to Clear CA Finals?', type: 'text' },
    { key: 'cta.subtext', value: 'Join 2,000+ students who passed with simplified logic.', type: 'text' },
    { key: 'cta.button_text', value: 'Get Started Today', type: 'text' },
    { key: 'footer.tagline', value: "India's trusted platform for CA exam preparation through logic-based teaching.", type: 'text' },
    { key: 'footer.youtube', value: 'https://youtube.com/@canikeshshah', type: 'text' },
    { key: 'footer.instagram', value: 'https://instagram.com/canikeshshah', type: 'text' },
    { key: 'footer.email', value: 'contact@nsacademy.com', type: 'text' },
  ]

  for (const item of contentData) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: { value: item.value, type: item.type },
      create: item,
    })
  }
  console.log('✅ Site content seeded')

  // ─── TESTIMONIALS ─────────────────────────────────────────
  console.log('Seeding testimonials...')
  await prisma.testimonial.deleteMany()
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Sneha Kulkarni',
        college: 'Symbiosis College, Pune',
        role: 'CA Final Student',
        quote:
          "I had failed SFM twice before joining NS Academy. CA Nikesh Sir's logic-based approach completely changed how I look at the subject. Instead of memorizing formulas, I now understand WHY each formula works. Cleared in my very next attempt!",
        rating: 5,
        sortOrder: 0,
      },
      {
        name: 'Rohan Deshmukh',
        college: 'Symbiosis College, Pune',
        role: 'CA Final — AIR 23',
        quote:
          'The derivative and options chapters used to be my weakest areas. After watching just 3 lectures, I could solve any question from the ICAI study material. The way Sir connects real stock market examples to exam questions is brilliant.',
        rating: 5,
        sortOrder: 1,
      },
      {
        name: 'Priya Joshi',
        college: 'B.M.C.C., Pune',
        role: 'CA Final Student',
        quote:
          "I enrolled 2 months before my exams with zero SFM preparation. The structured curriculum and formula sheets helped me cover the entire syllabus systematically. Scored 68 marks in SFM — my highest ever. The 100% money-back guarantee gave me the confidence to enroll.",
        rating: 5,
        sortOrder: 2,
      },
      {
        name: 'Amit Patil',
        college: 'Fergusson College, Pune',
        role: 'CA Final Student',
        quote:
          'What separates this course from other coaching is that Sir never asks you to "just remember this." Every single concept has a logical derivation. Portfolio management and CAPM finally made sense to me after years of confusion.',
        rating: 5,
        sortOrder: 3,
      },
      {
        name: 'Neha Sharma',
        college: 'H.R. College, Mumbai',
        role: 'CA Final Student',
        quote:
          "The forex and international finance module alone is worth the entire course fee. I used to dread those 20-mark questions. Now I actually look forward to them in the exam. CA Nikesh Sir's teaching style is engaging and his examples stick with you.",
        rating: 5,
        sortOrder: 4,
      },
      {
        name: 'Vikram Iyer',
        college: 'Loyola College, Chennai',
        role: 'CA Final Student',
        quote:
          "Solid course with excellent content. The course notes PDF is a goldmine — I used it as my last-minute revision guide. The video quality and explanation depth are top-notch. Highly recommend for anyone struggling with SFM.",
        rating: 4,
        sortOrder: 5,
      },
    ],
  })
  console.log('✅ Testimonials seeded')

  // ─── FAQs ──────────────────────────────────────────────────
  console.log('Seeding FAQs...')
  await prisma.fAQ.deleteMany()
  await prisma.fAQ.createMany({
    data: [
      {
        question: "What if I haven't studied this subject at all?",
        answer:
          "That's perfectly fine — and honestly, it can be an advantage. CA Nikesh Shah's course is designed from the ground up assuming zero prior knowledge. We start with the 'why' before the 'how', so you build a genuine understanding rather than patchy knowledge from half-remembered coaching.",
        sortOrder: 0,
      },
      {
        question: 'How does the money-back guarantee work?',
        answer:
          "Simple: if you're not satisfied within 30 days of purchase, email us at contact@nsacademy.com and we'll refund 100% of your payment, no questions asked. We're confident in the quality of the course, but we don't want you to take any risk.",
        sortOrder: 1,
      },
      {
        question: 'Is this course enough to pass CA Finals?',
        answer:
          "Yes — this course covers the complete SFM syllabus as per ICAI curriculum. Combined with the formula sheets, chapter notes, and practice problems, students who complete the course have an 89% pass rate. Of course, you'll also need to practice ICAI study material and past papers alongside any coaching.",
        sortOrder: 2,
      },
      {
        question: 'How long do I have access to the course?',
        answer:
          'You get lifetime access. Once you enroll, the course is yours forever — including any future updates or additional content CA Nikesh Shah adds to the curriculum. Study at your own pace, pause, rewind, and revise as many times as you need.',
        sortOrder: 3,
      },
      {
        question: 'Can I watch on mobile?',
        answer:
          "Yes, fully. The platform is responsive and works on any device — phone, tablet, laptop, or desktop. All videos are hosted on YouTube (privacy mode) so they stream reliably even on slower connections. You can also download the PDF notes to study offline.",
        sortOrder: 4,
      },
      {
        question: 'How is this different from other SFM coaching?',
        answer:
          "Most SFM coaching focuses on pattern recognition and formula drilling. CA Nikesh Shah's approach is fundamentally different — he teaches the underlying logic of every concept first. When you understand why a formula exists, you can derive it in the exam room even if you forget it. This is why repeat candidates who've tried other coaching consistently find our approach transformative.",
        sortOrder: 5,
      },
    ],
  })
  console.log('✅ FAQs seeded')

  console.log('\n✅ Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
