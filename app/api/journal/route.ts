export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/journal?lessonId=xxx — get journal entry for a lesson
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const lessonId = req.nextUrl.searchParams.get('lessonId')
    if (!lessonId) return NextResponse.json({ error: 'lessonId required' }, { status: 400 })

    const userId = (session.user as any).id
    const entry = await prisma.journalEntry.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    })

    return NextResponse.json({ body: entry?.body ?? '' })
  } catch (err) {
    console.error('[GET /api/journal]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/journal — upsert journal entry for a lesson
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { lessonId, body } = await req.json()
    if (!lessonId) return NextResponse.json({ error: 'lessonId required' }, { status: 400 })

    const userId = (session.user as any).id

    const entry = await prisma.journalEntry.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { body: body ?? '' },
      create: { userId, lessonId, body: body ?? '' },
    })

    return NextResponse.json({ entry })
  } catch (err) {
    console.error('[POST /api/journal]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
