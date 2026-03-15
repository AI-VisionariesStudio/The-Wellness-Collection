'use client'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

export default function WorkbooksPage() {
  const { lang } = useLanguage()
  const T = t[lang].workbooks
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '80px 40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 400, marginBottom: '24px' }}>{T.title}</h1>
        <p style={{ fontSize: '17px', lineHeight: 1.8, color: 'var(--text-muted)' }}>{T.body}</p>
      </div>
    </div>
  )
}
