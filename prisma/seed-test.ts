/**
 * Test data seed — creates accounts and data specifically for the E2E test suite.
 *
 * This is SEPARATE from the main seed.ts (which seeds production-like data).
 * Run this before executing Playwright tests:
 *
 *   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed-test.ts
 *
 * Credentials seeded:
 *   Admin : admin@nsacademy.dev  / AdminPass@1234
 *   Student: testplayer@nsacademy.dev / TestPass@1234
 *
 * Safe to run multiple times — all operations are idempotent (upsert).
 */

import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(__dirname, '../.env.local') })

import { PrismaClient, CourseLevel, CourseStatus, EnrollmentStatus, PaymentStatus } from '@prisma/client'
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
// DIRECT_URL (port 5432) is blocked in most hosted environments.
const pool = new Pool(parseDbUrl(process.env.DATABASE_URL!))
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function ensureUser(email: string, password: string, name: string, role: 'ADMIN' | 'STUDENT') {
  // Try create — if already registered, fetch existing
  const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name, role },
  })

  let userId: string

  if (createErr) {
    if (createErr.message.includes('already been registered') || createErr.message.includes('already exists')) {
      // Fetch existing user by email
      const { data: list } = await supabaseAdmin.auth.admin.listUsers()
      const existing = list?.users?.find((u) => u.email === email)
      if (!existing) throw new Error(`Cannot find existing user: ${email}`)
      userId = existing.id
      // Ensure password and metadata are up to date
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password,
        user_metadata: { full_name: name, role },
      })
    } else {
      throw createErr
    }
  } else {
    userId = created.user!.id
  }

  // Upsert profile in Prisma
  await prisma.profile.upsert({
    where: { id: userId },
    update: { name, role },
    create: { id: userId, email, name, role },
  })

  console.log(`  ✓ ${role} user: ${email} (${userId})`)
  return userId
}

