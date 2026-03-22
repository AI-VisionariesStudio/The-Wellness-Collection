'use client'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

export default function WorkbooksPage() {
  const { lang } = useLanguage()
  const T = t[lang].workbooks
  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>

      {/* ── Hero ── */}
      <section style={{ background: '#fff', paddingTop: '100px', textAlign: 'center' }}>
        <img
          src="/GR-LOGO-OVAL.JPG"
          alt="Gracefully Redefined"
          style={{ height: '200px', objectFit: 'contain', display: 'block', margin: '0 auto -90px', position: 'relative', zIndex: 2, mixBlendMode: 'multiply' }}
        />
        <div style={{ background: 'var(--cream)', padding: '110px 60px 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '24px' }}>The Wellness Collection</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 300, color: 'var(--text)', lineHeight: 1.1, marginBottom: '0' }}>{T.title}</h1>
            <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '36px auto' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.75 }}>{T.body}</p>
          </div>
        </div>
      </section>

    </div>
  )
}
