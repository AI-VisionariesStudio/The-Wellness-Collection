export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const courses = await prisma.course.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { enrollments: true, modules: true } } }
    })
    return NextResponse.json(courses)
  } catch (err) {
    console.error('[GET /api/admin/courses]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const course = await prisma.course.create({
      data: {
        title: body.title || 'New Course',
        description: body.description || '',
        outcomes: body.outcomes || [],
        thumbnail: body.thumbnail || null,
        duration: body.duration || 1,
        price: body.price || 0,
        order: body.order || 99,
        isActive: body.isActive ?? false,
        isComingSoon: body.isComingSoon ?? false,
      }
    })
    return NextResponse.json(course)
  } catch (err) {
    console.error('[POST /api/admin/courses]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

