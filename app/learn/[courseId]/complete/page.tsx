import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import CompleteContent from './CompleteContent'

export default async function CourseCompletePage({ params }: { params: { courseId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const userId = (session.user as any).id
  const { courseId } = params

  try {
    const [course, enrollment, certificate] = await Promise.all([
      prisma.course.findUnique({ where: { id: courseId }, select: { id: true, title: true } }),
      prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } }),
      prisma.certificate.findFirst({ where: { userId, courseId } }),
    ])

    if (!course || !enrollment) redirect('/dashboard')

    return (
      <CompleteContent
        courseId={courseId}
        courseTitle={course.title}
        certificateId={certificate?.id}
        serialNumber={certificate?.serialNumber}
      />
    )
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
    console.error('[CourseCompletePage]', err)
    redirect('/dashboard')
  }
}
