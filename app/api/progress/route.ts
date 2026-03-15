export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { issueCertificate } from '@/lib/certificate'
import { parseBody, progressSchema } from '@/lib/validate'

// POST /api/progress — update watch time for a lesson
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await parseBody(req, progressSchema)
    if (error) return error

    const { lessonId, watchedSecs, completed } = data
    const userId = (session.user as any).id

    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } })
    if (!lesson) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })

    const progress = await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        watchedSecs: Math.max(watchedSecs, 0),
        completed: completed ?? false,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId,
        lessonId,
        watchedSecs,
        completed: completed ?? false,
        completedAt: completed ? new Date() : null,
      },
    })

    if (completed) {
      await checkCourseCompletion(userId, lessonId)
    }

    return NextResponse.json({ progress })
  } catch (err) {
    console.error('[POST /api/progress]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/progress?courseId=xxx — get all progress for a course
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const courseId = req.nextUrl.searchParams.get('courseId')
    const userId = (session.user as any).id

    const progress = await prisma.progress.findMany({
      where: {
        userId,
        lesson: { module: { courseId: courseId ?? undefined } },
      },
      include: { lesson: true },
    })

    return NextResponse.json({ progress })
  } catch (err) {
    console.error('[GET /api/progress]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function checkCourseCompletion(userId: string, lessonId: string) {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { module: { include: { course: { include: { modules: { include: { lessons: true } } } } } } },
  })
  if (!lesson) return

  const course = lesson.module.course
  const allLessons = course.modules.flatMap(m => m.lessons.filter(l => l.isRequired))
  const completedProgress = await prisma.progress.findMany({
    where: { userId, lessonId: { in: allLessons.map(l => l.id) }, completed: true },
  })

  if (completedProgress.length === allLessons.length) {
    await prisma.enrollment.updateMany({
      where: { userId, courseId: course.id, completedAt: null },
      data: { completedAt: new Date() },
    })
    await issueCertificate(userId, course.id)
  }
}

