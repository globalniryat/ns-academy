import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // Node environment for API/lib tests; jsdom used per-file via @vitest-environment directive
    environment: 'node',
    // E2E specs are run by Playwright, not Vitest
    exclude: ['**/node_modules/**', '**/e2e/**'],
    setupFiles: ['./vitest.setup.ts'],
    environmentMatchGlobs: [
      // Component tests run in jsdom
      ['__tests__/components/**', 'jsdom'],
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: [
        'lib/**/*.ts',
        'app/api/**/*.ts',
        'components/ui/**/*.tsx',
      ],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/node_modules/**',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
})
