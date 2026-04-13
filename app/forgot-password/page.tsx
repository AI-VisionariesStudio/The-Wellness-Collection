'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

export default function ForgotPasswordPage() {
  const { lang } = useLanguage()
  const T = t[lang].forgotPassword
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--cream)', direction: dir }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ display: 'block' }}>
            <img src="/twc-logo.svg" alt="Logo" style={{ height: '180px', width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto 28px' }} />
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 300, color: 'var(--text)', marginTop: '24px', marginBottom: '8px' }}>
            {T.heading}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            {T.subtext}
          </p>
        </div>

        <div className="card" style={{ padding: '40px' }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>✉️</div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, color: 'var(--text)', marginBottom: '12px' }}>
                {T.sentHeading}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.7 }}>
                {T.sentBody.replace('{email}', email)}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{T.labelEmail}</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {loading ? T.sending : T.send}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
          <Link href="/login" style={{ color: 'var(--text)', fontWeight: 500 }}>{T.backToLogin}</Link>
        </p>
      </div>
    </div>
  )
}
