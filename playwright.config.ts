import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E configuration.
 *
 * Runs against the local dev server by default.
 * Set BASE_URL env var to point at a staging/preview URL in CI.
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',

  // Fail the build if any test.only left in source
  forbidOnly: !!process.env.CI,

  // Retry failing tests once on CI (flaky network, Supabase cold start)
  retries: process.env.CI ? 1 : 0,

  // Parallelise across workers; limit in CI to avoid DB contention
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    // Capture trace on first retry — helps debug CI failures
    trace: 'on-first-retry',
    // Capture screenshot on failure
    screenshot: 'only-on-failure',
    // Generous timeout for Supabase auth round-trips
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 14'] },
      // Only run auth + homepage on mobile to keep suite fast
      testMatch: ['**/auth.spec.ts', '**/homepage.spec.ts'],
    },
  ],

  // Start the Next.js dev server before the suite (skipped if already running)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
