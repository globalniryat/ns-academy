import { test, expect, Page } from '@playwright/test'

/**
 * Course player E2E tests.
 * Requires a pre-enrolled test student account.
 *
 * Set these env vars:
 *   TEST_STUDENT_EMAIL     — email of the enrolled test student
 *   TEST_STUDENT_PASSWORD  — password
 *   TEST_COURSE_ID         — courseId the student is enrolled in
 */

const EMAIL = process.env.TEST_STUDENT_EMAIL ?? 'testplayer@nsacademy.dev'
const PASSWORD = process.env.TEST_STUDENT_PASSWORD ?? 'TestPass@1234'
const COURSE_ID = process.env.TEST_COURSE_ID ?? 'course_sfm_001'

async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.getByLabel(/email/i).fill(email)
  await page.getByLabel(/password/i).fill(password)
  await page.getByRole('button', { name: /log in|sign in/i }).click()
  await page.waitForURL(/dashboard/, { timeout: 15_000 })
}

test.describe('Course Player', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, EMAIL, PASSWORD)
    await page.goto(`/dashboard/${COURSE_ID}`)
    // Wait for player to fully load
    await expect(page.locator('iframe[src*="youtube"]')).toBeVisible({ timeout: 15_000 })
  })

  test('shows video embed for first lesson', async ({ page }) => {
    await expect(page.locator('iframe[src*="youtube"]')).toBeVisible()
  })

  test('shows course content sidebar with lesson list', async ({ page }) => {
    await expect(page.getByText(/course content/i)).toBeVisible()
  })

  test('shows current lesson title', async ({ page }) => {
    // The lesson info panel below the video should have a heading
    await expect(page.getByRole('heading', { level: 2 })).toBeVisible()
  })

  test('Next Lesson button advances to the next lesson', async ({ page }) => {
    const firstHeading = await page.getByRole('heading', { level: 2 }).first().textContent()

    const nextBtn = page.getByRole('button', { name: /next lesson/i })
    await expect(nextBtn).toBeEnabled()
    await nextBtn.click()

    // Heading should change
    await expect(page.getByRole('heading', { level: 2 }).first()).not.toHaveText(firstHeading ?? '')
  })

  test('Previous button is disabled on the first lesson', async ({ page }) => {
    const prevBtn = page.getByRole('button', { name: /previous/i })
    await expect(prevBtn).toBeDisabled()
  })

  test('Mark Complete button is visible and clickable', async ({ page }) => {
    const markBtn = page.locator('#mark-complete-btn')
    await expect(markBtn).toBeVisible()
    await expect(markBtn).toBeEnabled()
  })

  test('clicking a lesson in the sidebar loads that lesson', async ({ page }) => {
    // Click the second lesson button in the sidebar (if more than one)
    const lessonButtons = page.locator('[id^="lesson-btn-"]')
    const count = await lessonButtons.count()

    if (count > 1) {
      const secondLesson = lessonButtons.nth(1)
      const lessonTitle = await secondLesson.textContent()
      await secondLesson.click()

      // Heading should update to the clicked lesson
      await expect(page.getByRole('heading', { level: 2 }).first()).toContainText(
        lessonTitle?.trim().slice(0, 10) ?? ''
      )
    }
  })

  test('notes textarea is visible and accepts input', async ({ page }) => {
    const textarea = page.locator('textarea')
    await expect(textarea).toBeVisible()
    await textarea.fill('Test note content')
    await expect(textarea).toHaveValue('Test note content')
  })

  test('back to Dashboard link works', async ({ page }) => {
    // Use breadcrumb link inside main content (multiple Dashboard links exist)
    await page.getByRole('main').getByRole('link', { name: /dashboard/i }).first().click()
    await expect(page).toHaveURL(/dashboard/, { timeout: 10_000 })
  })

  test('unenrolled user is redirected or sees not-found for unknown course', async ({ page }) => {
    // Course not found → Next.js notFound() returns 404 at same URL
    const response = await page.goto('/dashboard/course_that_does_not_exist')
    expect(response?.status()).not.toBe(200)
  })
})
