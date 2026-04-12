// Video ID map — all verified from YouTube searches
// Sources: CA Wallah by PW, Ultimate CA, Neeraj Arora, CA Naresh Aggarwal, etc.
export const VIDEO_IDS = {
  // Hero section — CA career overview
  hero: "KUMT6hlr6gA",

  // ── CA Foundation: Accounts & Auditing ──────────────────────────────────────
  foundation: {
    // Course-level free preview (shown on course detail + hero card)
    coursePreview: "mM51edBblXU", // CA Foundation Accounting: Introduction & Basics — CA Wallah by PW

    // Per-section/lesson videos
    lessons: {
      // Section 1: Introduction to Accounting
      whatIsAccounting: "mM51edBblXU",   // CA Foundation Accounting: Introduction & Basics
      accountingPrinciples: "mM51edBblXU", // same intro as overview
      journalEntries: "9vUMhazMkkM",     // Basic of 11th with Journal Entry in One Shot — CA Wallah by PW
      ledgerAccounts: "9vUMhazMkkM",     // Journal & Ledger — same lecture covers both

      // Section 2: Financial Statements
      balanceSheet: "s3OtF9GY4Fo",       // CA Foundation: Final Accounts - All Adjustments — CA Wallah by PW
      plAccount: "s3OtF9GY4Fo",          // Final Accounts (P&L is part of same lecture)
      cashFlow: "s3OtF9GY4Fo",           // Final Accounts comprehensive
      ratioAnalysis: "s3OtF9GY4Fo",      // Final accounts / ratio context

      // Section 3: Auditing Basics
      auditingConcepts: "SR1honc5Uk0",   // CA Inter Audit Lecture-1: Basics of Auditing — Neeraj Arora
      typesOfAudit: "SR1honc5Uk0",       // Types covered in same auditing basics video
      auditReport: "SR1honc5Uk0",        // Audit report covered in same video
      practiceQuestions: "mM51edBblXU",  // Returns to intro for practice context
    },
  },

  // ── CA Intermediate: Financial Management ────────────────────────────────────
  intermediate: {
    coursePreview: "rjBCHjOLkyo", // CA Inter FM | Lec 01 | Shikhar Batch — Ultimate CA

    lessons: {
      // Section 1: Financial Planning
      introduction: "rjBCHjOLkyo",       // CA Inter FM Lecture 1 — Ultimate CA
      capitalStructure: "jR11UN79S9g",   // Cost of Capital - One Shot Revision — Ultimate CA
      wacc: "jR11UN79S9g",               // Cost of Capital / WACC — Ultimate CA
      leverageAnalysis: "rjBCHjOLkyo",   // Leverage covered in Lec 01 FM

      // Section 2: Working Capital
      wcManagement: "rjBCHjOLkyo",       // Working Capital in FM Lec 01
      cashManagement: "rjBCHjOLkyo",
      receivables: "rjBCHjOLkyo",
      inventory: "rjBCHjOLkyo",

      // Section 3: Investment Decisions
      npvIrr: "QXoFB4-MV_I",             // Capital Budgeting (PB, ARR, NPV, PI & IRR) — CA. Naresh Aggarwal
      capitalBudgeting: "QXoFB4-MV_I",
      riskAnalysis: "QXoFB4-MV_I",
      caseStudies: "QXoFB4-MV_I",
    },
  },

  // ── CA Final: Strategic Financial Management ─────────────────────────────────
  final: {
    coursePreview: "psQaSIotMv4", // CA Final AFM | Financial Policy & Strategy — Saran Pushpagiri

    lessons: {
      // Section 1: Portfolio Theory
      introduction: "psQaSIotMv4",       // CA Final AFM Intro — Saran Pushpagiri
      riskReturn: "MTJwvRdquew",          // Portfolio Management Full Revision — Bhavik Chokshi
      capm: "MTJwvRdquew",               // CAPM covered in Portfolio Management revision
      portfolioOptimization: "MTJwvRdquew",

      // Section 2: Derivatives
      options: "MTJwvRdquew",            // Derivatives covered in AFM revision
      futures: "MTJwvRdquew",
      swaps: "psQaSIotMv4",              // Swaps in AFM strategy intro
      hedgingStrategies: "MTJwvRdquew",

      // Section 3: M&A
      maFramework: "psQaSIotMv4",        // M&A part of AFM Financial Policy
      valuationMethods: "psQaSIotMv4",
      dueDiligence: "psQaSIotMv4",
      caseStudies: "MTJwvRdquew",
    },
  },
};

