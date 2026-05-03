export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/vdocipher/otp — generate a short-lived OTP for a vdoCipher video
// Body: { videoId: string, lessonId: string }
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { videoId, lessonId } = body

    if (!videoId || typeof videoId !== 'string') {
      return NextResponse.json({ error: 'videoId is required' }, { status: 400 })
    }

    const isAdmin = (session.user as any).role === 'ADMIN'
    const userId = (session.user as any).id

    if (!isAdmin) {
      // Verify the lesson exists, vdoCipherId matches, and user is enrolled
      if (!lessonId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: { module: { select: { courseId: true } } },
      })
      if (!lesson || lesson.vdoCipherId !== videoId) {
        return NextResponse.json({ error: 'Invalid video' }, { status: 403 })
      }
      const courseId = lesson.module?.courseId
      const enrollment = courseId
        ? await prisma.enrollment.findUnique({ where: { userId_courseId: { userId, courseId } } })
        : null
      if (!enrollment) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const apiSecret = process.env.VDOCIPHER_API_SECRET
    if (!apiSecret) {
      console.error('[POST /api/vdocipher/otp] VDOCIPHER_API_SECRET not set')
      return NextResponse.json({ error: 'Video service not configured' }, { status: 500 })
    }

    const response = await fetch(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Apisecret ${apiSecret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ttl: 300 }), // OTP valid for 5 minutes
      }
    )

    if (!response.ok) {
      const text = await response.text()
      console.error('[POST /api/vdocipher/otp] vdoCipher error:', response.status, text)
      return NextResponse.json({ error: 'Failed to generate video token' }, { status: 502 })
    }

    const { otp, playbackInfo } = await response.json()
    return NextResponse.json({ otp, playbackInfo })

  } catch (err) {
    console.error('[POST /api/vdocipher/otp]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
