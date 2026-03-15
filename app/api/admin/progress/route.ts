export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE /api/admin/progress — reset a lesson's completion status
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if ((session.user as any).role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { lessonId, userId: targetUserId } = await req.json()
    if (!lessonId) return NextResponse.json({ error: 'lessonId required' }, { status: 400 })

    const userId = targetUserId ?? (session.user as any).id

    await prisma.progress.deleteMany({
      where: { userId, lessonId },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /api/admin/progress]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

