import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function buildUrl() {
  const url = process.env.DATABASE_URL ?? ''
  if (!url || url.includes('connection_limit')) return url
  return url + (url.includes('?') ? '&' : '?') + 'connection_limit=1&pool_timeout=2'
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ datasources: { db: { url: buildUrl() } } })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
