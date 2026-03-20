'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

export default function VerifyPage() {
  const { lang } = useLanguage()
  const T = t[lang].verify
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  const [serial, setSerial] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const res = await fetch(`/api/certificate?serial=${encodeURIComponent(serial.trim())}`)
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 40px', direction: dir }}>
      <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--navy)', fontWeight: 600, marginBottom: '60px' }}>
        Gracefully Redefined
      </Link>

      <div style={{ width: '100%', maxWidth: '560px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: 'var(--navy)', marginBottom: '12px', fontWeight: 500 }}>
            {T.heading}
          </h1>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {T.subtext}
          </p>
        </div>

        <div className="card" style={{ padding: '40px', marginBottom: '24px' }}>
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label>{T.label}</label>
              <input
                type="text"
                value={serial}
                onChange={e => setSerial(e.target.value)}
                placeholder={T.placeholder}
                required
                style={{ fontFamily: 'monospace', fontSize: '14px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? T.verifying : T.submit}
            </button>
          </form>
        </div>

        {result && (
          <div className="card fade-up" style={{
            padding: '32px',
            borderLeft: `4px solid ${result.valid ? 'var(--success)' : '#c0392b'}`
          }}>
            {result.valid ? (
              <>
                <div className="badge badge-success" style={{ marginBottom: '20px', fontSize: '14px' }}>
                  {T.verified}
                </div>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {[
                    { label: T.issuedTo, value: result.issuedTo },
                    { label: T.courseCompleted, value: result.course },
                    { label: T.hoursLabel, value: `${result.hours} ${T.hoursUnit}` },
                    { label: T.dateIssued, value: new Date(result.issuedAt).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                    { label: T.serialNumber, value: result.serialNumber },
                  ].filter(Boolean).map((item: any) => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{item.label}</span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--navy)' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="badge" style={{ background: '#fef2f2', color: '#c0392b', marginBottom: '16px' }}>
                  {T.notFound}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                  {T.notFoundMsg}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
