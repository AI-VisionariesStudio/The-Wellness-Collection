'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

function ResetPasswordContent() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token')
  const { lang } = useLanguage()
  const T = t[lang].resetPassword
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', direction: dir }}>
        <div className="card" style={{ padding: '40px', maxWidth: '440px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{T.invalidLink}</p>
          <Link href="/forgot-password" className="btn btn-outline">{T.requestNew}</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError(T.errorMismatch); return }
    if (password.length < 8) { setError(T.errorTooShort); return }
    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    if (res.ok) {
      router.push('/login?reset=1')
    } else {
      setError(data.error || T.errorFallback)
      setLoading(false)
    }
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
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{T.subtext}</p>
        </div>
        <div className="card" style={{ padding: '40px' }}>
          {error && (
            <div style={{ background: '#fef2f2', color: '#c0392b', padding: '12px 16px', borderRadius: 'var(--radius)', marginBottom: '20px', fontSize: '14px' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{T.labelNew}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={T.placeholderNew} minLength={8} required />
            </div>
            <div className="form-group">
              <label>{T.labelConfirm}</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder={T.placeholderConfirm} minLength={8} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? T.saving : T.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
