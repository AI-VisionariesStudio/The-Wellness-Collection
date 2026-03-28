export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { audit } from '@/lib/audit'

// DELETE /api/gdpr/delete — permanently deletes the authenticated user's account and all associated data
export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id

  try {
    // Delete in dependency order (children before parent)
    await prisma.reflectionPulse.deleteMany({ where: { userId } })
    await prisma.quizAttempt.deleteMany({ where: { userId } })
    await prisma.journalEntry.deleteMany({ where: { userId } })
    await prisma.progress.deleteMany({ where: { userId } })
    await prisma.certificate.deleteMany({ where: { userId } })
    await prisma.enrollment.deleteMany({ where: { userId } })
    await prisma.user.delete({ where: { id: userId } })

    audit('gdpr.delete', { userId })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/gdpr/delete]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
