'use client'
import { useState, Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

function VerifyEmailContent() {
  const params = useSearchParams()
  const token = params.get('token')
  const sent = params.get('sent')
  const { lang } = useLanguage()
  const T = t[lang].verifyEmail
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) return
    setStatus('verifying')
    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setStatus('success')
        else { setStatus('error'); setMessage(data.error || 'Verification failed.') }
      })
      .catch(() => { setStatus('error'); setMessage('Something went wrong. Please try again.') })
  }, [token])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--cream)', direction: dir }}>
      <div style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
        <Link href="/">
          <img src="/twc-logo.svg" alt="Logo" style={{ height: '100px', objectFit: 'contain', marginBottom: '32px' }} />
        </Link>
        {sent && !token && (
          <div className="card" style={{ padding: '40px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, color: 'var(--text)', marginBottom: '12px' }}>
              {T.sentHeading}
            </h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>{T.sentBody}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              {T.sentFooter}{' '}
              <Link href="/login" style={{ color: 'var(--text)', fontWeight: 500 }}>{T.returnToLogin}</Link>.
            </p>
          </div>
        )}
        {status === 'success' && (
          <div className="card" style={{ padding: '40px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, color: 'var(--text)', marginBottom: '12px' }}>
              {T.successHeading}
            </h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '28px' }}>{T.successBody}</p>
            <Link href="/login" className="btn btn-primary" style={{ display: 'inline-block' }}>{T.signIn}</Link>
          </div>
        )}
        {status === 'error' && (
          <div className="card" style={{ padding: '40px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, color: 'var(--text)', marginBottom: '12px' }}>
              {T.errorHeading}
            </h1>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '28px' }}>{message}</p>
            <Link href="/login" className="btn btn-outline" style={{ display: 'inline-block' }}>{T.backToLogin}</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
