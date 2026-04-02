'use client'

export default function ComingSoonPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>

      <style>{`
        @media (max-width: 640px) {
          .hero-logo { height: 140px !important; margin-bottom: -60px !important; }
          .hero-body { padding: 80px 32px 60px !important; }
          .hero-title { font-size: 40px !important; white-space: normal !important; }
          .strip-row { flex-direction: column !important; align-items: center !important; gap: 16px !important; }
        }
      `}</style>

      {/* ── Above-fold: hero fills exactly the viewport ── */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* ── Hero ── */}
        <section style={{ flex: 1, background: 'var(--bg)', paddingTop: '100px', textAlign: 'center' }}>
          <img
            src="/twc-logo.png"
            alt="Gracefully Redefined — The Wellness Collection"
            className="hero-logo"
            style={{ height: '200px', objectFit: 'contain', display: 'block', margin: '0 auto -90px', position: 'relative', zIndex: 2 }}
          />
          <div className="hero-body" style={{ background: 'var(--cream)', padding: '110px 60px 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <div style={{ width: '260px', height: '44px', overflow: 'hidden' }}>
                  <img src="/GR_FINAL_FILES_transparent.png" alt="Gracefully Redefined" style={{ width: '100%', height: 'auto' }} />
                </div>
              </div>
              <h1 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: 300, lineHeight: 1.1, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: '0', whiteSpace: 'nowrap' }}>
                Something beautiful is coming.
              </h1>
              <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '36px auto' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '0' }}>
                A platform for healing, clarity, and moving forward with intention.
              </p>
            </div>
          </div>
        </section>

      </div>{/* ── end above-fold ── */}

      {/* ── Divider ── */}
      <div style={{ height: '1px', background: 'var(--border-light)', maxWidth: '560px', margin: '0 auto' }} />

      {/* ── Quote ── */}
      <section style={{ background: '#fff', padding: '120px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '28px' }}>
            Our approach
          </p>
          <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text)', lineHeight: 1.6, margin: '0 0 36px' }}>
            "Healing isn't linear — but understanding yourself is always the right first step."
          </blockquote>
          <p style={{ fontSize: '11px', letterSpacing: '0.14em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Gracefully Redefined
          </p>
        </div>
      </section>

      {/* ── Cream strip ── */}
      <section style={{ background: 'var(--cream)', padding: '40px 40px' }}>
        <div className="strip-row" style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {['Compassion', 'Growth', 'Resilience'].map(item => (
            <span key={item} style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--mid)', flexShrink: 0 }} />
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── Blush strip — bottom of page ── */}
      <section style={{ background: 'var(--blush)', padding: '36px 40px', textAlign: 'center' }}>
        <span style={{ fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          The Wellness Collection
        </span>
      </section>

    </div>
  )
}
