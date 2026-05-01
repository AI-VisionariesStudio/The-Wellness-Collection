import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.EMAIL_FROM || 'noreply@gracefullyredefined-thewellnesscollection.com'
const PLATFORM = process.env.NEXT_PUBLIC_PLATFORM_NAME || 'Gracefully Redefined'
const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const link = `${BASE_URL}/verify-email?token=${token}`
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Verify your email — ${PLATFORM}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #D1C8BF; padding: 32px 40px; text-align: center;">
          <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #7a7065; margin: 0;">${PLATFORM}</p>
        </div>
        <div style="padding: 40px;">
          <h1 style="font-weight: 300; font-size: 28px; margin: 0 0 12px;">Verify your email, ${name}</h1>
          <p style="color: #7a7065; line-height: 1.7; margin: 0 0 28px;">
            Click the button below to confirm your email address and activate your account.
            This link expires in <strong style="color:#1a1a1a;">24 hours</strong>.
          </p>
          <a href="${link}" style="display: inline-block; background: #EDE0DC; color: #1a1a1a; padding: 14px 32px; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid #D1C8BF;">
            Verify Email Address →
          </a>
          <p style="color: #aaa; font-size: 12px; margin-top: 28px;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
        <div style="background: #F7F4F2; padding: 20px 40px; text-align: center; border-top: 1px solid #EAE2D7;">
          <p style="font-size: 12px; color: #7a7065; margin: 0;">© ${new Date().getFullYear()} ${PLATFORM}</p>
        </div>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
  const link = `${BASE_URL}/reset-password?token=${token}`
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Reset your password — ${PLATFORM}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #D1C8BF; padding: 32px 40px; text-align: center;">
          <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #7a7065; margin: 0;">${PLATFORM}</p>
        </div>
        <div style="padding: 40px;">
          <h1 style="font-weight: 300; font-size: 28px; margin: 0 0 12px;">Reset your password</h1>
          <p style="color: #7a7065; line-height: 1.7; margin: 0 0 28px;">
            Hi ${name}, we received a request to reset the password for your account.
            This link expires in <strong style="color:#1a1a1a;">1 hour</strong>.
          </p>
          <a href="${link}" style="display: inline-block; background: #EDE0DC; color: #1a1a1a; padding: 14px 32px; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid #D1C8BF;">
            Reset Password →
          </a>
          <p style="color: #aaa; font-size: 12px; margin-top: 28px;">
            If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
          </p>
        </div>
        <div style="background: #F7F4F2; padding: 20px 40px; text-align: center; border-top: 1px solid #EAE2D7;">
          <p style="font-size: 12px; color: #7a7065; margin: 0;">© ${new Date().getFullYear()} ${PLATFORM}</p>
        </div>
      </div>
    `,
  })
}

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Welcome to ${PLATFORM}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #D1C8BF; padding: 32px 40px; text-align: center;">
          <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #7a7065; margin: 0 0 8px;">${PLATFORM}</p>
        </div>
        <div style="padding: 40px;">
          <h1 style="font-weight: 300; font-size: 32px; margin: 0 0 16px;">Welcome, ${name}</h1>
          <p style="color: #7a7065; line-height: 1.7; margin: 0 0 24px;">
            Your account has been created. You can now browse and enroll in our evidence-based attachment and wellness courses.
          </p>
          <a href="${BASE_URL}/dashboard" style="display: inline-block; background: #EDE0DC; color: #1a1a1a; padding: 14px 28px; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid #D1C8BF;">
            Go to My Dashboard →
          </a>
          <p style="color: #7a7065; font-size: 13px; margin-top: 32px; line-height: 1.6;">
            If you have any questions, reply to this email and we'll be happy to help.
          </p>
        </div>
        <div style="background: #F7F4F2; padding: 20px 40px; text-align: center; border-top: 1px solid #EAE2D7;">
          <p style="font-size: 12px; color: #7a7065; margin: 0;">© ${new Date().getFullYear()} ${PLATFORM}</p>
        </div>
      </div>
    `,
  })
}

