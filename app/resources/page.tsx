'use client'

import Link from 'next/link'

const PAID_RESOURCES = [
  {
    id: 'attachment-style',
    title: 'How Your Attachment Style Shows Up In Relationships',
    price: '$6.99',
    description: 'A gentle guide to understanding the patterns you carry into connection — and why they make so much sense.',
  },
  {
    id: 'wounds-we-carry',
    title: 'The Wounds We Carry',
    price: '$6.99',
    description: 'An honest, compassionate look at how early pain shapes the way we move through the world today.',
  },
  {
    id: 'emotional-neglect',
    title: 'Understanding Emotional Neglect',
    price: '$6.99',
    description: 'Exploring the quiet wound of what wasn\'t there — and what that absence may have taught you about yourself.',
  },
  {
    id: 'trauma-response',
    title: 'Recognizing Your Trauma Response',
    price: '$6.99',
    description: 'Learn to name what happens inside you under stress — and meet it with curiosity instead of judgment.',
  },
]

export default function ResourcesPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>

      <style>{`
        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 28px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 40px 100px;
        }
        .resource-card {
          background: #fff;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 40px 36px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: box-shadow 0.2s ease;
        }
        .resource-card:hover {
          box-shadow: var(--shadow-lg);
        }
        .resource-card.free {
          background: var(--cream);
          border-color: var(--border);
        }
        .resource-badge {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--mid);
        }
        .resource-badge.free-badge {
          color: var(--gold);
        }
        .resource-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 300;
          color: var(--text);
          line-height: 1.4;
          margin: 0;
        }
        .resource-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.75;
          flex: 1;
          margin: 0;
        }
        .resource-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
          margin-top: auto;
        }
        .resource-price {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 300;
          color: var(--text);
        }
        .resource-price.free-price {
          font-size: 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--gold);
          font-family: var(--font-body);
          font-weight: 400;
        }
        .resource-btn {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
          background: transparent;
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 10px 20px;
          cursor: default;
          font-family: var(--font-body);
        }
        .resource-btn.available {
          color: var(--text);
          border-color: var(--text);
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .resource-btn.available:hover {
          background: var(--text);
          color: #fff;
        }
        @media (max-width: 640px) {
          .resources-grid {
            grid-template-columns: 1fr;
            padding: 40px 20px 80px;
          }
        }
      `}</style>

      {/* Hero */}
      <section style={{ background: '#fff', paddingTop: '100px', textAlign: 'center' }}>
        <img
          src="/twc-logo.svg"
          alt="Gracefully Redefined"
          style={{ height: '200px', objectFit: 'contain', display: 'block', margin: '0 auto -90px', position: 'relative', zIndex: 2 }}
        />
        <div style={{ background: 'var(--cream)', padding: '110px 60px 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '28px' }}>
              The Wellness Collection
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 5.5vw, 56px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.1, marginBottom: '24px' }}>
              Resources
            </h1>
            <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '0 auto 28px' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '480px', margin: '0 auto' }}>
              Thoughtfully crafted tools to support your healing — at your own pace, in your own time.
            </p>
          </div>
        </div>
      </section>

      {/* Card Grid */}
      <div className="resources-grid">

        {/* Paid resource cards */}
        {PAID_RESOURCES.map(resource => (
          <div key={resource.id} className="resource-card">
            <p className="resource-badge">Digital Resource</p>
            <h2 className="resource-title">{resource.title}</h2>
            <p className="resource-desc">{resource.description}</p>
            <div className="resource-footer">
              <span className="resource-price">{resource.price}</span>
              <button className="resource-btn" disabled title="Coming soon">
                Available soon
              </button>
            </div>
          </div>
        ))}

        {/* Free resource card */}
        <div className="resource-card free">
          <p className="resource-badge free-badge">Complimentary</p>
          <h2 className="resource-title">21 Affirmation &amp; Grounding Cards</h2>
          <p className="resource-desc">
            Truth-based affirmations rooted in trauma recovery, attachment healing, and nervous system care — yours to explore freely.
          </p>
          <div className="resource-footer">
            <span className="resource-price free-price">Free</span>
            <Link href="/resources/affirmation-cards" className="resource-btn available">
              Explore the deck
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
