'use client'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

const sectionBodies = [
  `**Account Information.** When you create an account, we collect your name, email address, and password (stored in encrypted form). This information is required to provide you access to your courses and track your progress.\n\n**Payment Information.** All payments are processed securely through Stripe, our third-party payment processor. We do not store your credit card number, billing details, or any sensitive financial information on our servers. Stripe's privacy policy governs the handling of your payment data.\n\n**Course Activity.** We collect information about how you interact with our courses, including lessons viewed, progress made, and certificates earned. This data exists solely to power your learning experience.\n\n**Communications.** If you contact us through our contact form or by email, we retain that correspondence to respond to your inquiry and improve our services.`,
  `We use the information we collect for the following purposes:\n\n• To create and maintain your account and provide access to purchased courses\n• To process payments and send transaction confirmations\n• To track your learning progress and issue completion certificates\n• To send important service-related communications (account verification, password resets, enrollment confirmations)\n• To respond to your inquiries and provide customer support\n• To improve our courses, platform functionality, and user experience\n• To comply with legal obligations\n\nWe do not sell, rent, or trade your personal information to third parties for marketing purposes.`,
  `We use session cookies and similar technologies to keep you logged in and maintain your platform experience. These are essential to the functioning of the site and do not track your activity across other websites.\n\nWe may use basic analytics tools to understand how users navigate our platform in aggregate (e.g., which pages are visited most often). This data is anonymized and cannot be traced to individual users.\n\nYou may configure your browser to refuse cookies; however, doing so may limit certain functionality, including the ability to stay logged in to your account.`,
  `Your data is stored on secure, industry-standard infrastructure. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, disclosure, alteration, or destruction.\n\nAll data transmission between your browser and our platform is encrypted using SSL/TLS technology (indicated by "https" in your browser's address bar).\n\nWhile we take data security seriously, no system is entirely impenetrable. We encourage you to use a strong, unique password and to notify us immediately at support@gracefullyredefined.com if you suspect any unauthorized use of your account.`,
  `We do not sell or rent your personal information. We share information only in the following limited circumstances:\n\n• **Service Providers.** We work with trusted third parties (such as Stripe for payments, Resend for transactional emails, and Supabase for secure file storage) who assist us in operating our platform. These providers access only the data necessary to perform their services and are bound by confidentiality obligations.\n\n• **Legal Requirements.** We may disclose information if required to do so by law or in response to a valid legal process, such as a court order or government inquiry.\n\n• **Protection of Rights.** We may disclose information to protect the safety, rights, or property of Gracefully Redefined, our users, or the public.`,
  `You have the right to:\n\n• **Access** the personal information we hold about you\n• **Correct** any inaccurate or incomplete information\n• **Delete** your account and associated personal data\n• **Opt out** of non-essential communications at any time\n\nTo exercise any of these rights, please contact us at support@gracefullyredefined.com. We will respond to all requests within a reasonable timeframe and in accordance with applicable law.`,
  `Our platform is intended for adults and is not directed at children under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected information from a minor, we will take steps to delete it promptly. If you believe a child has provided us with their information, please contact us immediately.`,
  `Our platform may contain links to external websites or resources. Gracefully Redefined is not responsible for the privacy practices or content of those third-party sites. We encourage you to review the privacy policies of any external sites you visit.`,
  `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. When we make material changes, we will update the "Last Updated" date at the top of this page and, where appropriate, notify you by email.\n\nYour continued use of our platform following any changes constitutes your acceptance of the revised policy.`,
  `If you have any questions, concerns, or requests regarding this Privacy Policy or the way we handle your personal information, please do not hesitate to reach out:\n\nGracefully Redefined\nsupport@gracefullyredefined.com`,
]

export default function PrivacyPolicy() {
  const { lang } = useLanguage()
  const T = t[lang].privacy
  const dir = lang === 'he' ? 'rtl' : 'ltr'
  const lastUpdated = 'March 2025'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)', direction: dir }}>

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
                    {para.replace(/\*\*(.*?)\*\*/g, '$1')}
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
