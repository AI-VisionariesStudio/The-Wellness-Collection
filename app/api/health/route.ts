export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/health — used by BetterStack and uptime monitors
export async function GET() {
  try {
    // Confirm DB is reachable
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'ok', db: 'connected', ts: new Date().toISOString() }, { status: 200 })
  } catch {
    return NextResponse.json({ status: 'error', db: 'unreachable' }, { status: 503 })
  }
}
