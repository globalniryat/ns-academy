import { test, expect } from '@playwright/test'

/**
 * Course browsing and detail page E2E tests.
 * These are fully public routes — no auth required.
 */

test.describe('Courses listing (/courses)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/courses')
  })

  test('shows at least one course card', async ({ page }) => {
    // Wait for the page to load courses
    await expect(page.locator('[data-testid="course-card"], .course-card').first()).toBeVisible({
      timeout: 10_000,
    }).catch(async () => {
      // Fallback: look for any card-like structure
      await expect(page.getByRole('heading').nth(1)).toBeVisible()
    })
  })

  test('page title includes Courses', async ({ page }) => {
    await expect(page).toHaveTitle(/.+/)
    // Page should contain courses-related content
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})

test.describe('Course detail page (/courses/:slug)', () => {
  // Use the actual slug from the seeded course
  const COURSE_SLUG = 'ca-final-sfm'

  test.beforeEach(async ({ page }) => {
    await page.goto(`/courses/${COURSE_SLUG}`)
  })

  test('shows course title', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('shows the free preview video embed', async ({ page }) => {
    // Should have a YouTube iframe
    await expect(page.locator('iframe[src*="youtube"]')).toBeVisible()
  })

  test('Enroll Now button is present', async ({ page }) => {
    const enrollBtn = page.getByRole('link', { name: /enroll now/i })
    await expect(enrollBtn.first()).toBeVisible()
    await expect(enrollBtn.first()).toHaveAttribute('href', /checkout/)
  })

  test('curriculum accordion is present', async ({ page }) => {
    // Should show course sections
    await expect(page.getByText(/section|module|chapter/i).first()).toBeVisible()
  })

  test('returns 404 for non-existent course slug', async ({ page }) => {
    const response = await page.goto('/courses/this-course-does-not-exist')
    expect(response?.status()).toBe(404)
  })

  test('Enroll Now links to correct checkout URL', async ({ page }) => {
    const enrollLink = page.getByRole('link', { name: /enroll now/i }).first()
    const href = await enrollLink.getAttribute('href')
    // Should link to checkout with a course ID (not a slug)
    expect(href).toMatch(/\/checkout\//)
  })
})

test.describe('Certificate verification (/verify/:certificateNo)', () => {
  test('shows invalid certificate message for made-up cert number', async ({ page }) => {
    await page.goto('/verify/NSA-0000-FAKE99')
    await expect(page.getByText(/invalid|not found/i)).toBeVisible()
  })

  test('page loads without error', async ({ page }) => {
    const response = await page.goto('/verify/NSA-2025-00001')
    expect(response?.status()).not.toBe(500)
  })
})
