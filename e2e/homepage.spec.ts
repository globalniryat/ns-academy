import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ── SEO & metadata ──────────────────────────────────────────────────────────
  test('page title includes NS Academy', async ({ page }) => {
    await expect(page).toHaveTitle(/NS Academy/)
  })

  test('meta description is set', async ({ page }) => {
    const metaDesc = page.locator('meta[name="description"]')
    await expect(metaDesc).toHaveAttribute('content', /.{20,}/)
  })

  // ── Hero section ────────────────────────────────────────────────────────────
  test('hero heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('hero YouTube CTA button is present', async ({ page }) => {
    await expect(page.locator('#hero-youtube')).toBeVisible()
  })

  test('hero contains YouTube embed', async ({ page }) => {
     
    const _iframe = page.frameLocator('iframe').first()
    // The iframe exists and loads (Playwright can locate frame elements)
    await expect(page.locator('iframe').first()).toBeVisible()
  })

  // ── Critical: no commerce content ──────────────────────────────────────────
  test('no Enroll Now buttons anywhere', async ({ page }) => {
    await expect(page.getByRole('button', { name: /enroll now/i })).toHaveCount(0)
  })

  test('no pricing text (₹) anywhere', async ({ page }) => {
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).not.toContain('₹')
  })

  test('no "money-back guarantee" text', async ({ page }) => {
    const bodyText = await page.locator('body').textContent()
    expect(bodyText?.toLowerCase()).not.toContain('money-back guarantee')
  })

  // ── Navigation ──────────────────────────────────────────────────────────────
  test('contact link is in navigation', async ({ page }) => {
    await expect(page.getByRole('link', { name: /contact/i }).first()).toBeVisible()
  })

  test('no Courses link in navigation', async ({ page }) => {
    const nav = page.locator('nav').first()
    await expect(nav.getByRole('link', { name: /^courses$/i })).toHaveCount(0)
  })

  // ── YouTube section ─────────────────────────────────────────────────────────
  test('YouTube section is present with correct id', async ({ page }) => {
    const section = page.locator('#youtube')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toBeVisible()
  })

  // ── Testimonials ────────────────────────────────────────────────────────────
  test('testimonials section is visible', async ({ page }) => {
    const section = page
      .locator('section')
      .filter({ hasText: /testimonial|student stories|results/i })
      .first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toBeVisible()
  })

  // ── FAQ section ─────────────────────────────────────────────────────────────
  test('FAQ section is visible and has accordion items', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const faqSection = page
      .locator('section')
      .filter({ hasText: /frequently asked|faq/i })
      .first()
    await expect(faqSection).toBeVisible()
    // At least one FAQ button (accordion trigger) should exist
    const faqButtons = faqSection.getByRole('button')
    await expect(faqButtons.first()).toBeVisible()
  })

  // ── Footer ──────────────────────────────────────────────────────────────────
  test('footer is visible with NS Academy branding', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    await expect(footer).toContainText(/NS Academy/)
  })

  // ── WhatsApp button ─────────────────────────────────────────────────────────
  test('WhatsApp floating button is present', async ({ page }) => {
    const waBtn = page.locator('a[href*="wa.me"]')
    await expect(waBtn.first()).toBeVisible()
  })
})

test.describe('Contact page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact')
  })

  test('contact page loads', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('contact form is present', async ({ page }) => {
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible()
  })

  test('no enrollment or pricing content on contact page', async ({ page }) => {
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).not.toContain('₹')
    expect(bodyText?.toLowerCase()).not.toContain('money-back')
  })
})

test.describe('Studio route', () => {
  test('studio route responds without 404', async ({ page }) => {
    const response = await page.goto('/studio')
    expect(response?.status()).not.toBe(404)
  })
})
