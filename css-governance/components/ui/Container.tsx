/**
 * CONTAINER — Locked Inner Content Wrapper
 * ==========================================
 * For cases where you need a constrained-width wrapper inside
 * a full-bleed section (e.g., colored background spans full width,
 * content is centered within max-width).
 *
 * GOVERNANCE:
 *   - Use inside full-width parent elements.
 *   - Do NOT nest Container inside Section — Section already constrains.
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  width?: 'default' | 'narrow' | 'wide';
}

const widthClasses = {
  default: 'max-w-content',
  narrow:  'max-w-narrow',
  wide:    'max-w-wide',
} as const;

export function Container({
  children,
  className,
  width = 'default',
}: ContainerProps) {
  return (
    <div
      className={cn(
        'w-full mx-auto',
        'px-4 md:px-8 lg:px-16',
        widthClasses[width],
        className,
      )}
    >
      {children}
    </div>
  );
}
