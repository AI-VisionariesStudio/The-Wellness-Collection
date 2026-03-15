'use client'
import { useState } from 'react'

const faqs = [
  {
    q: 'Can I access the course on my phone or tablet?',
    a: 'Yes. All courses are fully optimized for mobile, tablet, and desktop. You can switch devices at any time and your progress will stay exactly where you left off.',
  },
  {
    q: 'How long does the course take to complete?',
    a: 'Each course is self-paced. Most students complete it in one to three sittings. You can stop and resume at any time from any device.',
  },
  {
    q: 'When do I receive my certificate?',
    a: 'Your certificate is issued instantly the moment you complete the final lesson. You can download and print it immediately.',
  },
  {
    q: 'What if I need to pause and come back later?',
    a: 'Your progress is saved automatically. Simply sign back in and continue exactly where you left off — no need to restart.',
  },
  {
    q: 'How do I reset my password?',
    a: 'Click "Forgot password?" on the sign-in page. You will receive a reset link by email within a few minutes.',
  },
]

export default function FloatingHelp() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <>
      {/* Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '88px', right: '28px', zIndex: 1000,
          width: '340px', background: '#fff', borderRadius: '12px',
          border: '1px solid var(--border)', boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
          overflow: 'hidden', fontFamily: 'var(--font-body)',
          animation: 'fadeUp 0.2s ease forwards',
        }}>
          <div style={{ background: 'var(--header)', padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Common Questions
            </p>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, color: 'var(--text)', margin: 0 }}>
              How can we help?
            </h3>
          </div>
          <div>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '16px 24px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    gap: '12px', fontFamily: 'var(--font-body)',
                  }}
                >
                  <span style={{ fontSize: '14px', color: 'var(--text)', fontWeight: 500, lineHeight: 1.4 }}>
                    {faq.q}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '16px', flexShrink: 0, transition: 'transform 0.2s', transform: expanded === i ? 'rotate(45deg)' : 'none' }}>
                    +
                  </span>
                </button>
                {expanded === i && (
                  <div style={{ padding: '0 24px 16px', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ padding: '16px 24px', background: 'var(--header)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <a
              href="mailto:support@gracefullyredefined.com"
              style={{ fontSize: '12px', letterSpacing: '0.06em', color: 'var(--text-muted)', textDecoration: 'none', borderBottom: '1px solid var(--border)' }}
            >
              Still have questions? Email us →
            </a>
          </div>
        </div>
      )}

      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close help' : 'Open help'}
        style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 1000,
          width: '52px', height: '52px', borderRadius: '50%',
          background: open ? 'var(--text)' : 'var(--header)',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease',
          fontFamily: 'var(--font-body)',
        }}
      >
        <span style={{ fontSize: '20px', color: open ? '#fff' : 'var(--text)', lineHeight: 1, transition: 'all 0.2s' }}>
          {open ? '×' : '?'}
        </span>
      </button>
    </>
  )
}
