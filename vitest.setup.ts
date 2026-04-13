import '@testing-library/jest-dom'

// ── Environment variables required by the app ────────────────────────────────
// These are set here so every test file gets them without .env.test files
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.RAZORPAY_KEY_ID = 'rzp_test_testkey123'
process.env.RAZORPAY_KEY_SECRET = 'test_razorpay_secret_key_123456'
process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'rzp_test_testkey123'
