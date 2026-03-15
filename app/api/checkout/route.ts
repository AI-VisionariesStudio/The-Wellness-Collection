export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { checkRateLimit } from '@/lib/ratelimit'
import { parseBody, checkoutSchema } from '@/lib/validate'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const limit = await checkRateLimit(req, 'checkout')
    if (limit) return limit

    const { data, error } = await parseBody(req, checkoutSchema)
    if (error) return error

    const { courseId } = data
    const userId = (session.user as any).id
    const user = session.user as any

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course || !course.isActive)
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    // Don't charge if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    })
    if (existing)
      return NextResponse.json({ error: 'Already enrolled' }, { status: 400 })

    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: course.price,
            product_data: {
              name: course.title,
              description: `${course.duration} hours of wellness instruction`,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: user.email ?? undefined,
      metadata: { userId, courseId },
      success_url: `${baseUrl}/courses/${courseId}?enrolled=1`,
      cancel_url: `${baseUrl}/courses/${courseId}`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (err) {
    console.error('[POST /api/checkout]', err)
    return NextResponse.json({ error: 'Checkout failed. Please try again.' }, { status: 500 })
  }
}

