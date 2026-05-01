import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ReflectionCheckIn from './ReflectionCheckIn'

export default async function ReflectionPage({
  params,
}: {
  params: { courseId: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const userId = (session.user as any).id
  const isAdmin = (session.user as any).role === 'ADMIN'

  try {
    const course = await prisma.course.findUnique({ where: { id: params.courseId } })
    if (!course) redirect('/dashboard')

    if (!isAdmin) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: params.courseId } },
      })
      if (!enrollment) redirect(`/courses/${params.courseId}`)
    }

    return <ReflectionCheckIn courseId={params.courseId} />
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
    console.error('[ReflectionPage]', err)
    redirect('/dashboard')
  }
}
