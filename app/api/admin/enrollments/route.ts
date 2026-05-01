export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { audit } from '@/lib/audit'

// GET /api/admin/enrollments?courseId=xxx  — list enrollments for a course
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get('courseId')

    const where = courseId ? { courseId } : {}
    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, createdAt: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { enrolledAt: 'desc' },
    })
    return NextResponse.json(enrollments)
  } catch (err) {
    console.error('[GET /api/admin/enrollments]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/enrollments — manual enrollment (complimentary)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { userId, courseId } = await req.json()
    if (!userId || !courseId)
      return NextResponse.json({ error: 'userId and courseId are required.' }, { status: 400 })

    const [user, course] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.course.findUnique({ where: { id: courseId } }),
    ])
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    if (!course) return NextResponse.json({ error: 'Course not found.' }, { status: 404 })

    const existing = await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } })
    if (existing) return NextResponse.json({ error: 'User is already enrolled.' }, { status: 409 })

    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId, paidAmount: 0 },
      include: { user: { select: { name: true, email: true } }, course: { select: { title: true } } },
    })
    audit('admin.enrollment.grant', { userId: (session.user as any).id, metadata: { targetUserId: userId, courseId } })
    return NextResponse.json(enrollment)
  } catch (err) {
    console.error('[POST /api/admin/enrollments]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/enrollments?userId=xxx&courseId=xxx — revoke enrollment
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')
    if (!userId || !courseId)
      return NextResponse.json({ error: 'userId and courseId are required.' }, { status: 400 })

    await prisma.enrollment.delete({ where: { userId_courseId: { userId, courseId } } })
    audit('admin.enrollment.revoke', { userId: (session.user as any).id, metadata: { targetUserId: userId, courseId } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/enrollments]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

