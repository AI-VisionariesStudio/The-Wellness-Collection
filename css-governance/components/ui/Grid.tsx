/**
 * GRID — Locked Responsive Grid
 * ===============================
 * Enforces consistent column layouts across breakpoints.
 *
 * GOVERNANCE:
 *   - All multi-column layouts MUST use this component.
 *   - Column counts are locked: mobile=1, tablet and desktop configurable.
 *   - Do NOT use ad-hoc grid-cols-X classes on page-level divs.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  children: React.ReactNode;
  className?: string;
  /** Columns at md breakpoint (768px+). Mobile is always 1 column. */
  cols?: {
    md?: 1 | 2 | 3 | 4;
    lg?: 1 | 2 | 3 | 4;
  };
  /** Gap between items */
  gap?: 'sm' | 'md' | 'lg';
}

const gapClasses = {
  sm: 'gap-4 md:gap-5',
  md: 'gap-5 md:gap-6 lg:gap-8',
  lg: 'gap-6 md:gap-8 lg:gap-10',
} as const;

const mdColClasses = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
} as const;

const lgColClasses = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
} as const;

export function Grid({
  children,
  className,
  cols = { md: 2, lg: 3 },
  gap = 'md',
}: GridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1',
        cols.md && mdColClasses[cols.md],
        cols.lg && lgColClasses[cols.lg],
        gapClasses[gap],
        className,
      )}
    >
      {children}
    </div>
  );
}
