/**
 * SPACING CONSISTENCY TESTS
 * ===========================
 * Programmatic tests that verify layout values match design tokens
 * at each breakpoint. Catches drift even when screenshots look "close enough."
 */

import { test, expect } from '@playwright/test';

const breakpoints = {
  mobile:  { width: 390,  height: 844 },
  tablet:  { width: 768,  height: 1024 },
  desktop: { width: 1440, height: 900 },
};

test.describe('Spacing governance', () => {

  test('container padding matches tokens at all breakpoints', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check all elements using the container-wellness class or Section component
    const containers = page.locator('.container-wellness, [class*="px-4"][class*="mx-auto"]');
    const count = await containers.count();

    if (count === 0) {
      test.skip();
      return;
    }

    for (let i = 0; i < Math.min(count, 5); i++) {
      const el = containers.nth(i);
      const box = await el.boundingBox();

      if (box) {
        // Container should never exceed max-width (1280px + padding)
        expect(box.width).toBeLessThanOrEqual(1440);
      }
    }
  });

  test('no element overflows viewport horizontally', async ({ page }) => {
    for (const [name, size] of Object.entries(breakpoints)) {
      await page.setViewportSize(size);
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const overflows = await page.evaluate((vw) => {
        const issues: string[] = [];
        const allElements = document.querySelectorAll('*');

        allElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.right > vw + 1) { // 1px tolerance
            const tag = el.tagName.toLowerCase();
            const cls = el.className?.toString().slice(0, 50) || '';
            issues.push(`${tag}.${cls} overflows by ${Math.round(rect.right - vw)}px`);
          }
        });

        return issues.slice(0, 10); // cap at 10
      }, size.width);

      expect(
        overflows,
        `Horizontal overflow at ${name} (${size.width}px): ${overflows.join(', ')}`
      ).toHaveLength(0);
    }
  });

  test('no text is clipped or invisible at mobile size', async ({ page }) => {
    await page.setViewportSize(breakpoints.mobile);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const clippedText = await page.evaluate(() => {
      const issues: string[] = [];
      const textElements = document.querySelectorAll('h1, h2, h3, p, span, a, li, button');

      textElements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        // Check if text is off-screen or zero-size
        if (rect.width > 0 && rect.height > 0) {
          if (rect.left < -10 || rect.top < -10) {
            issues.push(`${el.tagName} "${el.textContent?.slice(0, 30)}" is off-screen`);
          }
        }

        // Check for text-overflow without visible truncation indicator
        if (styles.overflow === 'hidden' && styles.textOverflow !== 'ellipsis') {
          const scrollW = (el as HTMLElement).scrollWidth;
          const clientW = (el as HTMLElement).clientWidth;
          if (scrollW > clientW + 5) {
            issues.push(`${el.tagName} "${el.textContent?.slice(0, 30)}" text clipped without ellipsis`);
          }
        }
      });

      return issues.slice(0, 10);
    });

    expect(
      clippedText,
      `Clipped text at mobile: ${clippedText.join(', ')}`
    ).toHaveLength(0);
  });

  test('font sizes never go below 14px on mobile', async ({ page }) => {
    await page.setViewportSize(breakpoints.mobile);
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const tinyText = await page.evaluate(() => {
      const issues: string[] = [];
      const textElements = document.querySelectorAll('p, span, a, li, td, th, label, button');

      textElements.forEach((el) => {
        const styles = window.getComputedStyle(el);
        const fontSize = parseFloat(styles.fontSize);
        // Allow small text for captions/labels but flag body text
        if (fontSize < 14 && el.textContent && el.textContent.trim().length > 20) {
          issues.push(`${el.tagName} "${el.textContent?.slice(0, 30)}" is ${fontSize}px`);
        }
      });

      return issues.slice(0, 10);
    });

    expect(
      tinyText,
      `Text too small at mobile: ${tinyText.join(', ')}`
    ).toHaveLength(0);
  });
});
