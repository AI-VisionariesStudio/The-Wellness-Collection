import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import LessonPlayer from './LessonPlayer'

function getDocumentViewUrl(docUrl: string): string | null {
  if (!docUrl) return null
  // Local path (legacy) — prefix with base URL
  if (docUrl.startsWith('/')) {
    const base = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    return `${base}${docUrl}`
  }
  // Supabase public bucket URL — return as-is (no signed URL needed for public bucket)
  return docUrl
}

export default async function LessonPage({
  params,
}: {
  params: { courseId: string; lessonId: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const userId = (session.user as any).id
  const isAdmin = (session.user as any).role === 'ADMIN'

  try {
    const course = await prisma.course.findUnique({
      where: { id: params.courseId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: { lessons: { orderBy: { order: 'asc' } } },
        },
      },
    })
    if (!course) redirect('/dashboard')

    const enrollment = isAdmin
      ? true
      : !!(await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId, courseId: params.courseId } },
        }))
    if (!enrollment) redirect(`/courses/${params.courseId}`)

    const lesson = await prisma.lesson.findUnique({ where: { id: params.lessonId } })
    if (!lesson || lesson.moduleId !== course.modules.find(m => m.lessons.some(l => l.id === params.lessonId))?.id)
      redirect(`/learn/${params.courseId}`)

    const allLessons = course.modules.flatMap(m => m.lessons)

    const progressRecords = await prisma.progress.findMany({
      where: { userId, lessonId: { in: allLessons.map(l => l.id) } },
    })
    const completedIds = new Set(progressRecords.filter(p => p.completed).map(p => p.lessonId))
    const currentProgress = progressRecords.find(p => p.lessonId === params.lessonId)

    const currentIndex = allLessons.findIndex(l => l.id === params.lessonId)
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    const documentViewUrl = lesson.documentUrl
      ? getDocumentViewUrl(lesson.documentUrl)
      : null

    return (
      <LessonPlayer
        course={course as any}
        lesson={lesson as any}
        allLessons={allLessons as any}
        completedIds={Array.from(completedIds)}
        prevLessonId={prevLesson?.id ?? null}
        nextLessonId={nextLesson?.id ?? null}
        initialWatchedSecs={currentProgress?.watchedSecs ?? 0}
        isCompleted={completedIds.has(params.lessonId)}
        isAdmin={isAdmin}
        documentViewUrl={documentViewUrl}
      />
    )
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
    console.error('[LessonPage]', err)
    redirect('/dashboard')
  }
}
