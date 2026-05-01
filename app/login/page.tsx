'use client'
import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

function LoginPageContent() {
  const params = useSearchParams()
  const registered = params.get('registered')
  const reset = params.get('reset')
  const { lang } = useLanguage()
  const T = t[lang].login
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', { email, password, redirect: false })

    if (result?.error) {
      if (result.error === 'EMAIL_NOT_VERIFIED') {
        setError(T.errorNotVerified)
      } else {
        setError(T.errorInvalid)
      }
      setLoading(false)
    } else {
  window.location.href = '/dashboard'
}
  }

  return (
    <div suppressHydrationWarning style={{ minHeight: '100vh', background: 'var(--cream)', direction: dir }}>

      {/* White top — logo layers into cream below */}
      <div className="overlay-top">
        <Link href="/" style={{ display: 'block' }}>
          <img src="/twc-logo.svg" alt="Logo" className="overlay-logo" />
        </Link>
      </div>

      {/* Cream body */}
      <div className="overlay-body">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>
            The Wellness Collection
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '44px', fontWeight: 300, color: 'var(--text)', marginBottom: '0', lineHeight: 1.1 }}>
            {T.heading}
          </h1>
          <div style={{ width: '40px', height: '1px', background: 'var(--border)', margin: '20px auto 16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{T.subtext}</p>
        </div>
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 20px' }}>

        {registered && (
          <div style={{ background: '#e8f5ec', color: '#2d6a3f', padding: '14px 18px', marginBottom: '24px', fontSize: '14px', lineHeight: 1.6, border: '1px solid #c3e6cb' }}>
            {T.registeredNotice}
          </div>
        )}
        {reset && (
          <div style={{ background: '#e8f5ec', color: '#2d6a3f', padding: '14px 18px', marginBottom: '24px', fontSize: '14px', border: '1px solid #c3e6cb' }}>
            {T.resetNotice}
          </div>
        )}
        {error && (
          <div style={{ background: '#fef2f2', color: '#c0392b', padding: '14px 18px', marginBottom: '24px', fontSize: '14px', lineHeight: 1.6, border: '1px solid #f5c6cb' }}>
            {error}
          </div>
        )}

        <div suppressHydrationWarning style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 24px rgba(180,160,140,0.10)' }}>

          {/* Form header accent */}
          <div style={{ background: 'var(--header)', borderBottom: '1px solid var(--border)', padding: '18px 40px' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>
              Sign In to Your Account
            </p>
          </div>

          <div style={{ padding: '40px' }}>
            <form suppressHydrationWarning onSubmit={handleSubmit}>
              <div suppressHydrationWarning className="form-group">
                <label>{T.labelEmail}</label>
                <input suppressHydrationWarning type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required data-lpignore="true" />
              </div>
              <div suppressHydrationWarning className="form-group" style={{ marginBottom: '8px' }}>
                <label>{T.labelPassword}</label>
                <input suppressHydrationWarning type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required data-lpignore="true" />
              </div>
              <div style={{ textAlign: 'right', marginBottom: '28px' }}>
                <Link href="/forgot-password" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {T.forgotPassword}
                </Link>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                {loading ? T.signingIn : T.signIn}
              </button>
            </form>
          </div>
        </div>

        {/* Create account footer */}
        <div style={{ marginTop: '0', padding: '20px 40px', background: 'var(--header)', border: '1px solid var(--border)', borderTop: 'none', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            {T.noAccount}{' '}
            <Link href="/register" style={{ color: 'var(--text)', fontWeight: 500 }}>{T.createOne}</Link>
          </p>
        </div>

        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
