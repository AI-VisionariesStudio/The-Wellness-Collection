'use client'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

export default function AboutPage() {
  const { lang } = useLanguage()
  const T = t[lang].about
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', direction: dir }}>

      {/* White top — logo layers into cream below */}
      <div className="overlay-top">
        <Link href="/" style={{ display: 'block' }}>
          <img src="/twc-logo.svg" alt="Gracefully Redefined" className="overlay-logo" />
        </Link>
      </div>

      {/* Cream body */}
      <div className="overlay-body">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>
            The Wellness Collection
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '44px', fontWeight: 300, color: 'var(--text)', marginBottom: '0', lineHeight: 1.1 }}>
            {T.title}
          </h1>
          <div style={{ width: '40px', height: '1px', background: 'var(--border)', margin: '20px auto 0' }} />
        </div>
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 24px rgba(180,160,140,0.10)' }}>
          <div style={{ background: 'var(--header)', borderBottom: '1px solid var(--border)', padding: '18px 40px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>
              Our Story
            </p>
          </div>
          <div style={{ padding: '48px 40px' }}>
            <p style={{ fontSize: '17px', lineHeight: 1.85, color: 'var(--text-muted)' }}>{T.body}</p>
          </div>
        </div>

        <div style={{ marginTop: '0', padding: '22px 40px', background: 'var(--header)', border: '1px solid var(--border)', borderTop: 'none', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Questions?{' '}
            <Link href="/contact" style={{ color: 'var(--text)', fontWeight: 500 }}>Get in touch →</Link>
          </p>
        </div>
        </div>
      </div>

    </div>
  )
}
