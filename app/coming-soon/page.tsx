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
      const res = await fetch('/api/leads/wellness', {
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
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>

      <style>{`
        @media (max-width: 640px) {
          .hero-logo { height: 140px !important; margin-bottom: -60px !important; }
          .hero-body { padding: 60px 32px 28px !important; margin-left: -20px !important; margin-right: -20px !important; }
          .hero-title { font-size: 40px !important; white-space: normal !important; }
          .cs-form { flex-direction: column !important; }
          .cs-form input { width: 100% !important; }
          .cs-footer-label { display: block !important; text-align: center !important; text-indent: 0.22em !important; }
          .cs-form-area { padding: 20px 24px 24px !important; }
        }
      `}</style>

      {/* ── Above-fold: hero fills exactly the viewport ── */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* ── Hero ── */}
        <section style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: 'var(--bg)', paddingTop: '100px', textAlign: 'center' }}>
          <img
            src="/twc-logo.svg"
            alt="Gracefully Redefined — The Wellness Collection"
            className="hero-logo"
            style={{ height: '200px', objectFit: 'contain', display: 'block', margin: '0 auto -90px', position: 'relative', zIndex: 2 }}
          />
          <div className="hero-body" style={{ background: '#fff', padding: '110px 60px 48px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ width: '260px', height: '44px', overflow: 'hidden' }}>
                  <img src="/GR_FINAL_FILES_transparent.png" alt="Gracefully Redefined" style={{ width: '100%', height: 'auto' }} />
                </div>
              </div>
              <h1 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: 100, lineHeight: 1.1, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: '0', whiteSpace: 'nowrap' }}>
                Something beautiful is coming.
              </h1>
              <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '36px auto' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '0' }}>
                Structured courses for self-awareness, relational clarity, and becoming who you want to be.
              </p>
            </div>
          </div>

          {/* Email capture ── sits on var(--bg), outside the white block */}
          <div className="cs-form-area" style={{ background: 'var(--bg)', padding: '52px 60px 80px', textAlign: 'center' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
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

        {/* ── Blush strip — pinned inside the 100vh container ── */}
        <section style={{ background: 'var(--blush)', padding: '28px 40px', textAlign: 'center', flexShrink: 0 }}>
          <span className="cs-footer-label" style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            The Wellness Collection
          </span>
          <div style={{ marginTop: '12px' }}>
            <a
              href="/login"
              style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'none', opacity: 0.35 }}
            >
              –
            </a>
          </div>
        </section>

      </div>{/* ── end above-fold ── */}

    </div>
  )
}
