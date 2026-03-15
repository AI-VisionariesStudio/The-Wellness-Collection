export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email'
import { checkRateLimit } from '@/lib/ratelimit'
import { parseBody, registerSchema } from '@/lib/validate'

export async function POST(req: NextRequest) {
  try {
    const limit = await checkRateLimit(req, 'register')
    if (limit) return limit

    const { data, error } = await parseBody(req, registerSchema)
    if (error) return error

    const { name, email, password, caseNumber, courtCounty, courtState } = data

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existing)
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 12)
    const verificationToken = crypto.randomBytes(32).toString('hex')

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashed,
        caseNumber: caseNumber || null,
        courtCounty: courtCounty || null,
        courtState: courtState || null,
        emailVerified: true,
        verificationToken,
      },
    })

    // Send verification email (non-blocking — don't fail registration if email fails)
    sendVerificationEmail(user.email, user.name, verificationToken).catch(err =>
      console.error('Verification email failed:', err)
    )

    return NextResponse.json({ success: true, userId: user.id })
  } catch (err) {
    console.error('[POST /api/auth/register]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

