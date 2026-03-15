'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html>
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', fontFamily: 'sans-serif' }}>
          <div style={{ textAlign: 'center', maxWidth: '480px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 300, color: '#2c2c2c', marginBottom: '16px' }}>
              Something went wrong
            </h2>
            <p style={{ color: '#888', fontSize: '15px', marginBottom: '32px', lineHeight: 1.6 }}>
              {error.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={reset}
              style={{ padding: '12px 28px', background: '#2c2c2c', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', cursor: 'pointer' }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
