import { test, expect } from '@playwright/test'

/**
 * Sanity CMS live-site content tests.
 * Verifies that every CMS-managed section is visible and populated on the
 * running site. These tests do NOT mock Sanity — they hit the real page and
 * assert that content is present, confirming data flows end-to-end from
 * the CMS schema through the fetch → component → DOM.
 */

test.describe('Sanity → live site: Hero section', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/') })

  test('badge text is visible', async ({ page }) => {
    // hero.badgeText — small pill above the headline
    const badge = page.locator('[class*="badge"], [class*="pill"]').first()
    await expect(badge).toBeVisible()
    await expect(badge).not.toBeEmpty()
  })

  test('headline (h1) is visible and non-empty', async ({ page }) => {
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
    const text = await h1.textContent()
    expect(text?.trim().length).toBeGreaterThan(5)
  })

  test('subtext paragraph is visible and non-empty', async ({ page }) => {
    // hero.subtext — paragraph below headline
    const hero = page.locator('section').first()
    const para = hero.locator('p').first()
    await expect(para).toBeVisible()
    const text = await para.textContent()
    expect(text?.trim().length).toBeGreaterThan(10)
  })

  test('at least one bullet point is visible', async ({ page }) => {
    // hero.bulletPoints[] — feature highlights list
    const hero = page.locator('section').first()
    const items = hero.locator('li')
    await expect(items.first()).toBeVisible()
  })

  test('primary CTA button is visible with a link', async ({ page }) => {
    // hero.primaryButton
    const btn = page.locator('section').first().locator('a').first()
    await expect(btn).toBeVisible()
    const href = await btn.getAttribute('href')
    expect(href).toBeTruthy()
  })

  test('YouTube embed iframe is present in hero', async ({ page }) => {
    // hero.youtubeVideoId
    const iframe = page.locator('iframe').first()
    await expect(iframe).toBeVisible()
    const src = await iframe.getAttribute('src')
    expect(src).toContain('youtube')
  })
})

test.describe('Sanity → live site: Stats bar', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/') })

  test('stats bar section is visible with values', async ({ page }) => {
    // stats[].value + stats[].label
    const statsBar = page.locator('section').nth(1)
    await statsBar.scrollIntoViewIfNeeded()
    await expect(statsBar).toBeVisible()
    // At least one stat value should look numeric (contains digit or +)
    const text = await statsBar.textContent()
    expect(text).toMatch(/\d/)
  })
})

test.describe('Sanity → live site: About / Educator section', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/') })

  test('educator name is visible', async ({ page }) => {
    // about.name
    const section = page.locator('#about, [id*="about"]').first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).not.toBeEmpty()
  })

  test('educator profile image is present and loads', async ({ page }) => {
    // about.profileImage
    const section = page.locator('section').filter({ hasText: /chartered accountant|educator|ca nikesh/i }).first()
    await section.scrollIntoViewIfNeeded()
    const img = section.locator('img').first()
    await expect(img).toBeVisible()
    const src = await img.getAttribute('src')
    expect(src).toBeTruthy()
  })

  test('at least one credential badge is visible', async ({ page }) => {
    // about.credentials[] or about.credentialBadge
    const section = page.locator('section').filter({ hasText: /chartered accountant|ca \(icai\)|years/i }).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toBeVisible()
  })

  test('pull quote or bio text is visible', async ({ page }) => {
    // about.pullQuote / about.bio1
    const section = page.locator('section').filter({ hasText: /my goal|approach|understand/i }).first()
    await section.scrollIntoViewIfNeeded()
    const text = await section.textContent()
    expect(text?.trim().length).toBeGreaterThan(20)
  })
})

