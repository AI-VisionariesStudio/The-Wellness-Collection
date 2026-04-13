/**
 * DESIGN TOKENS — The Wellness Collection
 * =========================================
 * Single source of truth for ALL visual values.
 *
 * GOVERNANCE RULES:
 *   1. No hardcoded px/rem/color values anywhere in the codebase.
 *   2. Every component pulls from these tokens or from the Tailwind
 *      config that consumes them.
 *   3. Adding a new token requires a comment explaining *why* the
 *      existing set doesn't cover the case.
 */

// ──────────────────────────────────────────
// COLOR PALETTE
// ──────────────────────────────────────────
export const colors = {
  // Brand — warm, grounded, wellness-forward
  primary: {
    50:  '#faf5f0',
    100: '#f3e8d9',
    200: '#e6d0b3',
    300: '#d4b085',
    400: '#c4935e',
    500: '#b07d44',   // anchor
    600: '#96663a',
    700: '#7a5132',
    800: '#5f3f29',
    900: '#453022',
  },
  accent: {
    50:  '#f0f7f4',
    100: '#d9ede3',
    200: '#b3dbc7',
    300: '#80c4a4',
    400: '#55ad83',
    500: '#3d9469',   // anchor
    600: '#327a57',
    700: '#286247',
    800: '#1f4b37',
    900: '#173828',
  },
  neutral: {
    0:   '#ffffff',
    50:  '#f9f9f7',
    100: '#f0efec',
    200: '#e0ddd8',
    300: '#c7c3bb',
    400: '#a9a49a',
    500: '#8a847a',
    600: '#6b665d',
    700: '#504c45',
    800: '#36332e',
    900: '#1e1c19',
  },
  semantic: {
    success: '#3d9469',
    warning: '#c4935e',
    error:   '#c25a4a',
    info:    '#5a8fc2',
  },
} as const;

// ──────────────────────────────────────────
// TYPOGRAPHY
// ──────────────────────────────────────────
export const typography = {
  fontFamily: {
    heading: '"Playfair Display", Georgia, serif',
    body:    '"Source Sans 3", "Source Sans Pro", system-ui, sans-serif',
    mono:    '"JetBrains Mono", "Fira Code", monospace',
  },
  fontSize: {
    xs:   ['0.75rem',  { lineHeight: '1rem' }],
    sm:   ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem',     { lineHeight: '1.5rem' }],
    lg:   ['1.125rem', { lineHeight: '1.75rem' }],
    xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem',  { lineHeight: '2rem' }],
    '3xl': ['1.875rem',{ lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem',    { lineHeight: '1.15' }],
    '6xl': ['3.75rem', { lineHeight: '1.1' }],
  },
  fontWeight: {
    normal:   '400',
    medium:   '500',
    semibold: '600',
    bold:     '700',
  },
} as const;

// ──────────────────────────────────────────
// SPACING
// ──────────────────────────────────────────
// 4px base grid. Only these values are valid.
export const spacing = {
  0:    '0px',
  0.5:  '2px',
  1:    '4px',
  1.5:  '6px',
  2:    '8px',
  2.5:  '10px',
  3:    '12px',
  3.5:  '14px',
  4:    '16px',
  5:    '20px',
  6:    '24px',
  7:    '28px',
  8:    '32px',
  9:    '36px',
  10:   '40px',
  11:   '44px',
  12:   '48px',
  14:   '56px',
  16:   '64px',
  20:   '80px',
  24:   '96px',
  28:   '112px',
  32:   '128px',
} as const;

// ──────────────────────────────────────────
// LAYOUT
// ──────────────────────────────────────────
export const layout = {
  maxWidth: {
    content: '1280px',   // max-w-7xl equivalent
    narrow:  '768px',    // reading width for text
    wide:    '1536px',   // full bleed sections
  },
  containerPadding: {
    mobile:  '1rem',     // 16px
    tablet:  '2rem',     // 32px
    desktop: '4rem',     // 64px
  },
  sectionGap: {
    mobile:  '3rem',     // 48px
    tablet:  '4rem',     // 64px
    desktop: '6rem',     // 96px
  },
} as const;

// ──────────────────────────────────────────
// BREAKPOINTS — ONLY THESE THREE
// ──────────────────────────────────────────
// base  = 0–767px     (mobile-first default)
// md    = 768px+      (tablet / small desktop)
// lg    = 1024px+     (full desktop)
//
// NO sm, xl, 2xl without written justification.
export const breakpoints = {
  md: '768px',
  lg: '1024px',
} as const;

// ──────────────────────────────────────────
// BORDERS & RADII
// ──────────────────────────────────────────
export const borders = {
  radius: {
    none: '0px',
    sm:   '4px',
    md:   '8px',
    lg:   '12px',
    xl:   '16px',
    full: '9999px',
  },
  width: {
    thin:   '1px',
    medium: '2px',
  },
} as const;

// ──────────────────────────────────────────
// SHADOWS
// ──────────────────────────────────────────
export const shadows = {
  sm:  '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md:  '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
  lg:  '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
  xl:  '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
} as const;

// ──────────────────────────────────────────
// TRANSITIONS
// ──────────────────────────────────────────
export const transitions = {
  fast:    '150ms ease',
  default: '250ms ease',
  slow:    '400ms ease',
  spring:  '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;
