export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { issueCertificate } from '@/lib/certificate'

// POST /api/certificate — admin-only manual certificate issuance
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { userId, courseId } = await req.json()
    if (!userId || !courseId)
      return NextResponse.json({ error: 'userId and courseId required' }, { status: 400 })

    const result = await issueCertificate(userId, courseId)
    if ('error' in result) return NextResponse.json({ error: result.error }, { status: 404 })
    return NextResponse.json({ certificate: result.certificate })
  } catch (err) {
    console.error('[POST /api/certificate]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/certificate?serial=xxx — public verification endpoint
export async function GET(req: NextRequest) {
  try {
    const serial = req.nextUrl.searchParams.get('serial')
    if (!serial) return NextResponse.json({ error: 'Serial required' }, { status: 400 })

    const cert = await prisma.certificate.findUnique({
      where: { serialNumber: serial },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true, duration: true } },
      },
    })

    if (!cert) return NextResponse.json({ valid: false, message: 'Certificate not found' })

    return NextResponse.json({
      valid: true,
      serialNumber: cert.serialNumber,
      issuedTo: cert.user.name,
      course: cert.course.title,
      hours: cert.course.duration,
      issuedAt: cert.issuedAt,
    })
  } catch (err) {
    console.error('[GET /api/certificate]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

