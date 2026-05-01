'use client'

import Link from 'next/link'
import TickerBanner from '@/app/components/TickerBanner'

const PAID_RESOURCES = [
  {
    id: 'understanding-attachment-style',
    title: 'Understanding Your Attachment Style',
    subtitle: 'A Psychoeducational Guide to How You Love, Connect & Protect',
    price: '$6.99',
    description: 'A compassionate exploration of how your earliest experiences shaped the way you love — and how those patterns can change.',
  },
  {
    id: 'how-attachment-shows-up',
    title: 'How Your Attachment Style Shows Up in Relationships',
    subtitle: 'A Guide to Your Communication, Conflict & Intimacy Patterns',
    price: '$6.99',
    description: 'Move from awareness to recognition — see exactly how your attachment style lives in your daily communication, conflict, and closeness.',
  },
  {
    id: 'wounds-we-carry',
    title: 'The Wounds We Carry',
    subtitle: 'How Early Childhood Experiences Shape Adult Relationships',
    price: '$6.99',
    description: 'Gently trace the thread between who you were asked to be as a child and the patterns you carry into relationships today.',
  },
  {
    id: 'boundaries-and-attachment',
    title: 'Boundaries and Attachment',
    subtitle: 'Why Setting Limits Feels So Hard',
    price: '$6.99',
    description: 'Understand why saying no activates your nervous system — and how to build boundaries that actually hold.',
  },
  {
    id: 'understanding-emotional-neglect',
    title: 'Understanding Emotional Neglect',
    subtitle: 'The Wound You Can\'t Always See',
    price: '$6.99',
    description: 'Explore the invisible wound of what was never offered — and what that absence may have taught you about yourself.',
  },
  {
    id: 'recognizing-trauma-responses',
    title: 'Recognizing Your Trauma Responses',
    subtitle: 'A Psychoeducational Guide to Fight, Flight, Freeze & Fawn',
    price: '$6.99',
    description: 'Learn to name what happens inside you under stress — and meet your nervous system\'s protective patterns with curiosity.',
  },
]

export default function ResourcesPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>

      <style>{`
        @media (max-width: 640px) {
          .hero-logo { height: 140px !important; margin-bottom: -60px !important; }
          .hero-body { padding: 80px 32px 60px !important; }
          .hero-title { font-size: 40px !important; }
        }

        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 28px;
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 40px 100px;
        }
        .resource-card {
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: box-shadow 0.2s ease;
        }
        .resource-card:hover {
          box-shadow: 0 6px 28px rgba(0,0,0,0.10);
        }
        .card-top {
          background: var(--blush);
          padding: 28px 32px 24px;
        }
        .card-top.free-top {
          background: var(--mid);
        }
        .card-mid {
          background: var(--cream);
          padding: 24px 32px;
          flex: 1;
        }
        .card-bot {
          background: var(--bg);
          padding: 18px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid var(--border-light);
        }
        .resource-badge {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin: 0 0 14px;
        }
        .free-badge {
          color: var(--text);
        }
        .resource-title {
          font-family: var(--font-display);
          font-size: 19px;
          font-weight: 300;
          color: var(--text);
          line-height: 1.4;
          margin: 0;
        }
        .resource-desc {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.75;
          margin: 0;
        }
        .resource-price {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 300;
          color: var(--text);
        }
        .resource-price.free-price {
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          font-family: var(--font-body);
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
      <section style={{ background: 'var(--bg)', paddingTop: '100px', textAlign: 'center' }}>
        <img
          src="/twc-logo.svg"
          alt="Gracefully Redefined"
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
            <h1 className="hero-title" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 5.5vw, 56px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.1, marginBottom: '0' }}>
              Resources
            </h1>
            <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '36px auto' }} />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '480px', margin: '0 auto' }}>
              Thoughtfully crafted tools to support your healing — at your own pace, in your own time.
            </p>
          </div>
        </div>
      </section>


      <TickerBanner bg="#fff" />

      {/* Card Grid */}
      <div className="resources-grid" style={{ paddingTop: '220px' }}>

        {PAID_RESOURCES.map(resource => (
          <div key={resource.id} className="resource-card">
            <div className="card-top">
              <p className="resource-badge" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <rect x="0.9" y="5.6" width="9.2" height="6.5" rx="1.3" stroke="currentColor" strokeWidth="1.1"/>
                  <path d="M2.8 5.6V3.8a2.7 2.7 0 0 1 5.4 0v1.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                </svg>
                Digital Resource
              </p>
              <h2 className="resource-title">{resource.title}</h2>
              {'subtitle' in resource && (
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '8px', lineHeight: 1.5 }}>{(resource as { subtitle: string }).subtitle}</p>
              )}
            </div>
            <div className="card-mid">
              <p className="resource-desc">{resource.description}</p>
            </div>
            <div className="card-bot">
              <span className="resource-price">{resource.price}</span>
              <button className="resource-btn" disabled title="Coming soon">
                Available soon
              </button>
            </div>
          </div>
        ))}

        {/* Free card */}
        <div className="resource-card">
          <div className="card-top free-top">
            <p className="resource-badge free-badge">Complimentary</p>
            <h2 className="resource-title">21 Affirmation &amp; Grounding Cards</h2>
          </div>
          <div className="card-mid">
            <p className="resource-desc">
              Truth-based affirmations rooted in trauma recovery, attachment healing, and nervous system care — yours to explore freely.
            </p>
          </div>
          <div className="card-bot">
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