export async function sendCertificateEmail(
  to: string,
  name: string,
  courseTitle: string,
  serialNumber: string,
  pdfPath: string
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your Certificate of Completion — ${courseTitle}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #D1C8BF; padding: 32px 40px; text-align: center;">
          <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #7a7065; margin: 0 0 8px;">${PLATFORM}</p>
        </div>
        <div style="padding: 40px;">
          <h1 style="font-weight: 300; font-size: 32px; margin: 0 0 8px;">Congratulations, ${name}</h1>
          <p style="color: #c8922a; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 24px;">Course Completed</p>
          <p style="color: #7a7065; line-height: 1.7; margin: 0 0 8px;">
            You have successfully completed <strong style="color: #1a1a1a;">${courseTitle}</strong>.
          </p>
          <p style="color: #7a7065; font-size: 13px; margin: 0 0 28px;">
            Certificate Serial: <strong style="color: #1a1a1a; letter-spacing: 0.05em;">${serialNumber}</strong>
          </p>
          <a href="${BASE_URL}${pdfPath}" style="display: inline-block; background: #EDE0DC; color: #1a1a1a; padding: 14px 28px; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid #D1C8BF; margin-bottom: 16px;">
            Download Certificate →
          </a>
          <br>
          <a href="${BASE_URL}/verify" style="font-size: 13px; color: #7a7065;">Verify this certificate →</a>
        </div>
        <div style="background: #F7F4F2; padding: 20px 40px; text-align: center; border-top: 1px solid #EAE2D7;">
          <p style="font-size: 12px; color: #7a7065; margin: 0;">© ${new Date().getFullYear()} ${PLATFORM}</p>
        </div>
      </div>
    `,
  })
}

export async function sendEnrollmentConfirmationEmail(
  to: string,
  name: string,
  courseTitle: string,
  courseId: string,
  amountPaid?: number
) {
  const receiptLine = amountPaid && amountPaid > 0
    ? `<p style="color: #7a7065; font-size: 13px; margin: 0 0 24px;">Amount charged: <strong style="color: #1a1a1a;">$${(amountPaid / 100).toFixed(2)}</strong></p>`
    : ''
  await resend.emails.send({
    from: FROM,
    to,
    subject: `You're enrolled in ${courseTitle}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #D1C8BF; padding: 32px 40px; text-align: center;">
          <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #7a7065; margin: 0 0 8px;">${PLATFORM}</p>
        </div>
        <div style="padding: 40px;">
          <h1 style="font-weight: 300; font-size: 32px; margin: 0 0 16px;">You're enrolled, ${name}!</h1>
          <p style="color: #7a7065; line-height: 1.7; margin: 0 0 16px;">
            Welcome to <strong style="color: #1a1a1a;">${courseTitle}</strong>. You can start learning right away at your own pace.
          </p>
          ${receiptLine}
          <a href="${BASE_URL}/learn/${courseId}" style="display: inline-block; background: #EDE0DC; color: #1a1a1a; padding: 14px 28px; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid #D1C8BF;">
            Start Course →
          </a>
        </div>
        <div style="background: #F7F4F2; padding: 20px 40px; text-align: center; border-top: 1px solid #EAE2D7;">
          <p style="font-size: 12px; color: #7a7065; margin: 0;">© ${new Date().getFullYear()} ${PLATFORM}</p>
        </div>
      </div>
    `,
  })
}

export async function sendPaymentFailedEmail(to: string, name: string, courseTitle: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Payment failed — ${courseTitle}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #D1C8BF; padding: 32px 40px; text-align: center;">
          <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #7a7065; margin: 0;">${PLATFORM}</p>
        </div>
        <div style="padding: 40px;">
          <h1 style="font-weight: 300; font-size: 28px; margin: 0 0 12px;">Payment unsuccessful</h1>
          <p style="color: #7a7065; line-height: 1.7; margin: 0 0 24px;">
            Hi ${name}, we were unable to process your payment for <strong style="color: #1a1a1a;">${courseTitle}</strong>.
            Please update your payment method and try again.
          </p>
          <a href="${BASE_URL}/dashboard" style="display: inline-block; background: #EDE0DC; color: #1a1a1a; padding: 14px 28px; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid #D1C8BF;">
            Return to Dashboard →
          </a>
          <p style="color: #aaa; font-size: 12px; margin-top: 28px;">
            If you need assistance, please reply to this email.
          </p>
        </div>
        <div style="background: #F7F4F2; padding: 20px 40px; text-align: center; border-top: 1px solid #EAE2D7;">
          <p style="font-size: 12px; color: #7a7065; margin: 0;">© ${new Date().getFullYear()} ${PLATFORM}</p>
        </div>
      </div>
    `,
  })
}

