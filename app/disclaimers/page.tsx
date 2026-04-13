'use client'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

export default function Disclaimers() {
  const { lang } = useLanguage()
  const T = t[lang].disclaimers
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-body)', direction: dir }}>

      {/* Header */}
      <section style={{ background: '#fff', padding: '72px 40px 64px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <Link href="/" style={{ display: 'block' }}>
            <img
              src="/twc-logo.svg"
              alt="Gracefully Redefined"
              style={{ height: '130px', width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto 32px' }}
            />
          </Link>
          <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
            {T.notice}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 300, color: 'var(--text)', lineHeight: 1.1, marginBottom: '0' }}>
            {T.heading}
          </h1>
          <div style={{ width: '40px', height: '1px', background: 'var(--border)', margin: '28px auto 0' }} />
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '72px 40px 100px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* Lead statement */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', padding: '48px 52px', marginBottom: '40px', borderLeft: '4px solid var(--text)', boxShadow: '0 2px 20px rgba(180,160,140,0.07)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.75, margin: 0 }}>
              {T.lead}
            </p>
          </div>

          {T.sections.map((section, i) => (
            <div key={i} style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '14px' }}>
                <span style={{ color: 'var(--text)', fontSize: '18px', marginTop: '2px', flexShrink: 0 }}>✦</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 400, color: 'var(--text)', margin: 0 }}>
                  {section.title}
                </h2>
              </div>
              <div style={{ paddingLeft: '38px' }}>
                {section.body.split('\n\n').map((para, j) => (
                  <p key={j} style={{ fontSize: '15px', lineHeight: 1.85, color: 'var(--text-muted)', margin: '0 0 16px' }}>
                    {para}
                  </p>
                ))}
              </div>
              {i < T.sections.length - 1 && <div style={{ height: '1px', background: 'var(--border-light)', marginTop: '32px', marginLeft: '38px' }} />}
            </div>
          ))}

          {/* Closing */}
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
