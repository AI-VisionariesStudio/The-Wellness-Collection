/**
 * STACK — Locked Directional Spacing
 * ====================================
 * Enforces consistent spacing between stacked elements.
 * Replaces ad-hoc space-y-X and flex gap classes.
 *
 * GOVERNANCE:
 *   - Use <Stack> for any vertical or horizontal list of elements.
 *   - Do NOT use raw space-y-X or gap-X on parent divs.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface StackProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'vertical' | 'horizontal';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
}

const gapClasses = {
  xs: 'gap-1',
  sm: 'gap-2 md:gap-3',
  md: 'gap-4 md:gap-5',
  lg: 'gap-6 md:gap-8',
  xl: 'gap-8 md:gap-12',
} as const;

const alignClasses = {
  start:   'items-start',
  center:  'items-center',
  end:     'items-end',
  stretch: 'items-stretch',
} as const;

export function Stack({
  children,
  className,
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
}: StackProps) {
  return (
    <div
      className={cn(
        'flex',
        direction === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        gapClasses[gap],
        alignClasses[align],
        className,
      )}
    >
      {children}
    </div>
  );
}
