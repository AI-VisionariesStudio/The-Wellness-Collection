'use client'

import { useState } from 'react'
import './card-deck.css'

interface CardData {
  id: number
  category: 'healing' | 'nervous-system' | 'identity'
  number: string
  label: string
  affirmation: string
  reflection: string
}

const CARDS: CardData[] = [
  // ── HEALING ──
  {
    id: 1, category: 'healing', number: '01', label: 'Healing',
    affirmation: 'I am allowed to take up space in my healing.',
    reflection: 'Where in your life have you been making yourself smaller? What would it look like to fully inhabit your healing today?'
  },
  {
    id: 2, category: 'healing', number: '02', label: 'Healing',
    affirmation: 'My grief is not weakness — it is proof of my capacity to love.',
    reflection: 'What are you grieving right now? Can you honor that grief as a sign of your depth rather than your fragility?'
  },
  {
    id: 3, category: 'healing', number: '03', label: 'Healing',
    affirmation: 'I release what was never mine to carry.',
    reflection: 'What burdens have you inherited that were never yours to hold? What would it feel like to gently set them down?'
  },
  {
    id: 4, category: 'healing', number: '04', label: 'Healing',
    affirmation: 'Healing is not linear, and I honor every step I take.',
    reflection: 'Think of a moment recently where you felt like you regressed. What if that step back was your nervous system resting before the next leap forward?'
  },
  {
    id: 5, category: 'healing', number: '05', label: 'Healing',
    affirmation: 'I am worthy of the gentleness I so freely give to others.',
    reflection: 'How do you speak to yourself in moments of struggle? What would you say to a dear friend in that same moment?'
  },
  {
    id: 6, category: 'healing', number: '06', label: 'Healing',
    affirmation: 'Every breath I take is an act of courage.',
    reflection: 'Pause and take three slow breaths. What does it mean to you that simply continuing — simply breathing — is an act of bravery?'
  },
  {
    id: 7, category: 'healing', number: '07', label: 'Healing',
    affirmation: 'I am becoming — and becoming is enough.',
    reflection: 'Who are you becoming? Not who you were, not who you think you should be — but who you are genuinely, slowly, becoming?'
  },
  // ── NERVOUS SYSTEM ──
  {
    id: 8, category: 'nervous-system', number: '08', label: 'Nervous System',
    affirmation: 'My body is not my enemy. It is trying to protect me.',
    reflection: 'When your body feels activated or on edge, can you meet that sensation with curiosity instead of resistance? What might it be trying to say?'
  },
  {
    id: 9, category: 'nervous-system', number: '09', label: 'Nervous System',
    affirmation: 'I can feel safe even when safety was once unfamiliar.',
    reflection: 'What does safety feel like in your body? If you don\'t yet know, what is one small thing that brings even a momentary sense of ease?'
  },
  {
    id: 10, category: 'nervous-system', number: '10', label: 'Nervous System',
    affirmation: 'I am allowed to pause, breathe, and return to myself.',
    reflection: 'Where in your day could you build in one intentional pause? What would returning to yourself look like in that moment?'
  },
  {
    id: 11, category: 'nervous-system', number: '11', label: 'Nervous System',
    affirmation: 'Calm is something I can learn to call home.',
    reflection: 'Calm may not have been familiar growing up. What would it mean for calm to become your new baseline — something practiced, not just inherited?'
  },
  {
    id: 12, category: 'nervous-system', number: '12', label: 'Nervous System',
    affirmation: 'When I slow down, I find what I need.',
    reflection: 'What happens when you slow down? What tends to rise to the surface that is harder to access when you are in motion?'
  },
  {
    id: 13, category: 'nervous-system', number: '13', label: 'Nervous System',
    affirmation: 'My nervous system is rewiring itself toward peace.',
    reflection: 'Neuroplasticity is real — your brain is always changing. What new patterns of thought or response have you noticed, however small, that point toward healing?'
  },
  {
    id: 14, category: 'nervous-system', number: '14', label: 'Nervous System',
    affirmation: 'I choose presence over panic, one breath at a time.',
    reflection: 'When anxiety rises, what is one anchor — a breath, a sensation, a sound — that you can return to? How might you practice reaching for it more quickly?'
  },
  // ── IDENTITY ──
  {
    id: 15, category: 'identity', number: '15', label: 'Identity',
    affirmation: 'I am more than the roles I have been given.',
    reflection: 'Beyond being a parent, partner, child, or caretaker — who are you? What parts of yourself have been waiting quietly for permission to exist?'
  },
  {
    id: 16, category: 'identity', number: '16', label: 'Identity',
    affirmation: 'My story does not define me — I define my story.',
    reflection: 'If you were the author of your life rather than a character within it, what chapter would you say you are entering now? What do you want this chapter to hold?'
  },
  {
    id: 17, category: 'identity', number: '17', label: 'Identity',
    affirmation: 'I am allowed to evolve beyond who I was.',
    reflection: 'Are there people in your life who still see the older version of you? How do you hold your growth with grace, even when others can\'t yet see it?'
  },
  {
    id: 18, category: 'identity', number: '18', label: 'Identity',
    affirmation: 'I belong to myself first.',
    reflection: 'Where have you given pieces of yourself away in order to belong? What would it mean to return to yourself as your primary home?'
  },
  {
    id: 19, category: 'identity', number: '19', label: 'Identity',
    affirmation: 'Who I am becoming is worth celebrating.',
    reflection: 'Name one way you have grown in the past year that you have not yet fully acknowledged. How might you mark that growth today?'
  },
  {
    id: 20, category: 'identity', number: '20', label: 'Identity',
    affirmation: 'I release the need to be understood by everyone.',
    reflection: 'Whose understanding have you been seeking that may not be available? What would it free up in you to release that longing?'
  },
  {
    id: 21, category: 'identity', number: '21', label: 'Identity',
    affirmation: 'I am not lost. I am finding my way back to me.',
    reflection: 'In the disorientation of change and growth, what thread connects the you of the past to the you of today? What have you never stopped being?'
  },
]

