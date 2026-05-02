import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const module = await prisma.module.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.evidenceDocumentUrl !== undefined && { evidenceDocumentUrl: body.evidenceDocumentUrl }),
        ...(body.evidenceDocumentName !== undefined && { evidenceDocumentName: body.evidenceDocumentName }),
      },
    })
    return NextResponse.json(module)
  } catch (err) {
    console.error('[PATCH /api/admin/modules/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // Delete all lesson progress and lessons first
    const lessons = await prisma.lesson.findMany({ where: { moduleId: params.id } })
    const lessonIds = lessons.map(l => l.id)
    await prisma.progress.deleteMany({ where: { lessonId: { in: lessonIds } } })
    await prisma.lesson.deleteMany({ where: { moduleId: params.id } })
    await prisma.module.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/modules/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
