/**
 * PLAYWRIGHT CONFIG — Visual Regression Testing
 * ================================================
 * Runs screenshot-based tests at three locked viewport sizes.
 * Any pixel-level CSS change will fail the build until approved.
 *
 * USAGE:
 *   npx playwright test                    # run tests
 *   npx playwright test --update-snapshots # approve new baselines
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/test-results',
  snapshotPathTemplate: '{testDir}/snapshots/{testFilePath}/{arg}{ext}',

  /* Fail fast in CI, retry locally for flakiness */
  retries: process.env.CI ? 0 : 1,
  timeout: 30_000,

  /* Run tests sequentially for consistent screenshots */
  fullyParallel: false,
  workers: 1,

  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['github']]
    : [['html', { open: 'on-failure' }]],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    actionTimeout: 10_000,
    screenshot: 'only-on-failure',
  },

  /* Three locked viewports — matches our breakpoint governance */
  projects: [
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'tablet',
      use: {
        viewport: { width: 768, height: 1024 },
        deviceScaleFactor: 2,
      },
    },
    {
      name: 'desktop',
      use: {
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 1,
      },
    },
  ],

  /* Auto-start dev server if not already running */
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
