'use client'
import { useState } from 'react'
import TickerBanner from '@/app/components/TickerBanner'

export default function ComingSoonPage() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/leads/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `${firstName.trim()} ${lastName.trim()}`, email: email.trim() }),
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
          .hero-logo { height: 80px !important; margin-bottom: -34px !important; }
          .hero-body { padding: 38px 20px 12px !important; }
          .hero-title { font-size: 26px !important; white-space: normal !important; }
          .cs-form { flex-direction: column !important; align-items: center !important; }
          .cs-form input, .cs-form button { width: 100% !important; max-width: 320px !important; box-sizing: border-box !important; }
          .cs-footer-label { display: block !important; text-align: center !important; text-indent: 0.22em !important; }
          .cs-form-area { padding: 48px 20px 14px !important; }
        }
      `}</style>

      {/* ── Above-fold: hero fills exactly the viewport ── */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* ── Hero ── */}
        <section style={{ flex: 1, minHeight: 0, overflowY: 'auto', background: 'var(--bg)', paddingTop: '44px', textAlign: 'center' }}>
          <img
            src="/twc-logo.svg"
            alt="Gracefully Redefined — The Wellness Collection"
            className="hero-logo"
            style={{ height: '130px', objectFit: 'contain', display: 'block', margin: '0 auto -54px', position: 'relative', zIndex: 2 }}
          />
          <div className="hero-body" style={{ background: '#fff', padding: '58px 60px 16px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
                <div style={{ width: '260px', height: '44px', overflow: 'hidden' }}>
                  <img src="/GR_FINAL_FILES_transparent.png" alt="Gracefully Redefined" style={{ width: '100%', height: 'auto' }} />
                </div>
              </div>
              <h1 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: '50px', fontWeight: 100, lineHeight: 1.1, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: '0', whiteSpace: 'nowrap' }}>
                Something beautiful is coming.
              </h1>
              <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '12px auto' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '0' }}>
                Therapist-created psychoeducation on attachment,<br />
                the ways you've learned to protect yourself,<br />
                and who you are becoming in your relationships.
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.65, marginTop: '10px', marginBottom: '0' }}>
                Be the first to know when the doors open — and receive an introduction to the work as we prepare to begin.
              </p>
            </div>
          </div>

          {/* Email capture ── sits on var(--bg), outside the white block */}
          <div className="cs-form-area" style={{ background: 'var(--bg)', padding: '16px 60px 20px', textAlign: 'center' }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              {status === 'done' ? (
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', margin: '0 0 20px' }}>
                    Gracefully Redefined
                  </p>
                  <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '0 auto 28px' }} />
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 300, color: 'var(--text)', margin: '0 0 16px', lineHeight: 1.2 }}>
                    You&apos;re on the list.
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', margin: '0 0 28px', lineHeight: 1.75 }}>
                    We&apos;ll be in touch the moment we open our doors.
                  </p>
                  <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '0 auto 28px' }} />
                  <button
                    onClick={() => { setStatus('idle'); setFirstName(''); setLastName(''); setEmail('') }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', opacity: 0.55 }}
                  >
                    ← Use a different email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="cs-form" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
                    <input
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      required
                      style={{
                        padding: '10px 16px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        color: 'var(--text)',
                        background: '#fff',
                        outline: 'none',
                        width: '160px',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      required
                      style={{
                        padding: '10px 16px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        color: 'var(--text)',
                        background: '#fff',
                        outline: 'none',
                        width: '160px',
                      }}
                    />
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      style={{
                        padding: '10px 16px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        color: 'var(--text)',
                        background: '#fff',
                        outline: 'none',
                        width: '220px',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      style={{
                        padding: '10px 28px',
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
                      {status === 'loading' ? 'Saving…' : 'Join the waitlist'}
                    </button>
                  </div>
                  {status === 'error' && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                      Something went wrong — please try again.
                    </p>
                  )}
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.04em', marginTop: '6px' }}>
                    You'll receive meaningful emails. Never noise. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        <TickerBanner />

        {/* ── Blush strip — pinned inside the 100vh container ── */}
        <section style={{ background: 'var(--blush)', padding: '14px 40px', textAlign: 'center', flexShrink: 0 }}>
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
