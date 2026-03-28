import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { audit } from '@/lib/audit'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: { lessons: { orderBy: { order: 'asc' } } }
        }
      }
    })
    return NextResponse.json(course)
  } catch (err) {
    console.error('[GET /api/admin/courses/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const course = await prisma.course.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.outcomes !== undefined && { outcomes: body.outcomes }),
        ...(body.thumbnail !== undefined && { thumbnail: body.thumbnail }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.isComingSoon !== undefined && { isComingSoon: body.isComingSoon }),
        ...(body.order !== undefined && { order: body.order }),
      }
    })
    audit('admin.course.update', { userId: (session.user as any).id, metadata: { courseId: params.id } })
    return NextResponse.json(course)
  } catch (err) {
    console.error('[PATCH /api/admin/courses/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await prisma.progress.deleteMany({ where: { lesson: { module: { courseId: params.id } } } })
    await prisma.lesson.deleteMany({ where: { module: { courseId: params.id } } })
    await prisma.module.deleteMany({ where: { courseId: params.id } })
    await prisma.enrollment.deleteMany({ where: { courseId: params.id } })
    await prisma.certificate.deleteMany({ where: { courseId: params.id } })
    await prisma.course.delete({ where: { id: params.id } })
    audit('admin.course.delete', { userId: (session.user as any).id, metadata: { courseId: params.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/courses/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
