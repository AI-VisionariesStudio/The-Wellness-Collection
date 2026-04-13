/**
 * TAILWIND CONFIG — The Wellness Collection
 * ==========================================
 * This config consumes design-tokens.ts and is the ONLY place
 * Tailwind values are defined. The `theme` section uses `extend`
 * sparingly — most values REPLACE defaults to prevent drift.
 *
 * GOVERNANCE: Do NOT add one-off values here. If a token is missing,
 * add it to design-tokens.ts first, then reference it here.
 */

import type { Config } from 'tailwindcss';
import {
  colors,
  typography,
  spacing,
  layout,
  breakpoints,
  borders,
  shadows,
} from './lib/design-tokens';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],

  theme: {
    // ── REPLACE defaults (not extend) for strict governance ──
    screens: {
      md: breakpoints.md,
      lg: breakpoints.lg,
      // NO sm, xl, 2xl. Add only with written justification.
    },

    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: colors.neutral[0],
      black: colors.neutral[900],
      primary: colors.primary,
      accent: colors.accent,
      neutral: colors.neutral,
      success: colors.semantic.success,
      warning: colors.semantic.warning,
      error: colors.semantic.error,
      info: colors.semantic.info,
    },

    fontFamily: {
      heading: [typography.fontFamily.heading],
      body:    [typography.fontFamily.body],
      mono:    [typography.fontFamily.mono],
    },

    fontSize: typography.fontSize as Config['theme'] extends { fontSize: infer T } ? T : never,

    fontWeight: typography.fontWeight,

    spacing: Object.fromEntries(
      Object.entries(spacing).map(([k, v]) => [k, v])
    ),

    borderRadius: borders.radius,

    boxShadow: shadows,

    transitionDuration: {
      fast:    '150ms',
      DEFAULT: '250ms',
      slow:    '400ms',
    },

    extend: {
      maxWidth: {
        content: layout.maxWidth.content,
        narrow:  layout.maxWidth.narrow,
        wide:    layout.maxWidth.wide,
      },
    },
  },

  plugins: [],
};

export default config;
