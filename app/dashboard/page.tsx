import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardContent from './DashboardContent'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const userId = (session.user as any).id

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                modules: {
                  include: { lessons: true }
                }
              }
            }
          }
        },
        certificates: { include: { course: true } },
        progress: true,
      }
    })

    if (!user) redirect('/login')

    const allCourses = await prisma.course.findMany({
      orderBy: { order: 'asc' },
      take: 3,
      include: { _count: { select: { modules: true } } },
    })
    const enrolledIds = user.enrollments.map(e => e.courseId)
    const availableCourses = allCourses
      .filter(c => !enrolledIds.includes(c.id))
      .map(c => ({
        id: c.id,
        title: c.title,
        description: c.description ?? '',
        price: c.price,
        isComingSoon: c.isComingSoon,
        thumbnail: (c as any).thumbnail ?? undefined,
        moduleCount: (c as any)._count?.modules ?? 0,
      }))

    // Compute learning streak from completedAt timestamps
    const completedDates = user.progress
      .filter(p => p.completed && p.completedAt)
      .map(p => new Date(p.completedAt!).toLocaleDateString('en-CA')) // YYYY-MM-DD
    const uniqueDates = Array.from(new Set(completedDates)).sort().reverse()

    let streak = 0
    if (uniqueDates.length > 0) {
      const today = new Date().toLocaleDateString('en-CA')
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('en-CA')
      if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
        streak = 1
        let prev = new Date(uniqueDates[0])
        for (let i = 1; i < uniqueDates.length; i++) {
          const curr = new Date(uniqueDates[i])
          const diff = Math.round((prev.getTime() - curr.getTime()) / 86400000)
          if (diff === 1) { streak++; prev = curr }
          else break
        }
      }
    }

    const totalCompleted = user.progress.filter(p => p.completed).length

    return (
      <DashboardContent
        certificates={user.certificates.map(cert => ({
          id: cert.id,
          serialNumber: cert.serialNumber,
          pdfPath: cert.pdfPath,
          issuedAt: cert.issuedAt.toISOString(),
          course: { title: cert.course.title },
        }))}
        enrollments={user.enrollments.map(e => ({
          id: e.id,
          courseId: e.courseId,
          completedAt: e.completedAt ? e.completedAt.toISOString() : null,
          course: {
            title: e.course.title,
            duration: e.course.duration ?? 0,
            modules: e.course.modules.map(m => ({ lessons: m.lessons.map(l => ({ id: l.id })) })),
          },
        }))}
        progress={user.progress.map(p => ({ lessonId: p.lessonId, completed: p.completed, completedAt: p.completedAt?.toISOString() ?? null }))}
        availableCourses={availableCourses}
        enrolledIds={enrolledIds}
        streak={streak}
        totalCompleted={totalCompleted}
      />
    )
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
    console.error('[DashboardPage]', err)
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ padding: '48px', textAlign: 'center', maxWidth: '460px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--text)', marginBottom: '12px' }}>
            Something&apos;s not quite right on our end.
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.7 }}>
            Please try refreshing — we&apos;ll have things back to normal shortly. If this continues, reach out to us at{' '}
            <a href="mailto:support@gracefullyredefined.com" style={{ color: 'var(--gold)' }}>support@gracefullyredefined.com</a>
          </p>
          <Link href="/dashboard" className="btn btn-primary">Try Again</Link>
        </div>
      </div>
    )
  }
}
