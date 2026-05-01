export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email'
import { checkRateLimit } from '@/lib/ratelimit'
import { parseBody, forgotPasswordSchema } from '@/lib/validate'
import { audit, getIp } from '@/lib/audit'

export async function POST(req: NextRequest) {
  try {
    const limit = await checkRateLimit(req, 'forgot-password')
    if (limit) return limit

    const { data, error } = await parseBody(req, forgotPasswordSchema)
    if (error) return error

    const { email } = data
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })

    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ success: true })

    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    })

    sendPasswordResetEmail(user.email, user.name, resetToken).catch(err =>
      console.error('Password reset email failed:', err)
    )

    audit('user.password_reset_request', { userId: user.id, ip: getIp(req) })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/auth/forgot-password]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