export async function sendRefundEmail(
  to: string,
  name: string,
  courseTitle: string,
  refundAmount: number
) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Refund processed — ${courseTitle}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #D1C8BF; padding: 32px 40px; text-align: center;">
          <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #7a7065; margin: 0;">${PLATFORM}</p>
        </div>
        <div style="padding: 40px;">
          <h1 style="font-weight: 300; font-size: 28px; margin: 0 0 12px;">Refund processed</h1>
          <p style="color: #7a7065; line-height: 1.7; margin: 0 0 16px;">
            Hi ${name}, a refund of <strong style="color: #1a1a1a;">$${(refundAmount / 100).toFixed(2)}</strong> has been processed for
            <strong style="color: #1a1a1a;">${courseTitle}</strong>.
          </p>
          <p style="color: #7a7065; font-size: 13px; line-height: 1.6; margin: 0 0 24px;">
            Refunds typically appear on your statement within 5–10 business days depending on your bank.
          </p>
          <p style="color: #aaa; font-size: 12px; margin-top: 12px;">
            Questions? Reply to this email and we'll be happy to help.
          </p>
        </div>
        <div style="background: #F7F4F2; padding: 20px 40px; text-align: center; border-top: 1px solid #EAE2D7;">
          <p style="font-size: 12px; color: #7a7065; margin: 0;">© ${new Date().getFullYear()} ${PLATFORM}</p>
        </div>
      </div>
    `,
  })
}

export async function sendWaitlistWelcomeEmail(to: string, firstName: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `You're on the list, ${firstName}.`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f5f1eb;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f1eb;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#a89880;">Gracefully Redefined</p>
              <p style="margin:4px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:400;color:#2c2825;letter-spacing:0.04em;">The Wellness Collection</p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;border:1px solid #e8e0d6;padding:48px 52px 44px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center" style="padding-bottom:36px;"><div style="width:40px;height:1px;background-color:#c9b89a;"></div></td></tr>
              </table>
              <p style="margin:0 0 24px;font-size:22px;font-weight:400;color:#2c2825;line-height:1.4;font-family:Georgia,'Times New Roman',serif;">${firstName},</p>
              <p style="margin:0 0 20px;font-size:15px;color:#2c2825;line-height:1.85;font-family:Georgia,'Times New Roman',serif;">Something beautiful is on its way — and we're glad you'll be among the first to know when it arrives.</p>
              <p style="margin:0 0 20px;font-size:15px;color:#2c2825;line-height:1.85;font-family:Georgia,'Times New Roman',serif;">The Wellness Collection is a series of structured psychoeducational courses built for people who are ready to understand themselves more deeply. Each course draws on research-backed principles in attachment science, emotional intelligence, and relational patterns — offering a clear, thoughtful framework for the work of becoming who you want to be.</p>
              <p style="margin:0 0 36px;font-size:15px;color:#2c2825;line-height:1.85;font-family:Georgia,'Times New Roman',serif;">There are no shortcuts here. Just well-crafted knowledge, offered with intention and care.</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center" style="padding-bottom:36px;"><div style="width:40px;height:1px;background-color:#c9b89a;"></div></td></tr>
              </table>
              <p style="margin:0 0 6px;font-size:15px;color:#2c2825;line-height:1.85;font-family:Georgia,'Times New Roman',serif;">When our doors open, you'll be the first to hear.</p>
              <p style="margin:0 0 32px;font-size:15px;color:#2c2825;line-height:1.85;font-family:Georgia,'Times New Roman',serif;">We look forward to welcoming you in.</p>
              <p style="margin:0;font-size:14px;color:#a89880;line-height:1.7;font-family:Georgia,'Times New Roman',serif;font-style:italic;">With warmth,<br />The Wellness Collection<br /><span style="font-style:normal;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;">Gracefully Redefined</span></p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#b0a090;">The Wellness Collection &nbsp;·&nbsp; Gracefully Redefined</p>
              <p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#c0b4a4;line-height:1.6;">You're receiving this because you joined our waitlist.<br />No spam — just a note when we open the doors.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  })
}

export async function sendWellnessLeadWelcomeEmail(to: string, firstName: string) {
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Your Affirmation Cards are ready — The Wellness Collection`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <div style="background: #D1C8BF; padding: 32px 40px; text-align: center;">
          <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #7a7065; margin: 0;">The Wellness Collection</p>
        </div>
        <div style="padding: 40px;">
          <h1 style="font-weight: 300; font-size: 32px; margin: 0 0 8px;">Your cards are waiting, ${firstName}.</h1>
          <p style="color: #c8922a; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 28px;">Affirmation &amp; Grounding Cards</p>
          <p style="color: #7a7065; line-height: 1.85; margin: 0 0 28px;">
            We're so glad you're here. Your free deck of affirmation and grounding cards — rooted in attachment science, emotional intelligence, and relational self-awareness — is now unlocked and waiting for you.
          </p>
          <a href="${BASE_URL}/resources" style="display: inline-block; background: #EDE0DC; color: #1a1a1a; padding: 14px 32px; text-decoration: none; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid #D1C8BF;">
            Open My Card Deck →
          </a>
          <p style="color: #7a7065; font-size: 13px; margin-top: 36px; line-height: 1.7;">
            When you're ready to go deeper, explore our full psychoeducational courses — designed to help you understand your patterns and move forward with clarity and intention.
          </p>
          <a href="${BASE_URL}/courses" style="font-size: 13px; color: #7a7065; letter-spacing: 0.04em;">Explore the courses →</a>
        </div>
        <div style="background: #F7F4F2; padding: 20px 40px; text-align: center; border-top: 1px solid #EAE2D7;">
          <p style="font-size: 12px; color: #7a7065; margin: 0 0 4px;">© ${new Date().getFullYear()} ${PLATFORM}</p>
          <p style="font-size: 11px; color: #aaa; margin: 0;">You're receiving this because you requested free resources. No spam — ever.</p>
        </div>
      </div>
    `,
  })
}
