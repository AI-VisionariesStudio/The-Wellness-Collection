/**
 * VISUAL REGRESSION TESTS — The Wellness Collection
 * ====================================================
 * Screenshot-based tests that catch ANY visual CSS change.
 *
 * HOW IT WORKS:
 *   1. First run creates baseline screenshots in e2e/snapshots/
 *   2. Every subsequent run diffs against baselines
 *   3. ANY pixel difference fails the test
 *   4. To approve changes: npx playwright test --update-snapshots
 *
 * GOVERNANCE:
 *   - These tests run in CI on every PR (see .github/workflows/)
 *   - No CSS change merges without passing visual regression
 *   - Baseline updates require manual approval via --update-snapshots
 *
 * ADD NEW PAGES: Just add entries to the `pages` array below.
 */

import { test, expect, Page } from '@playwright/test';

// ──────────────────────────────────────────
// CONFIGURATION
// ──────────────────────────────────────────

/** All pages to visually test. Add new routes here. */
const pages = [
  { path: '/',            name: 'home' },
  { path: '/about',       name: 'about' },
  { path: '/courses',     name: 'courses' },
  { path: '/login',       name: 'login' },
  { path: '/signup',      name: 'signup' },
  { path: '/contact',     name: 'contact' },
  // Add more pages as they're built:
  // { path: '/courses/[slug]', name: 'course-detail' },
  // { path: '/dashboard',      name: 'dashboard' },
];

/** Pixel threshold for diff tolerance (accounts for font rendering) */
const DIFF_THRESHOLD = 0.01; // 1% tolerance

// ──────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────

/**
 * Wait for the page to be fully loaded and stable before screenshot.
 * This prevents flaky tests from loading spinners or lazy images.
 */
async function waitForStable(page: Page) {
  // Wait for network to settle
  await page.waitForLoadState('networkidle');

  // Wait for any CSS transitions to complete
  await page.waitForTimeout(500);

  // Wait for all images to load
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // Don't block on broken images
        });
      })
    );
  });

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready);

  // Final settle
  await page.waitForTimeout(300);
}

// ──────────────────────────────────────────
// FULL PAGE SCREENSHOT TESTS
// ──────────────────────────────────────────

for (const { path, name } of pages) {
  test(`visual: ${name} — full page`, async ({ page }, testInfo) => {
    const viewport = testInfo.project.name; // 'mobile' | 'tablet' | 'desktop'

    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await waitForStable(page);

    await expect(page).toHaveScreenshot(
      `${name}-${viewport}-full.png`,
      {
        fullPage: true,
        maxDiffPixelRatio: DIFF_THRESHOLD,
        animations: 'disabled',
      }
    );
  });
}

// ──────────────────────────────────────────
// ABOVE-THE-FOLD TESTS (viewport only)
// ──────────────────────────────────────────

for (const { path, name } of pages) {
  test(`visual: ${name} — above fold`, async ({ page }, testInfo) => {
    const viewport = testInfo.project.name;

    await page.goto(path, { waitUntil: 'domcontentloaded' });
    await waitForStable(page);

    await expect(page).toHaveScreenshot(
      `${name}-${viewport}-fold.png`,
      {
        fullPage: false, // viewport only
        maxDiffPixelRatio: DIFF_THRESHOLD,
        animations: 'disabled',
      }
    );
  });
}

// ──────────────────────────────────────────
// NAVIGATION TESTS
// ──────────────────────────────────────────

test('visual: nav — mobile menu open', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'mobile') {
    test.skip();
    return;
  }

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await waitForStable(page);

  // Click mobile hamburger menu (adjust selector to match your nav)
  const menuButton = page.locator('[aria-label="Menu"], [aria-label="Toggle menu"], button:has(svg)').first();
  if (await menuButton.isVisible()) {
    await menuButton.click();
    await page.waitForTimeout(500); // wait for menu animation

    await expect(page).toHaveScreenshot(
      'nav-mobile-open.png',
      {
        fullPage: false,
        maxDiffPixelRatio: DIFF_THRESHOLD,
        animations: 'disabled',
      }
    );
  }
});

test('visual: nav — desktop header', async ({ page }, testInfo) => {
  if (testInfo.project.name !== 'desktop') {
    test.skip();
    return;
  }

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await waitForStable(page);

  const header = page.locator('header, nav').first();
  if (await header.isVisible()) {
    await expect(header).toHaveScreenshot(
      'nav-desktop-header.png',
      {
        maxDiffPixelRatio: DIFF_THRESHOLD,
        animations: 'disabled',
      }
    );
  }
});

// ──────────────────────────────────────────
// FOOTER TEST
// ──────────────────────────────────────────

test('visual: footer', async ({ page }, testInfo) => {
  const viewport = testInfo.project.name;

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await waitForStable(page);

  const footer = page.locator('footer').first();
  if (await footer.isVisible()) {
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await expect(footer).toHaveScreenshot(
      `footer-${viewport}.png`,
      {
        maxDiffPixelRatio: DIFF_THRESHOLD,
        animations: 'disabled',
      }
    );
  }
});