export default function ResourcesPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<'all' | 'healing' | 'nervous-system' | 'identity'>('all')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [showError, setShowError] = useState(false)

  const filteredCards = filter === 'all' ? CARDS : CARDS.filter(c => c.category === filter)

  function unlockDeck() {
    const nameParts = name.trim().split(/\s+/)
    if (nameParts.length < 2 || !nameParts[1] || !email.trim() || !email.includes('@')) {
      setShowError(true)
      return
    }
    setShowError(false)
    setUnlocked(true)
  }

  function toggleCard(id: number) {
    setFlippedCards(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function filterCards(cat: 'all' | 'healing' | 'nervous-system' | 'identity') {
    setFilter(cat)
  }

  return (
    <>

      {!unlocked ? (

        /* ── EMAIL GATE ── */
        <div className="gate-page">
          <div className="gate-page-white">
            <div className="gate-card">
              <div className="gate-card-header">
                <img
                  className="gate-oval"
                  src="/GR-LOGO-OVAL.JPG"
                  alt="Gracefully Redefined"
                />
                <div className="gate-eyebrow">The Wellness Collection</div>
                <h2>Your Free<br /><em>Healing Cards</em></h2>
                <div className="gate-divider">
                  <div className="gate-divider-line" />
                  <div className="gate-divider-diamond" />
                  <div className="gate-divider-line" />
                </div>
              </div>
              <div className="gate-card-body">
                <p>
                  Enter your name and email to unlock all{' '}
                  <strong>21 Affirmation &amp; Grounding Cards</strong> — rooted in
                  trauma recovery, attachment healing, and nervous system care.
                </p>
                <div className="gate-input-wrap">
                  <input
                    className="gate-input"
                    type="text"
                    placeholder="Your full name"
                    autoComplete="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && unlockDeck()}
                    data-lpignore="true"
                  />
                  <input
                    className="gate-input"
                    type="email"
                    placeholder="Your email address"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && unlockDeck()}
                    data-lpignore="true"
                  />
                </div>
                {showError && (
                  <div className="gate-error">
                    Please enter your full name and a valid email to continue.
                  </div>
                )}
                <button className="gate-btn" onClick={unlockDeck}>
                  Unlock My Card Deck →
                </button>
                <div className="gate-privacy">
                  Your privacy is sacred here. No spam — ever.<br />
                  Unsubscribe at any time.
                </div>
              </div>
            </div>
          </div>
          <div className="gate-page-beige" />
        </div>

      ) : (

        /* ── DECK CONTENT ── */
        <div className="deck-root">

          {/* ── HERO SECTION ── */}
          <section style={{ background: '#fff', paddingTop: '100px', textAlign: 'center' }}>
            <img
              src="/GR-LOGO-OVAL.JPG"
              alt="Gracefully Redefined"
              style={{ height: '200px', objectFit: 'contain', display: 'block', margin: '0 auto -90px', position: 'relative', zIndex: 2, mixBlendMode: 'multiply' }}
            />
            <div style={{ background: 'var(--cream)', padding: '110px 60px 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{ maxWidth: '640px', margin: '0 auto' }}>
                <p style={{ fontSize: '10px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '28px' }}>
                  The Wellness Collection
                </p>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 5.5vw, 58px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.1, marginBottom: '24px' }}>
                  Affirmation &amp;<br /><em style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>Grounding Cards</em>
                </h1>
                <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '0 auto 28px' }} />
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: '480px', margin: '0 auto' }}>
                  21 truth-based affirmations rooted in trauma recovery, attachment healing, and nervous system care.
                </p>
              </div>
            </div>
          </section>

          {/* ── CREAM INTERLUDE ── */}
          <section style={{ background: 'var(--cream)', padding: '36px 40px', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
              {['Healing', 'Nervous System', 'Identity'].map(item => (
                <span key={item} style={{ fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ display: 'inline-block', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--mid)', flexShrink: 0 }} />
                  {item}
                </span>
              ))}
            </div>
          </section>

          {/* ── CARD DECK SECTION ── */}
          <section style={{ background: 'var(--bg)', paddingTop: '8px' }}>

            {/* ── FILTERS ── */}
            <div className="deck-filters">
              <button className={`filter-btn${filter === 'all' ? ' active' : ''}`} onClick={() => filterCards('all')}>
                All 21 Cards
              </button>
              <button className={`filter-btn cat-healing${filter === 'healing' ? ' active' : ''}`} onClick={() => filterCards('healing')}>
                Healing
              </button>
              <button className={`filter-btn cat-nervous${filter === 'nervous-system' ? ' active' : ''}`} onClick={() => filterCards('nervous-system')}>
                Nervous System
              </button>
              <button className={`filter-btn cat-identity${filter === 'identity' ? ' active' : ''}`} onClick={() => filterCards('identity')}>
                Identity
              </button>
            </div>

            {/* ── COUNTER ── */}
            <div className="deck-info">
              <div className="deck-counter">
                <span>{flippedCards.size}</span> of <span>{CARDS.length}</span> cards opened
              </div>
            </div>

            {/* ── CARD GRID ── */}
            <div className="card-grid">
              {filteredCards.map(card => (
                <div
                  key={card.id}
                  className={`card-wrap${flippedCards.has(card.id) ? ' flipped' : ''}`}
                  onClick={() => toggleCard(card.id)}
                >
                  <div className="card-inner">
                    <div className={`card-front ${card.category}`}>
                      <img className="card-front-logo" src="/GR_FINAL_FILES_transparent.png" alt="" aria-hidden="true" />
                      <div className="card-number">Card {card.number}</div>
                      <div className="card-category-label">{card.label}</div>
                      <div className="card-tap-hint">Tap to open</div>
                    </div>
                    <div className="card-back">
                      <div className="card-back-top">
                        <div className="card-quote-mark">&ldquo;</div>
                        <div className="card-affirmation">{card.affirmation}</div>
                        <div className="card-reflection">{card.reflection}</div>
                      </div>
                      <img className="card-back-logo" src="/GR_FINAL_FILES_transparent.png" alt="" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </section>

          {/* ── FOOTER CTA ── */}
          <div className="footer-cta">
            <h2>Ready to go deeper<br />than an <em>affirmation?</em></h2>
            <p>
              The Relational Blueprint is a full psychoeducational journey into
              understanding how your earliest relationships shaped who you are —
              and how healing is truly possible.
            </p>
            <button className="cta-btn">Explore The Relational Blueprint →</button>
          </div>

        </div>
      )}
    </>
  )
}
