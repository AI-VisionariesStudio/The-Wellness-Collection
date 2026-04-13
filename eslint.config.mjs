/**
 * ESLINT CONFIG — CSS Governance
 * ================================
 * Catches Tailwind class conflicts, ordering issues, and
 * unauthorized class patterns at lint time.
 */

import tailwindcss from 'eslint-plugin-tailwindcss';

export default [
  ...tailwindcss.configs['flat/recommended'],
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      tailwindcss,
    },
    settings: {
      tailwindcss: {
        callees: ['cn', 'clsx', 'twMerge'],
        config: './tailwind.config.ts',
      },
    },
    rules: {
      // ── Catch conflicting classes (e.g., p-4 and p-8 on same element) ──
      'tailwindcss/no-contradicting-classname': 'error',

      // ── Enforce consistent class ordering ──
      'tailwindcss/classnames-order': 'warn',

      // ── Flag classes not in our custom config ──
      'tailwindcss/no-custom-classname': ['warn', {
        whitelist: [
          'container-wellness',
        ],
      }],

      // ── Prevent arbitrary values (enforce token usage) ──
      'tailwindcss/enforces-negative-arbitrary-values': 'error',
      'tailwindcss/enforces-shorthand': 'warn',
    },
  },
];
