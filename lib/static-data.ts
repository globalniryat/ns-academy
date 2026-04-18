import type { CourseCardData } from '@/components/courses/CourseCard'
import type { TestimonialData } from '@/components/home/Testimonials'
import type { FAQItem } from '@/components/home/FAQSection'

// ─── Course ───────────────────────────────────────────────────────────────────

export const STATIC_COURSE = {
  id: 'course_sfm_001',
  slug: 'ca-final-sfm',
  title: 'CA Final — Strategic Financial Management',
  shortDescription: 'Master SFM with simplified logic. Pass CA Finals confidently.',
  description: `Strategic Financial Management (SFM) is one of the most feared subjects in CA Finals — but it doesn't have to be. CA Nikesh Shah breaks down every concept using real-world logic, not rote memorization.

This course covers the complete SFM syllabus as per ICAI curriculum, with step-by-step video explanations, worked examples, and formula sheets. Even students with zero prior knowledge of finance can follow along and pass.

**What makes this different:** CA Nikesh Shah's signature approach — understand the logic first, and the formula follows naturally. You'll never forget a concept again.`,
  level: 'FINAL' as const,
  status: 'PUBLISHED' as const,
  price: 399900,
  originalPrice: 800000,
  duration: '35 hours',
  color: '#166534',
  instructor: 'CA Nikesh Shah',
  rating: 4.9,
  totalRatings: 312,
  thumbnailUrl: null as string | null,
  freePreviewUrl: 'https://youtu.be/psQaSIotMv4',
  metaTitle: 'CA Final SFM Course | CA Nikesh Shah — NS Academy',
  metaDescription: 'Pass CA Finals Strategic Financial Management with simplified logic. 35 hours, 5 modules, 100% money-back guarantee. Taught by CA Nikesh Shah.',
  whatYoullLearn: [
    'Master Financial Policy & Corporate Strategy with clarity',
    'Understand derivatives, futures, options & risk management from scratch',
    'Value securities using DCF, relative valuation, and bond pricing',
    'Build & optimise investment portfolios using Markowitz & CAPM',
    'Handle forex transactions, hedging, and international finance confidently',
    'Solve any SFM problem in exams using structured logical frameworks',
  ],
  sections: [
    {
      id: 's1',
      title: 'Financial Policy & Corporate Strategy',
      sortOrder: 0,
      lessons: [
        { id: 'l1',  title: 'Introduction to Financial Policy',           duration: '14:32', isFreePreview: true,  sortOrder: 0, videoUrl: 'psQaSIotMv4', description: null },
        { id: 'l2',  title: 'Corporate Strategy & Financial Objectives',  duration: '18:45', isFreePreview: false, sortOrder: 1, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l3',  title: 'Capital Structure Decisions',                duration: '22:10', isFreePreview: false, sortOrder: 2, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l4',  title: 'Dividend Policy — Theories & Models',        duration: '20:55', isFreePreview: false, sortOrder: 3, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l5',  title: 'Working Capital Management',                 duration: '16:30', isFreePreview: false, sortOrder: 4, videoUrl: 'dQw4w9WgXcQ', description: null },
      ],
    },
    {
      id: 's2',
      title: 'Risk Management & Derivatives',
      sortOrder: 1,
      lessons: [
        { id: 'l6',  title: 'Types of Financial Risk',                     duration: '12:20', isFreePreview: false, sortOrder: 0, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l7',  title: 'Futures Contracts — Mechanics & Pricing',     duration: '24:15', isFreePreview: false, sortOrder: 1, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l8',  title: 'Options — Calls, Puts & Strategies',          duration: '28:40', isFreePreview: false, sortOrder: 2, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l9',  title: 'Swaps & Interest Rate Derivatives',           duration: '19:05', isFreePreview: false, sortOrder: 3, videoUrl: 'dQw4w9WgXcQ', description: null },
      ],
    },
    {
      id: 's3',
      title: 'Security Analysis & Valuation',
      sortOrder: 2,
      lessons: [
        { id: 'l10', title: 'Fundamental Analysis Framework',             duration: '15:50', isFreePreview: false, sortOrder: 0, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l11', title: 'DCF Valuation — Step by Step',               duration: '26:35', isFreePreview: false, sortOrder: 1, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l12', title: 'Bond Valuation & Duration',                  duration: '21:10', isFreePreview: false, sortOrder: 2, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l13', title: 'Equity Valuation Models',                    duration: '23:45', isFreePreview: false, sortOrder: 3, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l14', title: 'Relative Valuation — P/E, EV/EBITDA',        duration: '17:20', isFreePreview: false, sortOrder: 4, videoUrl: 'dQw4w9WgXcQ', description: null },
      ],
    },
    {
      id: 's4',
      title: 'Portfolio Management',
      sortOrder: 3,
      lessons: [
        { id: 'l15', title: 'Portfolio Theory — Markowitz Model',          duration: '25:00', isFreePreview: false, sortOrder: 0, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l16', title: 'Capital Asset Pricing Model (CAPM)',          duration: '22:30', isFreePreview: false, sortOrder: 1, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l17', title: 'Portfolio Performance Evaluation',            duration: '18:15', isFreePreview: false, sortOrder: 2, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l18', title: 'Mutual Funds & Index Funds',                  duration: '14:50', isFreePreview: false, sortOrder: 3, videoUrl: 'dQw4w9WgXcQ', description: null },
      ],
    },
    {
      id: 's5',
      title: 'Foreign Exchange & International Finance',
      sortOrder: 4,
      lessons: [
        { id: 'l19', title: 'Forex Market — Basics & Quotations',         duration: '16:40', isFreePreview: false, sortOrder: 0, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l20', title: 'Exchange Rate Theories',                     duration: '20:25', isFreePreview: false, sortOrder: 1, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l21', title: 'Forex Hedging — Forward, Futures, Options',  duration: '24:55', isFreePreview: false, sortOrder: 2, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l22', title: 'International Capital Budgeting',            duration: '21:15', isFreePreview: false, sortOrder: 3, videoUrl: 'dQw4w9WgXcQ', description: null },
        { id: 'l23', title: 'ADR, GDR & Foreign Investment',              duration: '13:30', isFreePreview: false, sortOrder: 4, videoUrl: 'dQw4w9WgXcQ', description: null },
      ],
    },
  ],
  courseNotes: [
    { id: 'n1', title: 'SFM Complete Formula Sheet', fileUrl: '/placeholder-formula-sheet.pdf' },
    { id: 'n2', title: 'Chapter Summary Notes',       fileUrl: '/placeholder-summary-notes.pdf' },
  ],
  _count: { enrollments: 560 },
} as const

// Subset used by CourseCard
export const STATIC_COURSE_CARD: CourseCardData = {
  id: STATIC_COURSE.id,
  slug: STATIC_COURSE.slug,
  title: STATIC_COURSE.title,
  shortDescription: STATIC_COURSE.shortDescription,
  level: STATIC_COURSE.level,
  price: STATIC_COURSE.price,
  originalPrice: STATIC_COURSE.originalPrice,
  duration: STATIC_COURSE.duration,
  thumbnailUrl: STATIC_COURSE.thumbnailUrl,
  freePreviewUrl: STATIC_COURSE.freePreviewUrl,
  color: STATIC_COURSE.color,
  instructor: STATIC_COURSE.instructor,
  rating: STATIC_COURSE.rating,
  totalRatings: STATIC_COURSE.totalRatings,
  _count: { sections: STATIC_COURSE.sections.length, enrollments: STATIC_COURSE._count.enrollments },
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const STATIC_TESTIMONIALS: TestimonialData[] = [
  {
    id: 't1',
    name: 'Sneha Kulkarni',
    college: 'Symbiosis College, Pune',
    role: 'CA Final Student',
    quote: "I had failed SFM twice before joining NS Academy. CA Nikesh Sir's logic-based approach completely changed how I look at the subject. Instead of memorizing formulas, I now understand WHY each formula works. Cleared in my very next attempt!",
    rating: 5,
    avatarUrl: null,
  },
  {
    id: 't2',
    name: 'Rohan Deshmukh',
    college: 'Symbiosis College, Pune',
    role: 'CA Final — AIR 23',
    quote: 'The derivative and options chapters used to be my weakest areas. After watching just 3 lectures, I could solve any question from the ICAI study material. The way Sir connects real stock market examples to exam questions is brilliant.',
    rating: 5,
    avatarUrl: null,
  },
  {
    id: 't3',
    name: 'Priya Joshi',
    college: 'B.M.C.C., Pune',
    role: 'CA Final Student',
    quote: "I enrolled 2 months before my exams with zero SFM preparation. The structured curriculum and formula sheets helped me cover the entire syllabus systematically. Scored 68 marks in SFM — my highest ever. The 100% money-back guarantee gave me the confidence to enroll.",
    rating: 5,
    avatarUrl: null,
  },
  {
    id: 't4',
    name: 'Amit Patil',
    college: 'Fergusson College, Pune',
    role: 'CA Final Student',
    quote: 'What separates this course from other coaching is that Sir never asks you to "just remember this." Every single concept has a logical derivation. Portfolio management and CAPM finally made sense to me after years of confusion.',
    rating: 5,
    avatarUrl: null,
  },
  {
    id: 't5',
    name: 'Neha Sharma',
    college: 'H.R. College, Mumbai',
    role: 'CA Final Student',
    quote: "The forex and international finance module alone is worth the entire course fee. I used to dread those 20-mark questions. Now I actually look forward to them in the exam. CA Nikesh Sir's teaching style is engaging and his examples stick with you.",
    rating: 5,
    avatarUrl: null,
  },
  {
    id: 't6',
    name: 'Vikram Iyer',
    college: 'Loyola College, Chennai',
    role: 'CA Final Student',
    quote: "Solid course with excellent content. The course notes PDF is a goldmine — I used it as my last-minute revision guide. The video quality and explanation depth are top-notch. Highly recommend for anyone struggling with SFM.",
    rating: 4,
    avatarUrl: null,
  },
]

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export const STATIC_FAQS: FAQItem[] = [
  {
    id: 'f1',
    question: "What if I haven't studied this subject at all?",
    answer: "That's perfectly fine — and honestly, it can be an advantage. CA Nikesh Shah's course is designed from the ground up assuming zero prior knowledge. We start with the 'why' before the 'how', so you build a genuine understanding rather than patchy knowledge from half-remembered coaching.",
  },
  {
    id: 'f2',
    question: 'How does the money-back guarantee work?',
    answer: "Simple: if you're not satisfied within 30 days of purchase, email us at contact@nsacademy.in and we'll refund 100% of your payment, no questions asked. We're confident in the quality of the course, but we don't want you to take any risk.",
  },
  {
    id: 'f3',
    question: 'Is this course enough to pass CA Finals?',
    answer: "Yes — this course covers the complete SFM syllabus as per ICAI curriculum. Combined with the formula sheets, chapter notes, and practice problems, students who complete the course have an 89% pass rate. Of course, you'll also need to practice ICAI study material and past papers alongside any coaching.",
  },
  {
    id: 'f4',
    question: 'How long do I have access to the course?',
    answer: 'You get lifetime access. Once you enroll, the course is yours forever — including any future updates or additional content CA Nikesh Shah adds to the curriculum. Study at your own pace, pause, rewind, and revise as many times as you need.',
  },
  {
    id: 'f5',
    question: 'Can I watch on mobile?',
    answer: "Yes, fully. The platform is responsive and works on any device — phone, tablet, laptop, or desktop. All videos are hosted on YouTube (privacy mode) so they stream reliably even on slower connections. You can also download the PDF notes to study offline.",
  },
  {
    id: 'f6',
    question: 'How is this different from other SFM coaching?',
    answer: "Most SFM coaching focuses on pattern recognition and formula drilling. CA Nikesh Shah's approach is fundamentally different — he teaches the underlying logic of every concept first. When you understand why a formula exists, you can derive it in the exam room even if you forget it. This is why repeat candidates who've tried other coaching consistently find our approach transformative.",
  },
]
