import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px' }}>
          404
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '42px', fontWeight: 300, color: 'var(--text)', marginBottom: '16px' }}>
          Page not found
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px', lineHeight: 1.6 }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </div>
  )
}
