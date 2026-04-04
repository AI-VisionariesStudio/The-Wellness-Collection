'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useLanguage } from './LanguageContext'
import { t } from '@/lib/translations'

export default function HomeContent({ coursesHref }: { coursesHref: string }) {
  const { lang } = useLanguage()
  const T = t[lang].home
  const isHe = lang === 'he'
  const dir = isHe ? 'rtl' : 'ltr'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function captureLead() {
    const nameParts = name.trim().split(/\s+/)
    if (nameParts.length < 2 || !nameParts[1] || !email.trim() || !email.includes('@')) {
      setShowError(true)
      return
    }
    setShowError(false)
    setLoading(true)
    fetch('/api/leads/wellness', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: email.trim() }),
    }).catch(err => console.error('Lead capture error:', err)).finally(() => setLoading(false))
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)', direction: dir }}>

      <style>{`
        @media (max-width: 640px) {
          .hero-logo { height: 140px !important; margin-bottom: -60px !important; }
          .hero-body { padding: 80px 32px 60px !important; }
          .hero-title { font-size: 40px !important; }
          .how-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .strip-row { flex-direction: column !important; align-items: center !important; gap: 16px !important; }
        }
      `}</style>

      {/* ── Hero: oval logo floating above cream body ── */}
      <section style={{ background: 'var(--bg)', paddingTop: '100px', textAlign: 'center' }}>
        <img
          src="/twc-logo.svg"
          alt="Gracefully Redefined — The Wellness Collection"
          className="hero-logo"
          style={{ height: '200px', objectFit: 'contain', display: 'block', margin: '0 auto -90px', position: 'relative', zIndex: 2 }}
        />
        <div className="hero-body" style={{ background: 'var(--cream)', padding: '110px 60px 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ width: '260px', height: '44px', overflow: 'hidden' }}>
                <img src="/GR_FINAL_FILES_transparent.png" alt="Gracefully Redefined" style={{ width: '100%', height: 'auto' }} />
              </div>
            </div>
            <h1 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: 300, lineHeight: 1.1, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: '0' }}>
              {T.tagline}
            </h1>
            <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '36px auto' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '52px', whiteSpace: 'pre-line' }}>
              {T.hero}
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-primary" style={{ fontSize: '11px', padding: '15px 44px', letterSpacing: '0.16em', background: 'transparent', border: '1px solid var(--text)', color: 'var(--text)' }}>
                {T.beginJourney}
              </Link>
              <Link href={coursesHref} className="btn btn-outline" style={{ fontSize: '11px', padding: '15px 44px', letterSpacing: '0.16em', background: 'transparent', border: '1px solid var(--mid)', color: 'var(--text-muted)' }}>
                {T.viewCourses}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section style={{ background: 'var(--blush)', padding: '36px 40px' }}>
        <div className="strip-row" style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {[T.trust1, T.trust2, T.trust3].map(item => (
            <span key={item} style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--mid)', flexShrink: 0 }} />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ height: '1px', background: 'var(--border-light)', maxWidth: '560px', margin: '0 auto' }} />

      {/* ── Philosophy / Quote ── */}
      <section className="reveal" style={{ background: '#fff', padding: '120px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '28px' }}>
            {T.ourApproach}
          </p>
          <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.6, margin: '0 0 36px' }}>
            {T.quote}
          </blockquote>
          <p style={{ fontSize: '11px', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {T.quoteAttr}
          </p>
        </div>
      </section>

      {/* ── Cream interlude strip ── */}
      <section style={{ background: 'var(--cream)', padding: '40px 40px' }}>
        <div className="strip-row" style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {[T.strip2a, T.strip2b, T.strip2c].map(item => (
            <span key={item} style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--mid)', flexShrink: 0 }} />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="reveal" style={{ background: '#fff', padding: '120px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '20px' }}>
            {T.pathForward}
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '44px', fontWeight: 300, color: 'var(--text)', marginBottom: '80px', lineHeight: 1.1 }}>
            {T.howItWorks}
          </h2>
          <div className="how-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '56px' }}>
            {[
              { step: '01', title: T.step1title, desc: T.step1desc },
              { step: '02', title: T.step2title, desc: T.step2desc },
              { step: '03', title: T.step3title, desc: T.step3desc },
            ].map(item => (
              <div key={item.step}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 300, color: 'var(--border)', marginBottom: '20px', lineHeight: 1 }}>{item.step}</p>
                <div style={{ width: '28px', height: '1px', background: 'var(--mid)', margin: '0 auto 20px' }} />
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, color: 'var(--text)', marginBottom: '14px' }}>{item.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.8 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cream interlude strip ── */}
      <section style={{ background: 'var(--cream)', padding: '40px 40px' }}>
        <div className="strip-row" style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {[T.strip3a, T.strip3b, T.strip3c].map(item => (
            <span key={item} style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--mid)', flexShrink: 0 }} />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="reveal" style={{ background: '#fff', padding: '140px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '24px' }}>
            {T.beginToday}
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 300, color: 'var(--text)', lineHeight: 1.15, marginBottom: '24px', whiteSpace: 'normal' }}>
            {T.ctaHeading}
          </h2>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '52px' }}>
            {T.ctaSubtext}
          </p>
          <Link href="/register" className="btn btn-primary" style={{ fontSize: '11px', padding: '16px 52px', letterSpacing: '0.16em', background: 'transparent', border: '1px solid var(--text)', color: 'var(--text)' }}>
            {T.scheduleCourse}
          </Link>
        </div>
      </section>

      {/* ── Lead Capture ── */}
      <section className="reveal" style={{ background: 'var(--cream)', padding: '100px 40px' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '24px', textAlign: 'center' }}>
            Stay Connected
          </p>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 300, color: 'var(--text)', lineHeight: 1.15, marginBottom: '32px', textAlign: 'center' }}>
            Join Our Community
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.8, marginBottom: '32px', textAlign: 'center' }}>
            Get resource updates, wellness insights, and exclusive community access.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Your full name"
              autoComplete="name"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && captureLead()}
              data-lpignore="true"
              style={{ padding: '14px 16px', fontSize: '14px', border: '1px solid var(--border-light)', borderRadius: '0', fontFamily: 'var(--font-body)', background: '#fff', color: 'var(--text)' }}
            />
            <input
              type="email"
              placeholder="Your email address"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && captureLead()}
              data-lpignore="true"
              style={{ padding: '14px 16px', fontSize: '14px', border: '1px solid var(--border-light)', borderRadius: '0', fontFamily: 'var(--font-body)', background: '#fff', color: 'var(--text)' }}
            />
          </div>
          {showError && (
            <div style={{ color: '#c84644', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>
              Please enter your full name and a valid email to continue.
            </div>
          )}
          <button
            onClick={captureLead}
            disabled={loading}
            style={{ width: '100%', padding: '14px 20px', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', background: 'transparent', border: '1px solid var(--text)', color: 'var(--text)', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, fontFamily: 'var(--font-body)', fontWeight: 500 }}
          >
            {loading ? 'Subscribing…' : 'Subscribe'}
          </button>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '16px', textAlign: 'center', lineHeight: 1.6 }}>
            Your privacy is sacred here. No spam — ever.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#fff', color: 'var(--text-muted)', padding: '72px 40px 56px', textAlign: 'center', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ marginBottom: '28px', overflow: 'hidden', height: '40px', display: 'flex', justifyContent: 'center' }}>
          <img src="/GR_FINAL_FILES_transparent.png" alt="Gracefully Redefined" style={{ height: '54px', opacity: 0.5, display: 'block' }} />
        </div>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', marginBottom: '24px', color: 'var(--mid)' }}>
          {T.copyright.replace('{year}', String(new Date().getFullYear()))}
        </p>
        <div style={{ display: 'flex', gap: '36px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { href: '/privacy', label: T.privacy },
            { href: '/terms', label: T.terms },
            { href: '/contact', label: T.contactUs },
          ].map(link => (
            <Link key={link.href} href={link.href} style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {link.label}
            </Link>
          ))}
        </div>
      </footer>

    </div>
  )
}
