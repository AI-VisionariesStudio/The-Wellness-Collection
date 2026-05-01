'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 300, color: 'var(--text)', marginBottom: '16px' }}>
          Something went wrong
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px', lineHeight: 1.6 }}>
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          onClick={reset}
          className="btn btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
