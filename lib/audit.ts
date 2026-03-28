import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

/**
 * Fire-and-forget audit log write. Never throws or blocks the caller.
 */
export function audit(
  action: string,
  options?: { userId?: string | null; ip?: string | null; metadata?: Record<string, unknown> }
): void {
  prisma.auditLog
    .create({
      data: {
        action,
        userId: options?.userId ?? null,
        ip: options?.ip ?? null,
        metadata: options?.metadata ?? undefined,
      },
    })
    .catch(err => console.error('[audit]', action, err))
}
