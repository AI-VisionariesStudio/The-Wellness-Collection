/**
 * CARD — Locked Surface Component
 * =================================
 * Consistent card styling across the platform.
 * Courses, testimonials, features — all use this.
 *
 * GOVERNANCE:
 *   - All card-like UI MUST use this component.
 *   - Do NOT create one-off card divs with ad-hoc rounded/shadow classes.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'li';
}

const variantClasses = {
  default:  'bg-white border border-neutral-200 shadow-sm',
  elevated: 'bg-white border border-neutral-100 shadow-lg',
  outlined: 'bg-transparent border border-neutral-300',
  ghost:    'bg-neutral-50 border border-transparent',
} as const;

const paddingClasses = {
  none: '',
  sm:   'p-4 md:p-5',
  md:   'p-5 md:p-6 lg:p-8',
  lg:   'p-6 md:p-8 lg:p-10',
} as const;

export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  as: Tag = 'div',
}: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-lg transition-shadow duration-default',
        variantClasses[variant],
        paddingClasses[padding],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
