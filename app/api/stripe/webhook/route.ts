export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendEnrollmentConfirmationEmail, sendPaymentFailedEmail, sendRefundEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig)
    return NextResponse.json({ error: 'No signature' }, { status: 400 })

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      try {
        const session = event.data.object as any
        const { userId, courseId } = session.metadata ?? {}

        if (!userId || !courseId) {
          console.error('Webhook missing metadata', session.id)
          break
        }

        const paidAmount = session.amount_total ?? 0

        // Idempotent — skip if already enrolled
        const existing = await prisma.enrollment.findUnique({
          where: { userId_courseId: { userId, courseId } },
        })

        if (!existing) {
          await prisma.enrollment.create({
            data: {
              userId,
              courseId,
              paidAmount,
              stripeId: session.payment_intent ?? session.id,
            },
          })

          const [user, course] = await Promise.all([
            prisma.user.findUnique({ where: { id: userId } }),
            prisma.course.findUnique({ where: { id: courseId } }),
          ])
          if (user && course) {
            await sendEnrollmentConfirmationEmail(user.email, user.name, course.title, courseId, paidAmount)
          }
        }
      } catch (err) {
        console.error('[Webhook] checkout.session.completed error', err)
      }
      break
    }

    case 'payment_intent.payment_failed': {
      try {
        const pi = event.data.object as any
        const enrollment = await prisma.enrollment.findFirst({
          where: { stripeId: pi.id },
          include: { user: true, course: true },
        })
        if (enrollment) {
          await sendPaymentFailedEmail(enrollment.user.email, enrollment.user.name, enrollment.course.title)
        }
      } catch (err) {
        console.error('[Webhook] payment_intent.payment_failed error', err)
      }
      break
    }

    case 'charge.refunded': {
      try {
        const charge = event.data.object as any
        const refundAmount = charge.amount_refunded ?? 0
        const paymentIntentId = charge.payment_intent

        if (paymentIntentId) {
          const enrollment = await prisma.enrollment.findFirst({
            where: { stripeId: paymentIntentId },
            include: { user: true, course: true },
          })
          if (enrollment) {
            await sendRefundEmail(
              enrollment.user.email,
              enrollment.user.name,
              enrollment.course.title,
              refundAmount
            )
          }
        }
      } catch (err) {
        console.error('[Webhook] charge.refunded error', err)
      }
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}