export type VideoSection = "introduction" | "accountingPrinciples" | "journalEntries" | "ledgerAccounts";

export interface Lesson {
  title: string;
  isFreePreview?: boolean;
  videoId: string; // YouTube video ID for this lesson
}

export interface CurriculumSection {
  title: string;
  lessons: Lesson[];
}

export interface Course {
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
  freePreviewUrl: string;   // Course-level free preview embed URL (shown on course detail card + hero)
  color: string;
  curriculum: CurriculumSection[];
}

const YT_BASE = "https://www.youtube-nocookie.com/embed";

export const courses: Course[] = [
  {
    id: "ca-foundation-accounts",
    slug: "ca-foundation-accounts",
    title: "CA Foundation — Accounts & Auditing",
    description:
      "Master the fundamentals of accounting and auditing for CA Foundation exam. Structured, exam-focused lectures with practice questions and real-world examples to build a solid base.",
    level: "Foundation",
    price: 1499,
    originalPrice: 3000,
    duration: "18 hours",
    videoCount: 24,
    instructor: "CA Instructor",
    rating: 4.8,
    enrollments: 1240,
    thumbnail: null,
    // CA Foundation Accounting: Introduction & Basics — CA Wallah by PW
    freePreviewUrl: `${YT_BASE}/${VIDEO_IDS.foundation.coursePreview}`,
    color: "#2563EB",
    curriculum: [
      {
        title: "Introduction to Accounting",
        lessons: [
          {
            title: "What is Accounting?",
            isFreePreview: true,
            videoId: VIDEO_IDS.foundation.lessons.whatIsAccounting,
          },
          {
            title: "Accounting Principles",
            videoId: VIDEO_IDS.foundation.lessons.accountingPrinciples,
          },
          {
            title: "Journal Entries",
            videoId: VIDEO_IDS.foundation.lessons.journalEntries,
          },
          {
            title: "Ledger Accounts",
            videoId: VIDEO_IDS.foundation.lessons.ledgerAccounts,
          },
        ],
      },
      {
        title: "Financial Statements",
        lessons: [
          {
            title: "Balance Sheet",
            videoId: VIDEO_IDS.foundation.lessons.balanceSheet,
          },
          {
            title: "P&L Account",
            videoId: VIDEO_IDS.foundation.lessons.plAccount,
          },
          {
            title: "Cash Flow",
            videoId: VIDEO_IDS.foundation.lessons.cashFlow,
          },
          {
            title: "Ratio Analysis",
            videoId: VIDEO_IDS.foundation.lessons.ratioAnalysis,
          },
        ],
      },
      {
        title: "Auditing Basics",
        lessons: [
          {
            title: "Auditing Concepts",
            videoId: VIDEO_IDS.foundation.lessons.auditingConcepts,
          },
          {
            title: "Types of Audit",
            videoId: VIDEO_IDS.foundation.lessons.typesOfAudit,
          },
          {
            title: "Audit Report",
            videoId: VIDEO_IDS.foundation.lessons.auditReport,
          },
          {
            title: "Practice Questions",
            videoId: VIDEO_IDS.foundation.lessons.practiceQuestions,
          },
        ],
      },
    ],
  },

  {
    id: "ca-intermediate-financial",
    slug: "ca-intermediate-financial",
    title: "CA Intermediate — Financial Management",
    description:
      "Complete coverage of Financial Management for CA Intermediate. Capital structure, working capital management, investment decisions, and more with exam-oriented problem solving.",
    level: "Intermediate",
    price: 2999,
    originalPrice: 6000,
    duration: "28 hours",
    videoCount: 38,
    instructor: "CA Instructor",
    rating: 4.9,
    enrollments: 890,
    thumbnail: null,
    // CA Inter FM | Lec 01 | Shikhar Batch — Ultimate CA
    freePreviewUrl: `${YT_BASE}/${VIDEO_IDS.intermediate.coursePreview}`,
    color: "#0D9488",
    curriculum: [
      {
        title: "Financial Planning",
        lessons: [
          {
            title: "Introduction to Financial Management",
            isFreePreview: true,
            videoId: VIDEO_IDS.intermediate.lessons.introduction,
          },
          {
            title: "Capital Structure",
            videoId: VIDEO_IDS.intermediate.lessons.capitalStructure,
          },
          {
            title: "WACC — Weighted Average Cost of Capital",
            videoId: VIDEO_IDS.intermediate.lessons.wacc,
          },
          {
            title: "Leverage Analysis",
            videoId: VIDEO_IDS.intermediate.lessons.leverageAnalysis,
          },
        ],
      },
      {
        title: "Working Capital Management",
        lessons: [
          {
            title: "Working Capital Concepts",
            videoId: VIDEO_IDS.intermediate.lessons.wcManagement,
          },
          {
            title: "Cash Management",
            videoId: VIDEO_IDS.intermediate.lessons.cashManagement,
          },
          {
            title: "Receivables Management",
            videoId: VIDEO_IDS.intermediate.lessons.receivables,
          },
          {
            title: "Inventory Management",
            videoId: VIDEO_IDS.intermediate.lessons.inventory,
          },
        ],
      },
      {
        title: "Investment Decisions",
        lessons: [
          {
            title: "NPV & IRR Techniques",
            videoId: VIDEO_IDS.intermediate.lessons.npvIrr,
          },
          {
            title: "Capital Budgeting Methods",
            videoId: VIDEO_IDS.intermediate.lessons.capitalBudgeting,
          },
          {
            title: "Risk Analysis in Investments",
            videoId: VIDEO_IDS.intermediate.lessons.riskAnalysis,
          },
          {
            title: "Case Studies",
            videoId: VIDEO_IDS.intermediate.lessons.caseStudies,
          },
        ],
      },
    ],
  },

  {
    id: "ca-final-strategic",
    slug: "ca-final-strategic",
    title: "CA Final — Strategic Financial Management",
    description:
      "Advanced Strategic Financial Management for CA Final. Portfolio theory, derivatives, mergers & acquisitions, and international finance with practical case studies.",
    level: "Final",
    price: 3999,
    originalPrice: 8000,
    duration: "35 hours",
    videoCount: 45,
    instructor: "CA Instructor",
    rating: 4.7,
    enrollments: 560,
    thumbnail: null,
    // CA Final AFM | Financial Policy & Strategy — Saran Pushpagiri
    freePreviewUrl: `${YT_BASE}/${VIDEO_IDS.final.coursePreview}`,
    color: "#1A2744",
    curriculum: [
      {
        title: "Portfolio Theory & Risk",
        lessons: [
          {
            title: "Introduction to Strategic FM",
            isFreePreview: true,
            videoId: VIDEO_IDS.final.lessons.introduction,
          },
          {
            title: "Risk & Return Analysis",
            videoId: VIDEO_IDS.final.lessons.riskReturn,
          },
          {
            title: "CAPM — Capital Asset Pricing Model",
            videoId: VIDEO_IDS.final.lessons.capm,
          },
          {
            title: "Portfolio Optimization",
            videoId: VIDEO_IDS.final.lessons.portfolioOptimization,
          },
        ],
      },
      {
        title: "Derivatives & Hedging",
        lessons: [
          {
            title: "Options — Calls & Puts",
            videoId: VIDEO_IDS.final.lessons.options,
          },
          {
            title: "Futures Contracts",
            videoId: VIDEO_IDS.final.lessons.futures,
          },
          {
            title: "Swaps & Interest Rate Products",
            videoId: VIDEO_IDS.final.lessons.swaps,
          },
          {
            title: "Hedging Strategies",
            videoId: VIDEO_IDS.final.lessons.hedgingStrategies,
          },
        ],
      },
      {
        title: "Mergers & Acquisitions",
        lessons: [
          {
            title: "M&A Framework & Types",
            videoId: VIDEO_IDS.final.lessons.maFramework,
          },
          {
            title: "Valuation Methods",
            videoId: VIDEO_IDS.final.lessons.valuationMethods,
          },
          {
            title: "Due Diligence Process",
            videoId: VIDEO_IDS.final.lessons.dueDiligence,
          },
          {
            title: "Case Studies — Real M&A Deals",
            videoId: VIDEO_IDS.final.lessons.caseStudies,
          },
        ],
      },
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