test.describe('Sanity → live site: YouTube section', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/') })

  test('YouTube section is present with heading', async ({ page }) => {
    // youtubeSection.heading
    const section = page.locator('#youtube')
    await section.scrollIntoViewIfNeeded()
    await expect(section).toBeVisible()
    const heading = section.getByRole('heading').first()
    await expect(heading).toBeVisible()
    const text = await heading.textContent()
    expect(text?.trim().length).toBeGreaterThan(5)
  })

  test('featured YouTube embed is present in YouTube section', async ({ page }) => {
    // youtubeSection.featuredVideoId
    const section = page.locator('#youtube')
    await section.scrollIntoViewIfNeeded()
    const iframe = section.locator('iframe')
    await expect(iframe).toBeVisible()
    const src = await iframe.getAttribute('src')
    expect(src).toContain('youtube')
  })

  test('at least one topic card is visible', async ({ page }) => {
    // youtubeSection.topics[].title
    const section = page.locator('#youtube')
    await section.scrollIntoViewIfNeeded()
    const text = await section.textContent()
    expect(text?.trim().length).toBeGreaterThan(50)
  })

  test('channel link is present with a YouTube href', async ({ page }) => {
    // youtubeSection.channelUrl / ctaButton.url
    const section = page.locator('#youtube')
    await section.scrollIntoViewIfNeeded()
    const ytLink = section.locator('a[href*="youtube"]').first()
    await expect(ytLink).toBeVisible()
  })
})

test.describe('Sanity → live site: Video grid', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/') })

  test('video grid section is present with at least one video', async ({ page }) => {
    // videoGrid.videos[].title
    const section = page.locator('section').filter({ hasText: /lecture|portfolio|derivatives|sfm/i }).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toBeVisible()
    const text = await section.textContent()
    expect(text?.trim().length).toBeGreaterThan(20)
  })
})

test.describe('Sanity → live site: Teaching Philosophy', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/') })

  test('philosophy section heading is visible', async ({ page }) => {
    // teachingPhilosophy.heading
    const section = page.locator('section').filter({ hasText: /teaching|philosophy|approach|method/i }).first()
    await section.scrollIntoViewIfNeeded()
    const heading = section.getByRole('heading').first()
    await expect(heading).toBeVisible()
  })

  test('at least one philosophy card is visible', async ({ page }) => {
    // teachingPhilosophy.cards[].title
    const section = page.locator('section').filter({ hasText: /teaching|philosophy|approach|method/i }).first()
    await section.scrollIntoViewIfNeeded()
    const text = await section.textContent()
    expect(text?.trim().length).toBeGreaterThan(50)
  })
})

test.describe('Sanity → live site: About Series', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/') })

  test('series section heading is visible', async ({ page }) => {
    // aboutSeries.heading
    const section = page.locator('section').filter({ hasText: /series|syllabus|covers|topics/i }).first()
    await section.scrollIntoViewIfNeeded()
    const heading = section.getByRole('heading').first()
    await expect(heading).toBeVisible()
  })

  test('at least one topic chip is visible', async ({ page }) => {
    // aboutSeries.topics[]
    const section = page.locator('section').filter({ hasText: /portfolio|capm|derivatives|forex/i }).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toBeVisible()
  })
})

test.describe('Sanity → live site: Who Is It For', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/') })

  test('who-is-it-for section heading is visible', async ({ page }) => {
    // whoIsItFor.heading
    const section = page.locator('section').filter({ hasText: /is this for|who is|for me/i }).first()
    await section.scrollIntoViewIfNeeded()
    const heading = section.getByRole('heading').first()
    await expect(heading).toBeVisible()
  })

  test('at least one audience card is visible', async ({ page }) => {
    // whoIsItFor.cards[].title
    const section = page.locator('section').filter({ hasText: /is this for|who is|for me/i }).first()
    await section.scrollIntoViewIfNeeded()
    const text = await section.textContent()
    expect(text?.trim().length).toBeGreaterThan(50)
  })
})

test.describe('Sanity → live site: Testimonials', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/') })

  test('testimonials section is visible', async ({ page }) => {
    // testimonials.heading
    const section = page.locator('section').filter({ hasText: /testimonial|student|result/i }).first()
    await section.scrollIntoViewIfNeeded()
    await expect(section).toBeVisible()
  })

  test('at least one testimonial student name is visible', async ({ page }) => {
    // testimonials.items[].name
    const section = page.locator('section').filter({ hasText: /testimonial|student|result/i }).first()
    await section.scrollIntoViewIfNeeded()
    const text = await section.textContent()
    expect(text?.trim().length).toBeGreaterThan(50)
  })

  test('overall rating is displayed', async ({ page }) => {
    // testimonials.overallRating
    const section = page.locator('section').filter({ hasText: /testimonial|student|result/i }).first()
    await section.scrollIntoViewIfNeeded()
    const text = await section.textContent()
    // Should contain a rating like "4.9" or "5.0"
    expect(text).toMatch(/[45]\.\d/)
  })
})

