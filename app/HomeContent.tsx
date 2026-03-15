'use client'
import Link from 'next/link'
import { useLanguage } from './LanguageContext'
import { t } from '@/lib/translations'

export default function HomeContent({ coursesHref }: { coursesHref: string }) {
  const { lang } = useLanguage()
  const T = t[lang].home
  const isHe = lang === 'he'
  const dir = isHe ? 'rtl' : 'ltr'

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--font-body)', direction: dir }}>

      {/* ── White space with oval logo ── */}
      <section style={{ background: '#fff', padding: '72px 40px 0', textAlign: 'center' }}>
        <img src="/GR-LOGO-OVAL.JPG" alt="Gracefully Redefined" style={{ height: '160px', objectFit: 'contain', position: 'relative', zIndex: 2, display: 'block', margin: '0 auto -80px', mixBlendMode: 'multiply' }} />
      </section>

      {/* ── Hero card (beige, bordered, oval logo overlaps top) ── */}
      <section style={{ background: '#fff', padding: '0 56px 60px' }}>
        <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', maxWidth: '860px', margin: '0 auto', padding: '100px 60px 60px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
            <div style={{ width: '280px', height: '48px', overflow: 'hidden' }}>
              <img src="/GR_FINAL_FILES_transparent.png" alt="Gracefully Redefined" style={{ width: '100%', height: 'auto' }} />
            </div>
          </div>
          <h1 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: '58px', fontWeight: 300, lineHeight: 1.08, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: '0' }}>
            {T.tagline}
          </h1>
          <div style={{ width: '48px', height: '1px', background: 'var(--border)', margin: '32px auto' }} />
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '48px', whiteSpace: 'pre-line' }}>
            {T.hero}
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn-primary" style={{ fontSize: '11px', padding: '15px 40px', letterSpacing: '0.14em', background: '#fff', border: '1px solid var(--border)' }}>
              {T.beginJourney}
            </Link>
            <Link href={coursesHref} className="btn btn-outline" style={{ fontSize: '11px', padding: '15px 40px', letterSpacing: '0.14em', background: '#fff', border: '1px solid var(--border)' }}>
              {T.viewCourses}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section style={{ background: 'var(--header)', padding: '20px 40px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '12px' }}>
          {[T.trust1, T.trust2, T.trust3].map(item => (
            <span key={item} style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--text)', fontSize: '14px' }}>&#10003;</span>
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="reveal" style={{ background: '#fff', padding: '100px 40px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {T.ourApproach}
          </p>
          <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.55, margin: '0 0 32px' }}>
            {T.quote}
          </blockquote>
          <p style={{ fontSize: '13px', letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {T.quoteAttr}
          </p>
        </div>
      </section>

      {/* ── Section separator ── */}
      <section style={{ background: 'var(--header)', padding: '20px 40px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '12px' }}>
          {[T.strip2a, T.strip2b, T.strip2c].map(item => (
            <span key={item} style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--text)', fontSize: '14px' }}>&#10003;</span>
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="reveal" style={{ background: '#fff', padding: '100px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
            {T.pathForward}
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '44px', fontWeight: 300, color: 'var(--text)', marginBottom: '72px', lineHeight: 1.1 }}>
            {T.howItWorks}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px' }}>
            {[
              { step: '01', title: T.step1title, desc: T.step1desc },
              { step: '02', title: T.step2title, desc: T.step2desc },
              { step: '03', title: T.step3title, desc: T.step3desc },
              { step: '04', title: T.step4title, desc: T.step4desc },
            ].map(item => (
              <div key={item.step}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 300, color: 'var(--border)', marginBottom: '16px', lineHeight: 1 }}>{item.step}</p>
                <div style={{ width: '32px', height: '1px', background: 'var(--border)', margin: '0 auto 16px' }} />
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, color: 'var(--text)', marginBottom: '12px' }}>{item.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.75 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section separator ── */}
      <section style={{ background: 'var(--header)', padding: '20px 40px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '12px' }}>
          {[T.strip3a, T.strip3b, T.strip3c].map(item => (
            <span key={item} style={{ fontSize: '12px', letterSpacing: '0.08em', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--text)', fontSize: '14px' }}>&#10003;</span>
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="reveal" style={{ background: '#fff', padding: '100px 40px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '20px' }}>
            {T.beginToday}
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '44px', fontWeight: 300, color: 'var(--text)', lineHeight: 1.15, marginBottom: '20px' }}>
            {T.ctaHeading}
          </h2>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '44px' }}>
            {T.ctaSubtext}
          </p>
          <Link href="/register" className="btn btn-primary" style={{ fontSize: '11px', padding: '16px 48px', letterSpacing: '0.14em', background: 'var(--header)', border: '1px solid var(--border)' }}>
            {T.scheduleCourse}
          </Link>
        </div>
      </section>

      {/* ── Verify strip ── */}
      <section style={{ background: 'var(--header)', padding: '28px 40px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontSize: '12px', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
          {T.verifyText}{' '}
          <Link href="/verify" style={{ color: 'var(--text)', borderBottom: '1px solid var(--border)' }}>
            {T.verifyCta}
          </Link>
        </p>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#fff', color: 'var(--text-muted)', padding: '56px 40px', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '24px', overflow: 'hidden', height: '38px', display: 'flex', justifyContent: 'center' }}>
          <img src="/GR_FINAL_FILES_transparent.png" alt="Gracefully Redefined" style={{ height: '52px', opacity: 0.6, display: 'block' }} />
        </div>
        <p style={{ fontSize: '12px', letterSpacing: '0.08em', marginBottom: '20px' }}>
          {T.copyright.replace('{year}', String(new Date().getFullYear()))}
        </p>
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { href: '/privacy', label: T.privacy },
            { href: '/terms', label: T.terms },
            { href: '/verify', label: T.verifyCert },
            { href: '/contact', label: T.contactUs },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {link.label}
            </Link>
          ))}
        </div>
      </footer>

    </div>
  )
}
