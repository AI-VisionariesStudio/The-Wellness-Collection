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
    const lesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
        ...(body.vdoCipherId !== undefined && { vdoCipherId: body.vdoCipherId || null }),
        ...(body.documentUrl !== undefined && { documentUrl: body.documentUrl }),
        ...(body.documentName !== undefined && { documentName: body.documentName }),
        ...(body.backedResearch !== undefined && { backedResearch: body.backedResearch }),
        ...(body.duration !== undefined && { duration: body.duration }),
        ...(body.order !== undefined && { order: body.order }),
      }
    })
    return NextResponse.json(lesson)
  } catch (err) {
    console.error('[PATCH /api/admin/lessons/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    await prisma.progress.deleteMany({ where: { lessonId: params.id } })
    await prisma.lesson.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/lessons/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
