'use client'
import { useState } from 'react'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'var(--font-body)' }}>
      <style>{`
        @media (max-width: 640px) {
          .cs-logo { height: 130px !important; margin-bottom: -55px !important; }
          .cs-body { padding: 72px 28px 64px !important; }
          .cs-title { font-size: 38px !important; }
          .cs-form { flex-direction: column !important; }
          .cs-form input { width: 100% !important; }
          .cs-strips { flex-direction: column !important; gap: 20px !important; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section style={{ background: '#fff', paddingTop: '100px', textAlign: 'center' }}>
        <img
          src="/GR-LOGO-OVAL.JPG"
          alt="Gracefully Redefined"
          className="cs-logo"
          style={{ height: '200px', objectFit: 'contain', display: 'block', margin: '0 auto -90px', position: 'relative', zIndex: 2, mixBlendMode: 'multiply' }}
        />
        <div className="cs-body" style={{ background: 'var(--cream)', padding: '110px 60px 88px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>

            {/* Wordmark */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ width: '240px', height: '40px', overflow: 'hidden' }}>
                <img src="/GR_FINAL_FILES_transparent.png" alt="Gracefully Redefined" style={{ width: '100%', height: 'auto' }} />
              </div>
            </div>

            <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '32px' }}>
              The Wellness Collection
            </p>

            <h1
              className="cs-title"
              style={{ fontFamily: 'var(--font-display)', fontSize: '54px', fontWeight: 300, lineHeight: 1.1, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: '0' }}
            >
              Something beautiful<br />is coming.
            </h1>

            <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '36px auto' }} />

            <p style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '52px' }}>
              A psychoeducational platform for healing, clarity,<br />and moving forward with intention.
            </p>

            {/* Email capture */}
            {status === 'done' ? (
              <div style={{ background: 'var(--blush)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 36px' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, color: 'var(--text)', margin: '0 0 8px' }}>
                  You're on the list.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
                  We'll reach out as soon as we launch. Thank you for being here.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="cs-form" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <input
                    type="text"
                    placeholder="Your first name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    style={{
                      padding: '13px 20px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--text)',
                      background: '#fff',
                      outline: 'none',
                      width: '180px',
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{
                      padding: '13px 20px',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--text)',
                      background: '#fff',
                      outline: 'none',
                      width: '240px',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      padding: '13px 32px',
                      background: 'transparent',
                      border: '1px solid var(--text)',
                      borderRadius: 'var(--radius)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: 'var(--text)',
                      cursor: status === 'loading' ? 'default' : 'pointer',
                    }}
                  >
                    {status === 'loading' ? 'Saving…' : 'Notify Me →'}
                  </button>
                </div>
                {status === 'error' && (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Something went wrong — please try again.
                  </p>
                )}
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.04em', marginTop: '6px' }}>
                  No spam. Ever. Just a note when we open the doors.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <section style={{ background: 'var(--blush)', padding: '32px 40px' }}>
        <div className="cs-strips" style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {[
            'Attachment-informed',
            'Trauma-aware',
            'Nervous system grounded',
          ].map(item => (
            <span key={item} style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--mid)', flexShrink: 0 }} />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── Quote ── */}
      <section style={{ background: '#fff', padding: '100px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '28px' }}>
            Our approach
          </p>
          <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.65, margin: '0 0 32px' }}>
            "Healing isn't linear — but understanding yourself is always the right first step."
          </blockquote>
          <p style={{ fontSize: '11px', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Gracefully Redefined
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#fff', padding: '48px 40px', textAlign: 'center', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ marginBottom: '20px', overflow: 'hidden', height: '36px', display: 'flex', justifyContent: 'center' }}>
          <img src="/GR_FINAL_FILES_transparent.png" alt="Gracefully Redefined" style={{ height: '48px', opacity: 0.4, display: 'block' }} />
        </div>
        <p style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--mid)', margin: '0 0 16px' }}>
          © {new Date().getFullYear()} Gracefully Redefined · The Wellness Collection
        </p>
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'center' }}>
          {[
            { href: '/privacy', label: 'Privacy' },
            { href: '/terms', label: 'Terms' },
            { href: '/contact', label: 'Contact' },
          ].map(link => (
            <a key={link.href} href={link.href} style={{ color: 'var(--text-muted)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}>
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}
