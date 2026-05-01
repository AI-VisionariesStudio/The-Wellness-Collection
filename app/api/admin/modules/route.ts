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
    if (!body.courseId)
      return NextResponse.json({ error: 'courseId required' }, { status: 400 })
    const module = await prisma.module.create({
      data: {
        courseId: body.courseId,
        title: body.title || 'New Module',
        order: body.order || 99,
      }
    })
    return NextResponse.json(module)
  } catch (err) {
    console.error('[POST /api/admin/modules]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

