export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseBody, verifyEmailSchema } from '@/lib/validate'

export async function POST(req: NextRequest) {
  try {
    const { data, error } = await parseBody(req, verifyEmailSchema)
    if (error) return error

    const { token } = data

    const user = await prisma.user.findUnique({ where: { verificationToken: token } })
    if (!user)
      return NextResponse.json({ error: 'Invalid or expired verification link.' }, { status: 400 })

    if (user.emailVerified)
      return NextResponse.json({ success: true, alreadyVerified: true })

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/auth/verify-email]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

