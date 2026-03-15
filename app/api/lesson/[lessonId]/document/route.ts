import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
const BUCKET = 'documents'

export async function GET(
  _req: Request,
  { params }: { params: { lessonId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as any).id
  const isAdmin = (session.user as any).role === 'ADMIN'

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: { module: { select: { courseId: true } } },
  })

  if (!lesson?.documentUrl) {
    return NextResponse.json({ error: 'No document found' }, { status: 404 })
  }

  // Verify enrollment (admins bypass)
  if (!isAdmin) {
    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: lesson.module.courseId } },
    })
    if (!enrollment) {
      return NextResponse.json({ error: 'Not enrolled' }, { status: 403 })
    }
  }

  const docUrl = lesson.documentUrl

  // Local/public files — serve directly
  if (docUrl.startsWith('/')) {
    return NextResponse.redirect(new URL(docUrl, process.env.NEXTAUTH_URL || 'http://localhost:3000'))
  }

  // Supabase storage — extract path and create signed URL
  try {
    const url = new URL(docUrl)
    // Supabase public URL format: .../storage/v1/object/public/BUCKET/PATH
    const marker = `/object/public/${BUCKET}/`
    const idx = url.pathname.indexOf(marker)
    if (idx !== -1) {
      const filePath = url.pathname.slice(idx + marker.length)
      const { data, error } = await supabaseAdmin.storage
        .from(BUCKET)
        .createSignedUrl(filePath, 300) // 5-minute window

      if (error || !data?.signedUrl) {
        // Fall back to direct URL if signing fails
        return NextResponse.redirect(docUrl)
      }
      return NextResponse.redirect(data.signedUrl)
    }
  } catch {
    // Not a Supabase URL — redirect directly
  }

  return NextResponse.redirect(docUrl)
}
