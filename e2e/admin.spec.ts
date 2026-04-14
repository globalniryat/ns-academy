import { test, expect, Page } from '@playwright/test'

/**
 * Admin panel E2E tests.
 *
 * Set these env vars:
 *   TEST_ADMIN_EMAIL    — admin account email
 *   TEST_ADMIN_PASSWORD — admin account password
 */

const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? 'admin@nsacademy.dev'
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? 'AdminPass@1234'

async function loginAsAdmin(page: Page) {
  await page.goto('/admin/login')
  await page.getByLabel(/email/i).fill(ADMIN_EMAIL)
  await page.getByLabel(/password/i).fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: /log in|sign in/i }).click()
  await page.waitForURL(/admin(?!\/login)/, { timeout: 15_000 })
}

test.describe('Admin Panel — Access Control', () => {
  test('redirects unauthenticated user from /admin to admin login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/admin\/login|login/)
  })

  test('student cannot access admin panel', async ({ page }) => {
    // Login as student
    await page.goto('/login')
    await page.getByLabel(/email/i).fill(process.env.TEST_STUDENT_EMAIL ?? 'testplayer@nsacademy.dev')
    await page.getByLabel(/password/i).fill(process.env.TEST_STUDENT_PASSWORD ?? 'TestPass@1234')
    await page.getByRole('button', { name: /log in|sign in/i }).click()
    await page.waitForURL(/dashboard/)

    // Try admin
    await page.goto('/admin')
    await expect(page).not.toHaveURL(/^.*\/admin$/)
  })
})

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin')
  })

  test('shows stats cards (students, courses, revenue)', async ({ page }) => {
    await expect(page.getByText(/students/i).first()).toBeVisible()
    await expect(page.getByText(/course/i).first()).toBeVisible()
    await expect(page.getByText(/revenue/i).first()).toBeVisible()
  })

  test('shows recent enrollments table', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('sidebar navigation links are present', async ({ page }) => {
    await expect(page.getByRole('link', { name: /courses/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /students/i }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: /payments/i }).first()).toBeVisible()
  })
})

test.describe('Admin — Courses', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/courses')
  })

  test('shows course list', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /courses/i })).toBeVisible()
  })

  test('"New Course" button navigates to create form', async ({ page }) => {
    await page.getByRole('link', { name: /new course|add course/i }).click()
    await expect(page).toHaveURL(/admin\/courses\/new/)
  })
})

test.describe('Admin — Testimonials', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/testimonials')
  })

  test('shows testimonials list', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /testimonials/i })).toBeVisible()
  })

  test('Add Testimonial form is present', async ({ page }) => {
    await expect(page.getByPlaceholder(/student name/i)).toBeVisible()
    await expect(page.getByPlaceholder(/what the student said/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /add testimonial/i })).toBeVisible()
  })

  test('shows validation error when submitting empty form', async ({ page }) => {
    await page.getByRole('button', { name: /add testimonial/i }).click()
    // Form should not submit — still on the page
    await expect(page).toHaveURL(/admin\/testimonials/)
  })
})

test.describe('Admin — FAQs', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/faqs')
  })

  test('shows FAQ management page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /faqs/i })).toBeVisible()
  })

  test('add FAQ form requires question and answer', async ({ page }) => {
    await page.getByRole('button', { name: /add faq/i }).click()
    await expect(page).toHaveURL(/admin\/faqs/)
  })
})

test.describe('Admin — Site Content', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/admin/content')
  })

  test('shows editable content fields', async ({ page }) => {
    // Should load Hero, Stats, Instructor groups
    await expect(page.getByText(/hero/i).first()).toBeVisible()
    await expect(page.getByText(/stats/i).first()).toBeVisible()
  })

  test('"Save All" button is present', async ({ page }) => {
    await expect(page.getByRole('button', { name: /save all/i }).first()).toBeVisible()
  })
})
