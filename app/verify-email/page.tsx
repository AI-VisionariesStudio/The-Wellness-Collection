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
    <div style={{ minHeight: '100vh', background: 'var(--cream)', direction: dir }}>

      {/* White top — logo layers into cream below */}
      <div style={{ background: '#fff', padding: '64px 40px 0', textAlign: 'center' }}>
        <Link href="/" style={{ display: 'block' }}>
          <img src="/twc-logo.svg" alt="Logo" style={{ height: '180px', width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto -80px', position: 'relative', zIndex: 2 }} />
        </Link>
      </div>

      {/* Cream body */}
      <div style={{ background: 'var(--cream)', paddingTop: '100px', paddingBottom: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '440px', padding: '0 40px', textAlign: 'center' }}>
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
