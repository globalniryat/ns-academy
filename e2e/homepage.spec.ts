import { test, expect } from '@playwright/test'

/**
 * Homepage smoke tests.
 * These run against the live page and verify the critical sections render correctly.
 */
test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/NS Academy/)
  })

  test('hero section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('Enroll Now button links to checkout', async ({ page }) => {
    const enrollBtn = page.getByRole('link', { name: /enroll now/i }).first()
    await expect(enrollBtn).toBeVisible()
    await expect(enrollBtn).toHaveAttribute('href', /checkout/)
  })

  test('navigation links are present', async ({ page }) => {
    await expect(page.getByRole('link', { name: /courses/i }).first()).toBeVisible()
  })

  test('testimonials section renders', async ({ page }) => {
    await page.locator('section').filter({ hasText: /testimonial|student|review/i }).first().scrollIntoViewIfNeeded()
    // Testimonials section should exist on page
    await expect(page.locator('section').filter({ hasText: /testimonial|student|review/i }).first()).toBeVisible()
  })

  test('FAQ section renders', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const faqSection = page.locator('section').filter({ hasText: /frequently asked|faq/i })
    await expect(faqSection.first()).toBeVisible()
  })

  test('footer is present with company name', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator('footer')).toContainText(/CA Portal/)
  })

  test('meta description is set for SEO', async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]')
    await expect(metaDesc).toHaveAttribute('content', /.+/)
  })
})
