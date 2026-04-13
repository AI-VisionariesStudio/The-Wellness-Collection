/**
 * CLASS NAME UTILITY
 * Uses clsx + tailwind-merge to prevent class conflicts.
 * Import this everywhere instead of raw string concatenation.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
