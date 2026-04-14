import { test, expect } from '@playwright/test'

/**
 * Authentication flow E2E tests.
 *
 * NOTE: These tests use real Supabase Auth in test/dev mode.
 * Set TEST_STUDENT_EMAIL and TEST_STUDENT_PASSWORD in your environment
 * to point at a real test account. Never use production credentials.
 */

const STUDENT_EMAIL = process.env.TEST_STUDENT_EMAIL ?? 'testplayer@nsacademy.dev'
const STUDENT_PASSWORD = process.env.TEST_STUDENT_PASSWORD ?? 'TestPass@1234'

test.describe('Authentication', () => {
  // ── Login ──────────────────────────────────────────────────────────────────

  test.describe('Login page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login')
    })

    test('renders login form', async ({ page }) => {
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/password/i)).toBeVisible()
      await expect(page.getByRole('button', { name: /log in|sign in/i })).toBeVisible()
    })

    test('shows validation error for empty submit', async ({ page }) => {
      await page.getByRole('button', { name: /log in|sign in/i }).click()
      // Browser or custom validation should prevent submit
      await expect(page.getByLabel(/email/i)).toBeFocused()
    })

    test('shows error for invalid email format', async ({ page }) => {
      await page.getByLabel(/email/i).fill('notanemail')
      await page.getByLabel(/password/i).fill('password123')
      await page.getByRole('button', { name: /log in|sign in/i }).click()
      // Should show error or keep on login page
      await expect(page).toHaveURL(/login/)
    })

    test('shows error for wrong credentials', async ({ page }) => {
      await page.getByLabel(/email/i).fill('wrong@example.com')
      await page.getByLabel(/password/i).fill('wrongpassword')
      await page.getByRole('button', { name: /log in|sign in/i }).click()
      // Wait for error message
      await expect(page.getByText(/invalid|incorrect|error/i)).toBeVisible({ timeout: 10_000 })
    })

    test('link to register page exists', async ({ page }) => {
      await expect(page.getByRole('link', { name: /register|sign up|create account/i })).toBeVisible()
    })
  })

  // ── Protected routes ───────────────────────────────────────────────────────

  test.describe('Route protection', () => {
    test('redirects unauthenticated user from /dashboard to login', async ({ page }) => {
      await page.goto('/dashboard')
      await expect(page).toHaveURL(/login/)
    })

    test('preserves redirect parameter on login redirect', async ({ page }) => {
      await page.goto('/dashboard')
      await expect(page).toHaveURL(/redirect.*dashboard/)
    })

    test('redirects unauthenticated user from /checkout to login', async ({ page }) => {
      await page.goto('/checkout/course_sfm_001')
      await expect(page).toHaveURL(/login/)
    })
  })

  // ── Login → Dashboard flow (requires real test account) ───────────────────

  test.describe('Full login flow', () => {
    test('logs in and reaches dashboard', async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel(/email/i).fill(STUDENT_EMAIL)
      await page.getByLabel(/password/i).fill(STUDENT_PASSWORD)
      await page.getByRole('button', { name: /log in|sign in/i }).click()

      // Should redirect to dashboard
      await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 })
      // Dashboard should show the user's name or welcome message
      await expect(page.getByText(/welcome back/i)).toBeVisible()
    })

    test('logout redirects to homepage', async ({ page }) => {
      // Login first
      await page.goto('/login')
      await page.getByLabel(/email/i).fill(STUDENT_EMAIL)
      await page.getByLabel(/password/i).fill(STUDENT_PASSWORD)
      await page.getByRole('button', { name: /log in|sign in/i }).click()
      await page.waitForURL(/dashboard/)

      // Logout — button label is "Sign Out"
      await page.getByRole('button', { name: /sign out|log out|logout/i }).click()
      await expect(page).toHaveURL('/', { timeout: 10_000 })
    })

    test('after logout, /dashboard redirects to login', async ({ page }) => {
      // Login
      await page.goto('/login')
      await page.getByLabel(/email/i).fill(STUDENT_EMAIL)
      await page.getByLabel(/password/i).fill(STUDENT_PASSWORD)
      await page.getByRole('button', { name: /log in|sign in/i }).click()
      await page.waitForURL(/dashboard/)

      // Logout — button label is "Sign Out"
      await page.getByRole('button', { name: /sign out|log out|logout/i }).click()
      await page.waitForURL('/')

      // Now try to access dashboard
      await page.goto('/dashboard')
      await expect(page).toHaveURL(/login/)
    })
  })

  // ── Registration ───────────────────────────────────────────────────────────

  test.describe('Registration page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/register')
    })

    test('renders all required fields', async ({ page }) => {
      await expect(page.getByLabel(/name/i)).toBeVisible()
      await expect(page.getByLabel(/email/i)).toBeVisible()
      await expect(page.getByLabel(/password/i).first()).toBeVisible()
    })

    test('submit button shows Create Account label', async ({ page }) => {
      // Registration form has a single password field (no confirm password)
      await expect(page.getByRole('button', { name: /create account|register|sign up/i })).toBeVisible()
    })
  })
})
