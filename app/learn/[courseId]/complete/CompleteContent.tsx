'use client'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

type Props = {
  courseId: string
  courseTitle: string
  certificateId?: string
  serialNumber?: string
}

export default function CompleteContent({ courseId, courseTitle, certificateId, serialNumber }: Props) {
  const { lang } = useLanguage()
  const T = t[lang].complete
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', direction: dir }}>
      <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>

        <div className="card" style={{ padding: '60px 48px' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--blush)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', fontSize: '36px' }}>
            &#127891;
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 300, color: 'var(--text)', marginBottom: '12px', lineHeight: 1.2 }}>
            {T.heading}
          </h1>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, fontStyle: 'italic', color: 'var(--gold)', marginBottom: '8px' }}>
            {courseTitle}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.7, marginBottom: '36px' }}>
            {T.congrats}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {certificateId ? (
              <a
                href={`/api/certificate?id=${certificateId}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-gold"
                style={{ justifyContent: 'center' }}
              >
                {T.downloadCert}
              </a>
            ) : (
              <a
                href={`/api/certificate`}
                className="btn btn-gold"
                style={{ justifyContent: 'center' }}
              >
                {T.generateCert}
              </a>
            )}
            <Link href={`/learn/${courseId}/reflection`} className="btn btn-outline" style={{ justifyContent: 'center' }}>
              {T.reflection}
            </Link>
            <Link href="/dashboard" className="btn btn-outline" style={{ justifyContent: 'center' }}>
              {T.backToDashboard}
            </Link>
          </div>

          {serialNumber && (
            <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--text-muted)' }}>
              Certificate #{serialNumber.slice(0, 8).toUpperCase()}
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
