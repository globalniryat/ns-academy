import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    // Node environment for API/lib tests.
    // Component tests use // @vitest-environment jsdom directive at the top of each file.
    environment: 'node',
    // E2E specs are run by Playwright, not Vitest
    exclude: ['**/node_modules/**', '**/e2e/**'],
    setupFiles: ['./vitest.setup.ts'],
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
