import '@testing-library/jest-dom'

// ── Environment variables required by the app ────────────────────────────────
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id'
process.env.NEXT_PUBLIC_SANITY_DATASET = 'production'
process.env.NEXT_PUBLIC_SANITY_API_VERSION = '2024-01-01'
process.env.SANITY_REVALIDATE_SECRET = 'test-revalidate-secret'
process.env.RESEND_API_KEY = 're_test_xxxxxxxxxxxxxxxxxxxx'
