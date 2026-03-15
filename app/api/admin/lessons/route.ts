export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    if (!body.moduleId)
      return NextResponse.json({ error: 'moduleId required' }, { status: 400 })
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: body.moduleId,
        title: body.title || 'New Lesson',
        description: body.description || '',
        videoUrl: body.videoUrl || '',
        duration: body.duration || 2700,
        order: body.order || 99,
      }
    })
    return NextResponse.json(lesson)
  } catch (err) {
    console.error('[POST /api/admin/lessons]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