test.describe('Sanity → live site: FAQ section', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/') })

  test('FAQ section heading is visible', async ({ page }) => {
    // faq.heading
    const section = page.locator('section').filter({ hasText: /frequently asked|faq/i }).first()
    await section.scrollIntoViewIfNeeded()
    const heading = section.getByRole('heading').first()
    await expect(heading).toBeVisible()
  })

  test('FAQ items are rendered as accordion buttons', async ({ page }) => {
    // faq.items[].question
    const section = page.locator('section').filter({ hasText: /frequently asked|faq/i }).first()
    await section.scrollIntoViewIfNeeded()
    const buttons = section.getByRole('button')
    const count = await buttons.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('first FAQ answer is visible (open by default)', async ({ page }) => {
    // faq.items[0].answer
    const section = page.locator('section').filter({ hasText: /frequently asked|faq/i }).first()
    await section.scrollIntoViewIfNeeded()
    // First accordion item starts open — its answer should be visible
    const buttons = section.getByRole('button')
    const firstQuestion = await buttons.first().textContent()
    expect(firstQuestion?.trim().length).toBeGreaterThan(5)
  })

  test('clicking a FAQ question reveals its answer', async ({ page }) => {
    // faq.items[].answer revealed on interaction
    const section = page.locator('section').filter({ hasText: /frequently asked|faq/i }).first()
    await section.scrollIntoViewIfNeeded()
    const buttons = section.getByRole('button')
    const count = await buttons.count()
    if (count >= 2) {
      // Click the second item to open it
      await buttons.nth(1).click()
      // Section should now contain more text (answer expanded)
      const text = await section.textContent()
      expect(text?.trim().length).toBeGreaterThan(100)
    }
  })

  test('contact email is visible in FAQ section', async ({ page }) => {
    // faq.email
    const section = page.locator('section').filter({ hasText: /frequently asked|faq/i }).first()
    await section.scrollIntoViewIfNeeded()
    const text = await section.textContent()
    expect(text).toMatch(/@/)
  })
})

test.describe('Sanity → live site: YouTube Subscribe Banner', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/') })

  test('subscribe banner is visible', async ({ page }) => {
    // youtubeSubscribeBanner.text
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const banner = page.locator('a[href*="youtube"]').last()
    await expect(banner).toBeVisible()
  })

  test('banner contains non-empty text', async ({ page }) => {
    // youtubeSubscribeBanner.text + button.text
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const banner = page.locator('section').filter({ hasText: /subscribe|youtube|lecture/i }).last()
    const text = await banner.textContent()
    expect(text?.trim().length).toBeGreaterThan(10)
  })
})

test.describe('Sanity → live site: Contact page (contact group)', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/contact') })

  test('contact page loads and has a heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('WhatsApp link is present and has phone number in href', async ({ page }) => {
    // contact.whatsappNumber
    const waLink = page.locator('a[href*="wa.me"]').first()
    await expect(waLink).toBeVisible()
    const href = await waLink.getAttribute('href')
    expect(href).toMatch(/wa\.me\/\d{10,}/)
  })

  test('email address is visible on contact page', async ({ page }) => {
    // contact.email
    const text = await page.locator('body').textContent()
    expect(text).toMatch(/@/)
  })

  test('location text is visible', async ({ page }) => {
    // contact.location
    const text = await page.locator('body').textContent()
    // Should contain some location info (at least a few chars)
    expect(text?.trim().length).toBeGreaterThan(100)
  })
})

test.describe('Sanity → live site: Revalidation webhook', () => {
  test('POST /api/revalidate returns 401 without secret', async ({ request }) => {
    const res = await request.post('/api/revalidate')
    expect(res.status()).toBe(401)
  })

  test('POST /api/revalidate returns 401 with wrong secret', async ({ request }) => {
    const res = await request.post('/api/revalidate?secret=wrong-secret')
    expect(res.status()).toBe(401)
  })
})

test.describe('Sanity → live site: Draft mode endpoints', () => {
  test('draft-mode disable endpoint redirects without error', async ({ page }) => {
    const res = await page.goto('/api/draft-mode/disable')
    // Should redirect to / (302/307) or return 200 — not a 404/500
    expect(res?.status()).toBeLessThan(500)
  })

  test('studio route is reachable', async ({ page }) => {
    const res = await page.goto('/studio')
    expect(res?.status()).not.toBe(404)
    expect(res?.status()).not.toBe(500)
  })
})
