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
          .cs-logo {
            height: 120px !important;
            margin-bottom: -50px !important;
          }
          .cs-body {
            padding: 68px 24px 52px !important;
          }
          .cs-title {
            font-size: clamp(22px, 7vw, 40px) !important;
            white-space: normal !important;
            word-break: break-word !important;
          }
          .cs-wordmark {
            width: 200px !important;
          }
          .cs-form {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .cs-form input {
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .cs-form button {
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .cs-strips {
            flex-direction: column !important;
            align-items: center !important;
            gap: 16px !important;
            padding: 0 !important;
          }
          .cs-success {
            padding: 24px 20px !important;
          }
        }
      `}</style>

      {/* ── Above-fold wrapper: hero + trust strip fill exactly the viewport ── */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Hero ── */}
      <section style={{ background: '#fff', paddingTop: '100px', textAlign: 'center', flex: 1 }}>
        <img
          src="/twc-logo.png"
          alt="Gracefully Redefined"
          className="cs-logo"
          style={{ height: '200px', objectFit: 'contain', display: 'block', margin: '0 auto -90px', position: 'relative', zIndex: 2 }}
        />
        <div className="cs-body" style={{ background: 'var(--cream)', padding: '110px 60px 88px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>

            {/* Wordmark */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div className="cs-wordmark" style={{ width: '240px', height: '40px', overflow: 'hidden' }}>
                <img src="/GR_FINAL_FILES_transparent.png" alt="Gracefully Redefined" style={{ width: '100%', height: 'auto' }} />
              </div>
            </div>

            <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '32px' }}>
              The Wellness Collection
            </p>

            <h1
              className="cs-title"
              style={{ fontFamily: 'var(--font-display)', fontSize: '54px', fontWeight: 300, lineHeight: 1.1, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: '0', whiteSpace: 'nowrap' as const }}
            >
              Something beautiful is coming.
            </h1>

            <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '36px auto' }} />

            {/* Email capture */}
            {status === 'done' ? (
              <div className="cs-success" style={{ background: 'var(--blush)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px 36px' }}>
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
          <span style={{ fontSize: '14px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            The Wellness Collection
          </span>
        </div>
      </section>

      </div>{/* ── end above-fold wrapper ── */}

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

    </div>
  )
}
