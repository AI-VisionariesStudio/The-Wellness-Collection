'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

export default function RegisterPage() {
  const router = useRouter()
  const { lang } = useLanguage()
  const T = t[lang].register
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || T.errorFallback)
      setLoading(false)
    } else {
      router.push('/verify-email?sent=1')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--cream)', direction: dir }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/">
            <img src="/GR-LOGO-OVAL.JPG" alt="Gracefully Redefined" style={{ height: '120px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--navy)', marginTop: '24px', marginBottom: '8px', fontWeight: 500 }}>
            {T.heading}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>{T.subtext}</p>
        </div>

        <div className="card" style={{ padding: '40px' }}>
          {error && (
            <div style={{ background: '#fef2f2', color: '#c0392b', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{T.labelName}</label>
              <input type="text" value={form.name} onChange={set('name')} placeholder={T.placeholderName} required data-lpignore="true" />
            </div>
            <div className="form-group">
              <label>{T.labelEmail}</label>
              <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required data-lpignore="true" />
            </div>
            <div className="form-group">
              <label>{T.labelPassword}</label>
              <input type="password" value={form.password} onChange={set('password')} placeholder={T.placeholderPassword} minLength={8} required data-lpignore="true" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? T.creating : T.submit}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '14px' }}>
          {T.haveAccount}{' '}<Link href="/login" style={{ color: 'var(--navy)', fontWeight: 500 }}>{T.signIn}</Link>
        </p>
      </div>
    </div>
  )
}
