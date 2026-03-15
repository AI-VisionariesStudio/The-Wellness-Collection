'use client'
import { useState } from 'react'

interface Props {
  stage: 'PRE' | 'POST'
  lessonId: string
  lessonTitle: string
  moduleTitle: string
  onDismiss: () => void
}

const SCALE_LABELS = [
  'Not at all connected',
  'Slightly connected',
  'Somewhat connected',
  'Mostly connected',
  'Very connected',
]

const DISCLAIMER =
  'This assistant provides educational information only and is not a substitute for therapy, counseling, or professional mental health support.'

// ── Compact strip shown above the video (PRE stage) ──────────────────────────
function PreStrip({ lessonId, lessonTitle, moduleTitle, onDismiss }: Omit<Props, 'stage'>) {
  const [selected, setSelected] = useState<number | null>(null)
  const [aiText, setAiText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelect = async (score: number) => {
    if (loading || aiText !== null) return
    setSelected(score)
    setLoading(true)
    try {
      const res = await fetch('/api/ai/reflection-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, stage: 'PRE', lessonTitle, moduleTitle, lessonId }),
      })
      const data = await res.json()
      setAiText(data.text || null)
    } catch {
      setAiText(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'var(--header)',
      border: '1px solid var(--border)',
      borderBottom: 'none',
      borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
    }}>
      {/* Main row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '10px 16px',
        flexWrap: 'wrap',
      }}>
        {/* Label */}
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>
          Before you begin
        </span>

        {/* Question */}
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: 'var(--text)',
          flexShrink: 0,
        }}>
          How familiar are you with today's topic?
        </span>

        {/* Scale */}
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              onClick={() => handleSelect(n)}
              disabled={loading || aiText !== null}
              title={SCALE_LABELS[n - 1]}
              style={{
                width: '30px',
                height: '30px',
                border: selected === n ? '1.5px solid var(--text)' : '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: selected === n ? 'var(--blush)' : 'var(--white)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--text)',
                cursor: loading || aiText !== null ? 'default' : 'pointer',
                transition: 'var(--transition)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Scale end labels */}
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0 }}>
          Not at all → Very connected
        </span>

        {/* Skip */}
        <button
          onClick={onDismiss}
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            letterSpacing: '0.06em',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            flexShrink: 0,
            padding: '4px 0',
          }}
        >
          {loading ? 'Loading…' : 'Skip ×'}
        </button>
      </div>

      {/* AI response row — appears after selection */}
      {aiText && (
        <div style={{
          padding: '10px 16px 12px',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            margin: 0,
            flex: 1,
          }}>
            {aiText}
          </p>
          <button
            onClick={onDismiss}
            className="btn btn-outline"
            style={{ fontSize: '11px', padding: '6px 14px', flexShrink: 0, whiteSpace: 'nowrap' }}
          >
            Begin →
          </button>
        </div>
      )}
    </div>
  )
}

// ── Full modal overlay shown after video ends (POST stage) ───────────────────
function PostModal({ lessonId, lessonTitle, moduleTitle, onDismiss }: Omit<Props, 'stage'>) {
  const [selected, setSelected] = useState<number | null>(null)
  const [aiText, setAiText] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelect = async (score: number) => {
    if (loading || aiText !== null) return
    setSelected(score)
    setLoading(true)
    try {
      const res = await fetch('/api/ai/reflection-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, stage: 'POST', lessonTitle, moduleTitle, lessonId }),
      })
      const data = await res.json()
      setAiText(data.text || null)
    } catch {
      setAiText(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(26,26,26,0.50)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 36px',
        maxWidth: '460px',
        width: '100%',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 14px' }}>
          Lesson Complete
        </p>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 300, color: 'var(--text)', lineHeight: 1.45, margin: '0 0 28px' }}>
          How connected did you feel to this material?
        </p>

        {aiText === null && !loading && (
          <>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => handleSelect(n)}
                  title={SCALE_LABELS[n - 1]}
                  style={{
                    flex: 1,
                    padding: '13px 0',
                    border: selected === n ? '2px solid var(--text)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    background: selected === n ? 'var(--blush)' : 'transparent',
                    fontFamily: 'var(--font-display)',
                    fontSize: '18px',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)' }}>{SCALE_LABELS[0]}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)' }}>{SCALE_LABELS[4]}</span>
            </div>
          </>
        )}

        {loading && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.6 }}>
            Generating your reflection prompt…
          </p>
        )}

        {aiText && (
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text)', lineHeight: 1.72, margin: '0 0 14px' }}>
              {aiText}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              {DISCLAIMER}
            </p>
          </div>
        )}

        {aiText ? (
          <button onClick={onDismiss} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}>
            Continue →
          </button>
        ) : (
          <button onClick={onDismiss} style={{ display: 'block', width: '100%', background: 'none', border: 'none', fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px 0', marginTop: loading ? '8px' : '0' }}>
            Skip — Continue
          </button>
        )}
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function ReflectionPulse({ stage, lessonId, lessonTitle, moduleTitle, onDismiss }: Props) {
  if (stage === 'PRE') {
    return <PreStrip lessonId={lessonId} lessonTitle={lessonTitle} moduleTitle={moduleTitle} onDismiss={onDismiss} />
  }
  return <PostModal lessonId={lessonId} lessonTitle={lessonTitle} moduleTitle={moduleTitle} onDismiss={onDismiss} />
}
