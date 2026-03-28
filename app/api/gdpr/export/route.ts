export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { audit } from '@/lib/audit'

// GET /api/gdpr/export — returns all personal data held for the authenticated user
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id

  try {
    const [user, enrollments, progress, journal, quizAttempts, reflectionPulses, certificates] =
      await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            emailVerified: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.enrollment.findMany({
          where: { userId },
          select: { courseId: true, paidAmount: true, stripeId: true, enrolledAt: true, completedAt: true },
        }),
        prisma.progress.findMany({
          where: { userId },
          select: { lessonId: true, watchedSecs: true, completed: true, completedAt: true },
        }),
        prisma.journalEntry.findMany({
          where: { userId },
          select: { lessonId: true, body: true, updatedAt: true },
        }),
        prisma.quizAttempt.findMany({
          where: { userId },
          select: { quizId: true, score: true, passed: true, createdAt: true },
        }),
        prisma.reflectionPulse.findMany({
          where: { userId },
          select: { lessonId: true, stage: true, engagementScore: true, createdAt: true },
        }),
        prisma.certificate.findMany({
          where: { userId },
          select: { courseId: true, serialNumber: true, issuedAt: true },
        }),
      ])

    audit('gdpr.export', { userId })

    const payload = {
      exportedAt: new Date().toISOString(),
      account: user,
      enrollments,
      progress,
      journalEntries: journal,
      quizAttempts,
      reflectionPulses,
      certificates,
    }

    return new NextResponse(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="my-data-${userId}.json"`,
      },
    })
  } catch (err) {
    console.error('[GET /api/gdpr/export]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
