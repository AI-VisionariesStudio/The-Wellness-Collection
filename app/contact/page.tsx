'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

export default function ContactPage() {
  const { lang } = useLanguage()
  const T = t[lang].contact
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || T.errorFallback)
      setLoading(false)
    } else {
      setSent(true)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', direction: dir }}>

      {/* Header band */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '56px 40px', textAlign: 'center' }}>
        <Link href="/" style={{ display: 'block' }}>
          <img
            src="/twc-logo.svg"
            alt="Gracefully Redefined"
            style={{ height: '180px', width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto 28px' }}
          />
        </Link>
        <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '14px' }}>
          {T.heading}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '44px', fontWeight: 300, color: 'var(--text)', marginBottom: '12px', lineHeight: 1.1 }}>
          Get in Touch
        </h1>
        <div style={{ width: '40px', height: '1px', background: 'var(--border)', margin: '0 auto 20px' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto' }}>
          {T.subtext}
        </p>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '64px 40px 80px' }}>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '60px 48px', background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 24px rgba(180,160,140,0.10)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--blush)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '22px', color: 'var(--text)' }}>✓</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 300, color: 'var(--text)', marginBottom: '12px' }}>
              {T.successHeading}
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '36px' }}>
              {T.successBody}
            </p>
            <Link href="/" className="btn btn-outline" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
              {T.backHome}
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div style={{ background: '#fef2f2', color: '#c0392b', padding: '12px 16px', borderRadius: '4px', marginBottom: '24px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <div style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 24px rgba(180,160,140,0.10)' }}>

              {/* Form header accent */}
              <div style={{ background: 'var(--header)', borderBottom: '1px solid var(--border)', padding: '20px 40px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>
                  Send a Message
                </p>
              </div>

              <div style={{ padding: '40px' }}>
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>{T.labelName}</label>
                      <input type="text" value={form.name} onChange={set('name')} placeholder={T.placeholderName} required />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>{T.labelEmail}</label>
                      <input type="email" value={form.email} onChange={set('email')} placeholder={T.placeholderEmail} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{T.labelSubject}</label>
                    <input type="text" value={form.subject} onChange={set('subject')} placeholder={T.placeholderSubject} required />
                  </div>

                  <div className="form-group">
                    <label>{T.labelMessage}</label>
                    <textarea
                      value={form.message}
                      onChange={set('message')}
                      placeholder={T.placeholderMessage}
                      required
                      rows={6}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%', justifyContent: 'center', fontSize: '11px', letterSpacing: '0.14em' }}
                  >
                    {loading ? T.sending : T.send}
                  </button>
                </form>
              </div>
            </div>

            {/* Direct email */}
            <div style={{ marginTop: '0', padding: '24px 40px', background: 'var(--header)', border: '1px solid var(--border)', borderTop: 'none', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', letterSpacing: '0.04em' }}>{T.orEmail}</p>
              <a href="mailto:support@gracefullyredefined.com" style={{ fontSize: '13px', color: 'var(--text)', letterSpacing: '0.04em', fontWeight: 500 }}>
                support@gracefullyredefined.com
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
