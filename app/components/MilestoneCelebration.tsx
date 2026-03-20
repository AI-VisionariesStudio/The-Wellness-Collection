'use client'
import { useState, useEffect } from 'react'

type Props = {
  totalCompleted: number
  streak: number
}

type Milestone = {
  key: string
  heading: string
  message: string
  symbol: string
}

function getMilestone(totalCompleted: number, streak: number): Milestone | null {
  if (totalCompleted === 1) return {
    key: 'first-lesson',
    heading: 'Your journey has begun.',
    message: 'Completing the first lesson is the most meaningful step. You showed up for yourself — and that matters.',
    symbol: '✦',
  }
  if (streak === 3) return {
    key: 'streak-3',
    heading: 'Three days of growth.',
    message: 'You\'ve been consistent for three days. Small, steady effort is how lasting change is built.',
    symbol: '◆',
  }
  if (streak === 7) return {
    key: 'streak-7',
    heading: 'A week of intention.',
    message: 'Seven days in a row. You\'re building something real — a practice of showing up for your own growth.',
    symbol: '❋',
  }
  if (totalCompleted === 5) return {
    key: 'five-lessons',
    heading: 'Five lessons. Five moments of insight.',
    message: 'You\'re doing the work. Each lesson you complete deepens your understanding of yourself.',
    symbol: '✦',
  }
  return null
}

export default function MilestoneCelebration({ totalCompleted, streak }: Props) {
  const [visible, setVisible] = useState(false)
  const [milestone, setMilestone] = useState<Milestone | null>(null)

  useEffect(() => {
    const m = getMilestone(totalCompleted, streak)
    if (!m) return
    const seenKey = `milestone_seen_${m.key}`
    if (typeof window !== 'undefined' && !localStorage.getItem(seenKey)) {
      setMilestone(m)
      setVisible(true)
    }
  }, [totalCompleted, streak])

  function dismiss() {
    if (milestone) localStorage.setItem(`milestone_seen_${milestone.key}`, '1')
    setVisible(false)
  }

  if (!visible || !milestone) return null

  return (
    <>
      <style>{`
        .milestone-overlay {
          position: fixed; inset: 0; background: rgba(26,26,26,0.6);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 24px;
          animation: milestone-fade-in 0.4s ease;
        }
        .milestone-card {
          background: #fdfaf6; max-width: 460px; width: 100%;
          padding: 56px 48px; text-align: center;
          border: 1px solid var(--border, #e0d8d0);
          box-shadow: 0 24px 80px rgba(0,0,0,0.2);
          animation: milestone-rise 0.45s cubic-bezier(0.4,0,0.2,1);
        }
        .milestone-symbol {
          font-size: 40px; color: var(--gold, #c8922a);
          margin-bottom: 24px; display: block;
        }
        .milestone-heading {
          font-family: var(--font-display, Georgia, serif);
          font-size: 30px; font-weight: 300;
          color: var(--text, #1a1a1a); line-height: 1.25;
          margin-bottom: 16px;
        }
        .milestone-message {
          font-size: 15px; color: var(--text-muted, #888);
          line-height: 1.75; margin-bottom: 36px;
        }
        .milestone-btn {
          background: var(--text, #1a1a1a); color: #fff;
          border: none; padding: 14px 36px;
          font-size: 11px; letter-spacing: 0.14em;
          text-transform: uppercase; cursor: pointer;
          transition: opacity 0.2s;
        }
        .milestone-btn:hover { opacity: 0.8; }
        @keyframes milestone-fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes milestone-rise { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
      <div className="milestone-overlay" onClick={dismiss}>
        <div className="milestone-card" onClick={e => e.stopPropagation()}>
          <span className="milestone-symbol">{milestone.symbol}</span>
          <h2 className="milestone-heading">{milestone.heading}</h2>
          <p className="milestone-message">{milestone.message}</p>
          <button className="milestone-btn" onClick={dismiss}>Continue Your Journey</button>
        </div>
      </div>
    </>
  )
}
