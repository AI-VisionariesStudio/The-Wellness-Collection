export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { parseBody, resetPasswordSchema } from '@/lib/validate'

export async function POST(req: NextRequest) {
  try {
    const { data, error } = await parseBody(req, resetPasswordSchema)
    if (error) return error

    const { token, password } = data

    const user = await prisma.user.findUnique({ where: { resetToken: token } })

    if (!user || !user.resetTokenExpiry)
      return NextResponse.json({ error: 'Invalid or expired reset link.' }, { status: 400 })

    if (user.resetTokenExpiry < new Date())
      return NextResponse.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, resetToken: null, resetTokenExpiry: null },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[POST /api/auth/reset-password]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

