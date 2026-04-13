/**
 * SECTION — Locked Layout Component
 * ===================================
 * Wraps every page section with consistent padding, max-width,
 * and vertical spacing. This is the primary layout contract.
 *
 * GOVERNANCE:
 *   - Pages MUST use <Section> instead of raw <section> or <div> wrappers.
 *   - The responsive padding is baked in and CANNOT be overridden via className.
 *   - Only additive classes (bg color, borders) should be passed via className.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  /** Use 'narrow' for text-heavy content like articles/about pages */
  width?: 'default' | 'narrow' | 'wide' | 'full';
  /** Vertical padding intensity */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  /** HTML element to render */
  as?: 'section' | 'div' | 'article' | 'main' | 'header' | 'footer';
  id?: string;
}

const widthClasses = {
  default: 'max-w-content',
  narrow:  'max-w-narrow',
  wide:    'max-w-wide',
  full:    'max-w-none',
} as const;

const spacingClasses = {
  none: '',
  sm:   'py-6 md:py-8 lg:py-10',
  md:   'py-8 md:py-12 lg:py-16',
  lg:   'py-12 md:py-16 lg:py-24',
} as const;

export function Section({
  children,
  className,
  width = 'default',
  spacing = 'md',
  as: Tag = 'section',
  id,
}: SectionProps) {
  return (
    <Tag
      id={id}
      className={cn(
        // ── LOCKED: responsive container padding ──
        'w-full mx-auto',
        'px-4 md:px-8 lg:px-16',
        widthClasses[width],
        spacingClasses[spacing],
        // ── ADDITIVE: caller can add bg, border, etc. ──
        className,
      )}
    >
      {children}
    </Tag>
  );
}
