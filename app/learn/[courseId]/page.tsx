import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

// Redirect to the first incomplete (or first) lesson in the course
export default async function LearnCoursePage({ params }: { params: { courseId: string } }) {
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

    const allLessons = course.modules.flatMap(m => m.lessons)
    if (allLessons.length === 0) redirect('/dashboard')

    // Find first incomplete lesson
    const progress = await prisma.progress.findMany({
      where: { userId, lessonId: { in: allLessons.map(l => l.id) }, completed: true },
    })
    const completedIds = new Set(progress.map(p => p.lessonId))
    const nextLesson = allLessons.find(l => !completedIds.has(l.id)) ?? allLessons[0]

    redirect(`/learn/${params.courseId}/${nextLesson.id}`)
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
    console.error('[LearnCoursePage]', err)
    redirect('/dashboard')
  }
}
