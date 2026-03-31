// @ts-check
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E configuration for MorphoAid Frontend.
 * Base URL matches the Vite dev server default.
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Give API calls enough time in slower CI environments
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    slowMo: 700,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Start Vite dev server before running tests
  webServer: {
    command: 'cmd /c npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