async function main() {
  console.log('\n🧪 Seeding test data for E2E suite...\n')

  // ── 1. TEST ACCOUNTS ────────────────────────────────────────────────────────

  console.log('Creating test accounts...')
  await ensureUser('admin@nsacademy.dev', 'AdminPass@1234', 'Test Admin', 'ADMIN')
  const studentId = await ensureUser('testplayer@nsacademy.dev', 'TestPass@1234', 'Test Player', 'STUDENT')

  // Create extra students for the students list page
  const extraStudents: string[] = []
  const extras = [
    { email: 'ravi.kumar.test@nsacademy.dev', name: 'Ravi Kumar (Test)' },
    { email: 'priya.joshi.test@nsacademy.dev', name: 'Priya Joshi (Test)' },
    { email: 'ankit.patel.test@nsacademy.dev', name: 'Ankit Patel (Test)' },
  ]
  for (const s of extras) {
    const id = await ensureUser(s.email, 'TestPass@1234', s.name, 'STUDENT')
    extraStudents.push(id)
  }

  // ── 2. COURSES ──────────────────────────────────────────────────────────────

  console.log('\nCreating test courses...')

  // Primary course (PUBLISHED — needed for payment/enrollment tests)
  const course1 = await prisma.course.upsert({
    where: { slug: 'ca-final-sfm' },
    update: { status: CourseStatus.PUBLISHED },
    create: {
      slug: 'ca-final-sfm',
      title: 'CA Final — Strategic Financial Management',
      shortDescription: 'Master SFM with simplified logic. Pass CA Finals confidently.',
      description: 'Strategic Financial Management (SFM) is one of the most feared subjects in CA Finals. This comprehensive course covers the complete syllabus with real-world examples and logical explanations.',
      level: CourseLevel.FINAL,
      status: CourseStatus.PUBLISHED,
      price: 299900,
      originalPrice: 599900,
      duration: '35 hours',
      color: '#166534',
      instructor: 'CA Nikesh Shah',
      sortOrder: 1,
      freePreviewUrl: 'dQw4w9WgXcQ',
      whatYoullLearn: [
        'Master Financial Policy & Corporate Strategy',
        'Understand derivatives, futures, options & risk management',
        'Value securities using DCF and relative valuation',
        'Build portfolios using Markowitz & CAPM',
        'Handle forex transactions and international finance',
      ],
      metaTitle: 'CA Final SFM Course | NS Academy',
      metaDescription: 'Pass CA Finals SFM with logic-based teaching by CA Nikesh Shah.',
    },
  })
  console.log(`  ✓ Course: ${course1.title} (${course1.id})`)

  // Draft course (for publish/unpublish tests)
  const course2 = await prisma.course.upsert({
    where: { slug: 'ca-foundation-maths-test' },
    update: {},
    create: {
      slug: 'ca-foundation-maths-test',
      title: 'CA Foundation — Business Mathematics',
      shortDescription: 'Foundation-level business mathematics for CA aspirants.',
      description: 'This course covers Business Mathematics for CA Foundation including Ratio and Proportion, Indices, Logarithms, Equations, Linear Inequalities, Time Value of Money, and more.',
      level: CourseLevel.FOUNDATION,
      status: CourseStatus.DRAFT,
      price: 99900,
      originalPrice: 199900,
      duration: '20 hours',
      color: '#1d4ed8',
      instructor: 'CA Nikesh Shah',
      sortOrder: 2,
      whatYoullLearn: ['Ratio and Proportion', 'Time Value of Money', 'Permutation and Combination'],
    },
  })
  console.log(`  ✓ Course: ${course2.title} (DRAFT)`)

  // ── 3. SECTIONS & LESSONS for course1 ───────────────────────────────────────

  console.log('\nCreating sections & lessons...')
  // Delete and recreate to ensure clean state
  await prisma.section.deleteMany({ where: { courseId: course1.id } })

  const sections = [
    {
      title: 'Financial Policy & Corporate Strategy',
      lessons: [
        { title: 'Introduction to SFM', videoUrl: 'dQw4w9WgXcQ', duration: '14:32', isFreePreview: true },
        { title: 'Corporate Strategy Frameworks', videoUrl: 'dQw4w9WgXcQ', duration: '18:45', isFreePreview: false },
        { title: 'Capital Structure Theory', videoUrl: 'dQw4w9WgXcQ', duration: '22:10', isFreePreview: false },
      ],
    },
    {
      title: 'Derivatives & Risk Management',
      lessons: [
        { title: 'Futures Contracts Explained', videoUrl: 'dQw4w9WgXcQ', duration: '24:15', isFreePreview: false },
        { title: 'Options — Calls and Puts', videoUrl: 'dQw4w9WgXcQ', duration: '28:40', isFreePreview: false },
      ],
    },
    {
      title: 'Portfolio Management',
      lessons: [
        { title: 'Markowitz Portfolio Theory', videoUrl: 'dQw4w9WgXcQ', duration: '25:00', isFreePreview: false },
        { title: 'CAPM Explained', videoUrl: 'dQw4w9WgXcQ', duration: '22:30', isFreePreview: false },
      ],
    },
  ]

  const createdSections: Array<{ id: string; lessons: Array<{ id: string }> }> = []

  for (let sIdx = 0; sIdx < sections.length; sIdx++) {
    const sec = sections[sIdx]
    const section = await prisma.section.create({
      data: { courseId: course1.id, title: sec.title, sortOrder: sIdx },
    })
    const createdLessons: Array<{ id: string }> = []
    for (let lIdx = 0; lIdx < sec.lessons.length; lIdx++) {
      const les = sec.lessons[lIdx]
      const lesson = await prisma.lesson.create({
        data: {
          sectionId: section.id,
          title: les.title,
          videoUrl: les.videoUrl,
          duration: les.duration,
          isFreePreview: les.isFreePreview,
          sortOrder: lIdx,
        },
      })
      createdLessons.push({ id: lesson.id })
    }
    createdSections.push({ id: section.id, lessons: createdLessons })
  }
  const allLessonIds = createdSections.flatMap((s) => s.lessons.map((l) => l.id))
  console.log(`  ✓ ${sections.length} sections, ${allLessonIds.length} lessons created`)

  // ── 4. ENROLLMENT & PROGRESS for testplayer ─────────────────────────────────

  console.log('\nCreating test enrollment & progress...')
  await prisma.enrollment.upsert({
    where: { userId_courseId: { userId: studentId, courseId: course1.id } },
    update: { status: EnrollmentStatus.ACTIVE },
    create: { userId: studentId, courseId: course1.id, status: EnrollmentStatus.ACTIVE },
  })

  // Mark first 2 lessons as completed
  for (let i = 0; i < Math.min(2, allLessonIds.length); i++) {
    await prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId: studentId, lessonId: allLessonIds[i] } },
      update: { isCompleted: true, watchedSeconds: 600 },
      create: {
        userId: studentId,
        lessonId: allLessonIds[i],
        isCompleted: true,
        watchedSeconds: 600,
      },
    })
  }
  console.log(`  ✓ Enrollment + 2 lessons progress for testplayer`)

  // ── 5. ENROLLMENTS for extra students ───────────────────────────────────────

  for (const sid of extraStudents) {
    await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: sid, courseId: course1.id } },
      update: {},
      create: { userId: sid, courseId: course1.id, status: EnrollmentStatus.ACTIVE },
    })
  }
  console.log(`  ✓ Enrollments created for ${extraStudents.length} extra students`)

  // ── 6. PAYMENTS ─────────────────────────────────────────────────────────────

  console.log('\nCreating test payments...')

  // Captured payment for testplayer
  const existingPayment = await prisma.payment.findFirst({
    where: { userId: studentId, courseId: course1.id, status: PaymentStatus.CAPTURED },
  })
  if (!existingPayment) {
    await prisma.payment.create({
      data: {
        userId: studentId,
        courseId: course1.id,
        amount: course1.price,
        currency: 'INR',
        status: PaymentStatus.CAPTURED,
        razorpayOrderId: `order_test_${Date.now()}_1`,
        razorpayPaymentId: `pay_test_${Date.now()}_1`,
        razorpaySignature: 'test_signature_captured',
        receiptId: `rcpt_test_${Date.now()}`,
      },
    })
  }

  // Failed payment (for admin payment list coverage)
  const existingFailed = await prisma.payment.findFirst({
    where: { userId: extraStudents[0], courseId: course1.id, status: PaymentStatus.FAILED },
  })
  if (!existingFailed) {
    await prisma.payment.create({
      data: {
        userId: extraStudents[0],
        courseId: course1.id,
        amount: course1.price,
        currency: 'INR',
        status: PaymentStatus.FAILED,
        failureReason: 'Payment declined by bank',
        razorpayOrderId: `order_test_${Date.now()}_2`,
        receiptId: `rcpt_test_${Date.now()}_2`,
      },
    })
  }
  console.log('  ✓ Payments: 1 CAPTURED, 1 FAILED')

  // ── 7. FAQS ─────────────────────────────────────────────────────────────────

  console.log('\nSeeding FAQs...')
  await prisma.fAQ.deleteMany()
  await prisma.fAQ.createMany({
    data: [
      {
        question: 'What is the duration of the CA Final SFM course?',
        answer: 'The course includes 35 hours of detailed video lectures covering the complete ICAI SFM syllabus with real-world examples.',
        isActive: true,
        sortOrder: 0,
      },
      {
        question: 'Is there a money-back guarantee?',
        answer: 'Yes, we offer a 30-day 100% money-back guarantee. If you are not satisfied, email us and we will process a full refund immediately.',
        isActive: true,
        sortOrder: 1,
      },
      {
        question: 'How long do I have access after enrollment?',
        answer: 'You get lifetime access to all course videos and materials, including any future updates made to the curriculum.',
        isActive: true,
        sortOrder: 2,
      },
      {
        question: 'Can I access the course on mobile?',
        answer: 'Yes, the platform is fully responsive and works seamlessly on mobile, tablet, and desktop devices with stable internet connection.',
        isActive: false,
        sortOrder: 3,
      },
    ],
  })
  console.log('  ✓ 4 FAQs created (3 active, 1 hidden)')

  // ── 8. TESTIMONIALS ─────────────────────────────────────────────────────────

  console.log('\nSeeding testimonials...')
  await prisma.testimonial.deleteMany()
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Sneha Kulkarni',
        college: 'Symbiosis College, Pune',
        role: 'CA Final Student',
        quote: 'I failed SFM twice before joining NS Academy. CA Nikesh Sir\'s logic-based approach transformed how I understand the subject. Cleared on my next attempt!',
        rating: 5,
        isActive: true,
        sortOrder: 0,
      },
      {
        name: 'Rohan Deshmukh',
        college: 'Symbiosis College, Pune',
        role: 'CA Final — AIR 23',
        quote: 'The derivatives and options chapters are explained brilliantly with real stock market examples. The best SFM coaching available online.',
        rating: 5,
        isActive: true,
        sortOrder: 1,
      },
      {
        name: 'Priya Joshi',
        college: 'BMCC Pune',
        role: 'CA Final Student',
        quote: 'Enrolled 2 months before exams with zero preparation. Scored 68 in SFM — my highest ever. The money-back guarantee gave me confidence to enroll.',
        rating: 5,
        isActive: true,
        sortOrder: 2,
      },
    ],
  })
  console.log('  ✓ 3 testimonials created')

  // ── 9. SITE CONTENT ─────────────────────────────────────────────────────────

  console.log('\nSeeding site content...')
  const contentItems = [
    { key: 'hero.headline', value: 'Pass CA Finals with Simplified Logic', type: 'text' },
    { key: 'hero.subtext', value: 'Logic-based CA coaching by CA Nikesh Shah', type: 'text' },
    { key: 'hero.badge', value: 'Trusted by 2,000+ CA Students', type: 'text' },
    { key: 'hero.cta_primary', value: 'Explore the Course', type: 'text' },
    { key: 'stats.1.number', value: '2,000+', type: 'text' },
    { key: 'stats.1.label', value: 'Students Enrolled', type: 'text' },
    { key: 'stats.2.number', value: '89%', type: 'text' },
    { key: 'stats.2.label', value: 'Pass Rate', type: 'text' },
    { key: 'stats.3.number', value: '100%', type: 'text' },
    { key: 'stats.3.label', value: 'Money-Back Guarantee', type: 'text' },
    { key: 'instructor.name', value: 'CA Nikesh Shah', type: 'text' },
    { key: 'instructor.title', value: 'Chartered Accountant | CA Finals Specialist', type: 'text' },
    { key: 'instructor.bio', value: 'CA Nikesh Shah has 10+ years of experience teaching CA Finals at Symbiosis College, Pune. His logic-first approach achieves an 89% pass rate.', type: 'text' },
    { key: 'cta.headline', value: 'Ready to Clear CA Finals?', type: 'text' },
    { key: 'cta.button_text', value: 'Get Started Today', type: 'text' },
  ]
  for (const item of contentItems) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    })
  }
  console.log(`  ✓ ${contentItems.length} site content items seeded`)

  // ── Summary ──────────────────────────────────────────────────────────────────

  console.log('\n' + '─'.repeat(60))
  console.log('✅ Test seed complete!\n')
  console.log('Test Accounts:')
  console.log(`  Admin  : admin@nsacademy.dev    / AdminPass@1234`)
  console.log(`  Student: testplayer@nsacademy.dev / TestPass@1234`)
  console.log('\nData:')
  console.log(`  Courses      : 2 (1 published, 1 draft)`)
  console.log(`  Sections     : ${sections.length}`)
  console.log(`  Lessons      : ${allLessonIds.length}`)
  console.log(`  Enrollments  : ${extraStudents.length + 1}`)
  console.log(`  Payments     : 2 (1 captured, 1 failed)`)
  console.log(`  FAQs         : 4`)
  console.log(`  Testimonials : 3`)
  console.log(`  Site Content : ${contentItems.length} items`)
  console.log('─'.repeat(60))
}

main()
  .catch((e) => {
    console.error('❌ Test seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
