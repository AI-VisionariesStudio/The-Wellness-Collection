import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CourseContent from './CourseContent'

export default async function CoursePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const userId = session ? (session.user as any).id : null

  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: { lessons: { orderBy: { order: 'asc' } } }
        }
      }
    })

    if (!course) redirect('/')

    const isAdmin = !!(session && (session.user as any).role === 'ADMIN')

    const enrollment = userId ? await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: params.id } }
    }) : null

    const progress = userId ? await prisma.progress.findMany({
      where: { userId, lesson: { module: { courseId: params.id } } }
    }) : []

    const allLessons = course.modules.flatMap(m => m.lessons)
    const completedCount = progress.filter(p => p.completed).length
    const pct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0

    return (
      <CourseContent
        course={{
          id: course.id,
          title: course.title,
          description: course.description,
          price: course.price,
          isComingSoon: course.isComingSoon,
          thumbnail: (course as any).thumbnail ?? undefined,
          modules: course.modules.map(m => ({
            id: m.id,
            title: m.title,
            order: m.order,
            lessons: m.lessons.map(l => ({
              id: l.id,
              title: l.title,
              duration: l.duration ?? 0,
              order: l.order,
            })),
          })),
          outcomes: (course as any).outcomes ?? [],
        }}
        isAdmin={isAdmin}
        enrollment={!!enrollment}
        progress={progress.map(p => ({ lessonId: p.lessonId, completed: p.completed }))}
        pct={pct}
        isLoggedIn={!!session}
      />
    )
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
    console.error('[CoursePage]', err)
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
          <Link href="/" className="btn btn-primary">Back to Home</Link>
        </div>
      </div>
    )
  }
}
