'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'
import TickerBanner from '@/app/components/TickerBanner'

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

      {/* White top — logo layers into cream below */}
      <div className="overlay-top" style={{ padding: '40px 40px 0' }}>
        <Link href="/" style={{ display: 'block' }}>
          <img src="/twc-logo.svg" alt="Gracefully Redefined" className="overlay-logo" style={{ height: '140px', marginBottom: '-64px' }} />
        </Link>
      </div>

      {/* Cream body */}
      <div className="overlay-body" style={{ paddingTop: '76px', paddingBottom: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
            {T.heading}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 300, color: 'var(--text)', marginBottom: '10px', lineHeight: 1.1 }}>
            Get in Touch
          </h1>
          <div style={{ width: '40px', height: '1px', background: 'var(--border)', margin: '0 auto 14px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto' }}>
            {T.subtext}
          </p>
        </div>

        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 20px' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '48px', background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 24px rgba(180,160,140,0.10)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--blush)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '20px', color: 'var(--text)' }}>✓</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 300, color: 'var(--text)', marginBottom: '10px' }}>
                {T.successHeading}
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '28px' }}>
                {T.successBody}
              </p>
              <Link href="/" className="btn btn-outline" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
                {T.backHome}
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px' }}>
                  {error}
                </div>
              )}

              <div style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 24px rgba(180,160,140,0.10)' }}>
                <div style={{ background: 'var(--header)', borderBottom: '1px solid var(--border)', padding: '14px 28px' }}>
                  <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>
                    Send a Message
                  </p>
                </div>

                <div style={{ padding: '24px 28px' }}>
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label>{T.labelName}</label>
                        <input type="text" value={form.name} onChange={set('name')} placeholder={T.placeholderName} required />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label>{T.labelEmail}</label>
                        <input type="email" value={form.email} onChange={set('email')} placeholder={T.placeholderEmail} required />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '14px' }}>
                      <label>{T.labelSubject}</label>
                      <input type="text" value={form.subject} onChange={set('subject')} placeholder={T.placeholderSubject} required />
                    </div>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label>{T.labelMessage}</label>
                      <textarea
                        value={form.message}
                        onChange={set('message')}
                        placeholder={T.placeholderMessage}
                        required
                        rows={3}
                        style={{ resize: 'none' }}
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

              <div style={{ padding: '18px 28px', background: 'var(--header)', border: '1px solid var(--border)', borderTop: 'none', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', letterSpacing: '0.04em' }}>{T.orEmail}</p>
                <a href="mailto:support@gracefullyredefined.com" style={{ fontSize: '13px', color: 'var(--text)', letterSpacing: '0.04em', fontWeight: 500 }}>
                  support@gracefullyredefined.com
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      <TickerBanner />
    </div>
  )
}
