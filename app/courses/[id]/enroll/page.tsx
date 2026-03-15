'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EnrollPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.url) {
          window.location.href = data.url
        } else {
          setError(data.error || 'Unable to start checkout.')
        }
      })
      .catch(() => setError('Something went wrong. Please try again.'))
  }, [courseId])

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '40px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--text)', marginBottom: '20px' }}>{error}</p>
          <button onClick={() => router.back()} className="btn btn-outline">← Go Back</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 300, color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
          Preparing your checkout…
        </p>
      </div>
    </div>
  )
}
