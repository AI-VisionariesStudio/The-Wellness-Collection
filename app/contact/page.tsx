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
      <div className="overlay-top" style={{ padding: '32px 40px 0' }}>
        <Link href="/" style={{ display: 'block' }}>
          <img src="/twc-logo.svg" alt="Gracefully Redefined" className="overlay-logo" style={{ height: '130px', marginBottom: '-60px' }} />
        </Link>
      </div>

      {/* Cream body */}
      <div className="overlay-body" style={{ paddingTop: '50px', paddingBottom: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
            {T.heading}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 300, color: 'var(--text)', marginBottom: '8px', lineHeight: 1.1 }}>
            Get in Touch
          </h1>
          <div style={{ width: '32px', height: '1px', background: 'var(--border)', margin: '0 auto' }} />
        </div>

        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '0 20px' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '40px', background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 24px rgba(180,160,140,0.10)' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--blush)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '18px', color: 'var(--text)' }}>✓</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 300, color: 'var(--text)', marginBottom: '8px' }}>
                {T.successHeading}
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                {T.successBody}
              </p>
              <Link href="/" className="btn btn-outline" style={{ fontSize: '11px', letterSpacing: '0.12em' }}>
                {T.backHome}
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div style={{ background: '#fef2f2', color: '#c0392b', padding: '8px 12px', borderRadius: '4px', marginBottom: '10px', fontSize: '13px' }}>
                  {error}
                </div>
              )}

              <div style={{ background: '#fff', border: '1px solid var(--border)', boxShadow: '0 2px 24px rgba(180,160,140,0.10)' }}>
                <div style={{ background: 'var(--header)', borderBottom: '1px solid var(--border)', padding: '10px 22px' }}>
                  <p style={{ fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>
                    Send a Message
                  </p>
                </div>

                <div style={{ padding: '16px 22px' }}>
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ marginBottom: '3px' }}>{T.labelName}</label>
                        <input type="text" value={form.name} onChange={set('name')} placeholder={T.placeholderName} required style={{ padding: '9px 12px' }} />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ marginBottom: '3px' }}>{T.labelEmail}</label>
                        <input type="email" value={form.email} onChange={set('email')} placeholder={T.placeholderEmail} required style={{ padding: '9px 12px' }} />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <label style={{ marginBottom: '3px' }}>{T.labelSubject}</label>
                      <input type="text" value={form.subject} onChange={set('subject')} placeholder={T.placeholderSubject} required style={{ padding: '9px 12px' }} />
                    </div>

                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label style={{ marginBottom: '3px' }}>{T.labelMessage}</label>
                      <textarea
                        value={form.message}
                        onChange={set('message')}
                        placeholder={T.placeholderMessage}
                        required
                        rows={2}
                        style={{ resize: 'none', padding: '9px 12px' }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                      style={{ width: '100%', justifyContent: 'center', fontSize: '11px', letterSpacing: '0.14em', padding: '10px' }}
                    >
                      {loading ? T.sending : T.send}
                    </button>
                  </form>
                </div>
              </div>

              <div style={{ padding: '12px 22px', background: 'var(--header)', border: '1px solid var(--border)', borderTop: 'none', textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px', letterSpacing: '0.04em' }}>{T.orEmail}</p>
                <a href="mailto:support@gracefullyredefined.com" style={{ fontSize: '12px', color: 'var(--text)', letterSpacing: '0.04em', fontWeight: 500 }}>
                  support@gracefullyredefined.com
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      <TickerBanner bg="#fff" />
    </div>
  )
}
