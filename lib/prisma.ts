import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const url = process.env.DATABASE_URL ?? ''
const dbUrl = url && !url.includes('connection_limit')
  ? url + (url.includes('?') ? '&' : '?') + 'connection_limit=1'
  : url

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ datasources: { db: { url: dbUrl } } })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
