'use client'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

const sectionBodies = [
  `These Terms of Service ("Terms") govern your access to and use of The Wellness Collection platform operated by Gracefully Redefined ("we," "us," or "our"). By registering for an account, purchasing a course, or otherwise using our platform, you agree to be bound by these Terms.\n\nIf you do not agree to these Terms, please do not use our platform.`,
  `You must be at least 18 years of age to create an account or purchase courses on this platform. By using our services, you represent and warrant that you meet this requirement.\n\nYou are responsible for ensuring that your use of our platform complies with all laws and regulations applicable to you.`,
  `To access course content, you must create an account with a valid email address and password. You are responsible for:\n\n• Providing accurate and complete information during registration\n• Maintaining the confidentiality of your account credentials\n• All activity that occurs under your account\n\nPlease notify us immediately at support@gracefullyredefined.com if you suspect unauthorized access to your account. We reserve the right to suspend or terminate accounts that violate these Terms.`,
  `All course purchases are processed securely through Stripe, our third-party payment processor. By completing a purchase, you authorize us to charge the listed price to your selected payment method.\n\nAll prices are listed in US dollars. Taxes may apply depending on your location.\n\nCourse access is granted upon successful payment confirmation. We reserve the right to modify course pricing at any time; price changes will not affect purchases already completed.`,
  `We offer refunds on course purchases within 7 days of the original purchase date, provided you have not completed more than 20% of the course content.\n\nTo request a refund, contact us at support@gracefullyredefined.com with your order details. Refunds are processed back to the original payment method and typically appear within 5–10 business days depending on your bank.\n\nWe reserve the right to decline refund requests that do not meet the above criteria or that appear to be made in bad faith.`,
  `Upon purchase, we grant you a limited, non-exclusive, non-transferable license to access and view the course content for your personal, non-commercial use.\n\nThis license does not include the right to:\n\n• Download, reproduce, or distribute course materials\n• Share your account access with others\n• Use course content for commercial purposes\n• Resell or sublicense any portion of the content\n\nCourse access is available for the lifetime of the platform, subject to these Terms.`,
  `All content on this platform — including but not limited to course videos, written materials, worksheets, certificates, branding, and design — is the exclusive intellectual property of Gracefully Redefined and is protected by applicable copyright and trademark law.\n\nYou may not copy, reproduce, distribute, modify, create derivative works from, or publicly display any content from this platform without our express written permission.`,
  `You agree not to:\n\n• Use the platform for any unlawful purpose\n• Attempt to gain unauthorized access to any part of the platform or its systems\n• Interfere with or disrupt the integrity or performance of the platform\n• Upload or transmit any harmful, offensive, or malicious content\n• Impersonate any person or entity\n• Circumvent any technical measures used to protect our content\n• Engage in any conduct that restricts or inhibits other users from using or enjoying the platform\n\nViolation of these prohibitions may result in immediate account termination.`,
  `Our platform and all content are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the platform will be uninterrupted, error-free, or free of viruses or other harmful components.\n\nTo the fullest extent permitted by law, Gracefully Redefined disclaims all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.\n\nThe educational content on this platform is not a substitute for professional mental health treatment. See our full Disclaimer for details.`,
  `To the maximum extent permitted by applicable law, Gracefully Redefined shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, or goodwill — arising out of or in connection with your use of or inability to use the platform or its content.\n\nOur total liability for any claim arising out of these Terms or your use of the platform shall not exceed the amount you paid us in the 12 months preceding the claim.`,
  `We reserve the right to update these Terms at any time. When we make material changes, we will update the "Last Updated" date at the top of this page and notify you by email where appropriate.\n\nYour continued use of the platform after changes are posted constitutes your acceptance of the revised Terms.`,
  `These Terms are governed by and construed in accordance with the laws of the State of North Carolina, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in North Carolina.`,
  `If you have any questions about these Terms, please contact us:\n\nGracefully Redefined\nsupport@gracefullyredefined.com`,
]

export default function TermsOfService() {
  const { lang } = useLanguage()
  const T = t[lang].terms
  const dir = lang === 'he' ? 'rtl' : 'ltr'
  const lastUpdated = 'March 2025'

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--font-body)', direction: dir }}>

      {/* Header */}
      <section style={{ background: 'var(--header)', padding: '72px 40px 64px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <Link href="/">
            <img
              src="/GR-LOGO-OVAL.JPG"
              alt="Gracefully Redefined"
              style={{ height: '120px', objectFit: 'contain', mixBlendMode: 'multiply', marginBottom: '32px' }}
            />
          </Link>
          <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
            {T.legal}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 300, color: 'var(--text)', lineHeight: 1.1, marginBottom: '16px' }}>
            {T.heading}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            {T.lastUpdated} {lastUpdated}
          </p>
          <div style={{ width: '40px', height: '1px', background: 'var(--border)', margin: '28px auto 0' }} />
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '72px 40px 100px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* Intro */}
          <div style={{ background: 'var(--header)', border: '1px solid var(--border)', padding: '36px 44px', marginBottom: '48px' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.8, margin: 0 }}>
              {T.intro}
            </p>
          </div>

          {T.sections.map((section, i) => (
            <div key={i} style={{ marginBottom: '44px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '14px' }}>
                <span style={{ color: 'var(--gold)', fontSize: '18px', marginTop: '2px', flexShrink: 0 }}>✦</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 400, color: 'var(--text)', margin: 0 }}>
                  {section.title}
                </h2>
              </div>
              <div style={{ paddingLeft: '38px' }}>
                {sectionBodies[i].split('\n\n').map((para, j) => (
                  <p key={j} style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-muted)', margin: '0 0 16px', whiteSpace: 'pre-line' }}>
                    {para}
                  </p>
                ))}
              </div>
              {i < T.sections.length - 1 && <div style={{ height: '1px', background: 'var(--border-light)', marginTop: '32px', marginLeft: '38px' }} />}
            </div>
          ))}

          {/* Footer CTA */}
          <div style={{ marginTop: '56px', padding: '40px 48px', background: 'var(--header)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.7, marginBottom: '20px' }}>
              {T.ctaQuestion}
            </p>
            <Link href="/contact" className="btn btn-outline" style={{ fontSize: '11px', letterSpacing: '0.12em', background: '#fff', border: '1px solid var(--border)' }}>
              {T.contactUs}
            </Link>
          </div>

        </div>
      </section>
    </div>
  )
}
