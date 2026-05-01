import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.EMAIL_FROM ?? 'The Wellness Collection <hello@gracefullyredefined.com>'

export async function sendWellnessLeadWelcomeEmail(email: string, firstName: string): Promise<void> {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the list.</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f1eb;font-family:Georgia,'Times New Roman',serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f1eb;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Brand mark -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:#a89880;">
                Gracefully Redefined
              </p>
              <p style="margin:4px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:400;color:#2c2825;letter-spacing:0.04em;">
                The Wellness Collection
              </p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff;border:1px solid #e8e0d6;padding:48px 52px 44px;">

              <!-- Divider line -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:36px;">
                    <div style="width:40px;height:1px;background-color:#c9b89a;"></div>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <p style="margin:0 0 24px;font-size:22px;font-weight:400;color:#2c2825;line-height:1.4;font-family:Georgia,'Times New Roman',serif;">
                ${firstName},
              </p>

              <!-- Body copy -->
              <p style="margin:0 0 20px;font-size:15px;color:#2c2825;line-height:1.85;font-family:Georgia,'Times New Roman',serif;">
                Something beautiful is on its way — and we're glad you'll be among the first to know when it arrives.
              </p>

              <p style="margin:0 0 20px;font-size:15px;color:#2c2825;line-height:1.85;font-family:Georgia,'Times New Roman',serif;">
                The Wellness Collection is a series of structured psychoeducational courses built for people who are ready to understand themselves more deeply. Each course draws on research-backed principles in attachment science, emotional intelligence, and relational patterns — offering a clear, thoughtful framework for the work of becoming who you want to be.
              </p>

              <p style="margin:0 0 36px;font-size:15px;color:#2c2825;line-height:1.85;font-family:Georgia,'Times New Roman',serif;">
                There are no shortcuts here. Just well-crafted knowledge, offered with intention and care.
              </p>

              <!-- Gold divider -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom:36px;">
                    <div style="width:40px;height:1px;background-color:#c9b89a;"></div>
                  </td>
                </tr>
              </table>

              <!-- Closing -->
              <p style="margin:0 0 6px;font-size:15px;color:#2c2825;line-height:1.85;font-family:Georgia,'Times New Roman',serif;">
                When our doors open, you'll be the first to hear.
              </p>

              <p style="margin:0 0 32px;font-size:15px;color:#2c2825;line-height:1.85;font-family:Georgia,'Times New Roman',serif;">
                We look forward to welcoming you in.
              </p>

              <!-- Signature -->
              <p style="margin:0;font-size:14px;color:#a89880;line-height:1.7;font-family:Georgia,'Times New Roman',serif;font-style:italic;">
                With warmth,<br />
                The Wellness Collection<br />
                <span style="font-style:normal;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;">Gracefully Redefined</span>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#b0a090;">
                The Wellness Collection &nbsp;·&nbsp; Gracefully Redefined
              </p>
              <p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#c0b4a4;line-height:1.6;">
                You're receiving this because you joined our waitlist.<br />
                No spam — just a note when we open the doors.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: `You're on the list, ${firstName}.`,
    html,
  })
}
