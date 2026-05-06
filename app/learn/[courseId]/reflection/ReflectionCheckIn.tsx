'use client'
import { useState } from 'react'
import Link from 'next/link'

const MC_QUESTIONS = [
  {
    id: 1,
    question: 'Which psychologist is credited with founding attachment theory and introducing the concept of the caregiver as a secure base?',
    options: ['Mary Ainsworth', 'Mary Main', 'John Bowlby', 'Daniel Siegel'],
    correct: 2,
  },
  {
    id: 2,
    question: 'The Strange Situation experiment, developed by Mary Ainsworth, was designed to observe what aspect of infant behavior?',
    options: [
      'Language development in the presence of a stranger',
      'How infants respond to separation from and reunion with their caregiver',
      "The infant's ability to self-soothe without a caregiver present",
      'Cognitive problem-solving in unfamiliar environments',
    ],
    correct: 1,
  },
  {
    id: 3,
    question: 'The internal working model refers to which of the following?',
    options: [
      'A clinical assessment tool used by therapists to evaluate attachment style',
      'A conscious set of beliefs a person holds about relationships',
      'A relational blueprint built from early caregiving experiences that shapes how we see ourselves, others, and the world',
      'A biological reflex present only in infancy',
    ],
    correct: 2,
  },
]

const TF_QUESTIONS = [
  {
    id: 4,
    question: 'Attachment behaviors such as crying and proximity-seeking are signs of emotional weakness or poor development.',
    correct: false,
  },
  {
    id: 5,
    question: 'Research suggests that the way adults narrate their childhood experiences can predict how their own children will attach to them.',
    correct: true,
  },
]

const REFLECTIVE_PROMPTS = [
  {
    id: 'r1',
    prompt: 'In your own words, how would you describe the internal working model? Without judgment, what do you notice about the relational blueprint you may have developed early in life — about yourself, others, or the world?',
  },
  {
    id: 'r2',
    prompt: 'As you learned about the three attachment styles identified in the Strange Situation (Secure, Anxious, and Avoidant), did any resonate with you — even loosely? What did you notice as you read or heard about each one?',
  },
  {
    id: 'r3',
    prompt: 'This module introduced the idea that attachment is not destiny — that the brain remains capable of change, and earned security is possible at any age. What came up for you as you sat with that idea? Did it feel hopeful, hard to believe, or something else entirely?',
  },
]

const LETTERS = ['A', 'B', 'C', 'D']

// ── Option accent colors by state ─────────────────────────────────────────────
function optionStyles(state: 'idle' | 'selected' | 'correct' | 'wrong') {
  if (state === 'correct')  return { bg: 'rgba(74,122,90,0.08)',  color: '#4a7a5a', border: '#4a7a5a', weight: 500 }
  if (state === 'wrong')    return { bg: 'rgba(180,80,80,0.07)',  color: '#b45050', border: '#b45050', weight: 400 }
  if (state === 'selected') return { bg: 'var(--blush)',          color: 'var(--text)', border: 'var(--gold)', weight: 400 }
  return                           { bg: 'var(--card)',           color: 'var(--text-muted)', border: 'transparent', weight: 400 }
}

export default function ReflectionCheckIn({ courseId }: { courseId: string }) {
  const [mcAnswers, setMcAnswers]   = useState<Record<number, number>>({})
  const [tfAnswers, setTfAnswers]   = useState<Record<number, boolean | null>>({})
  const [reflections, setReflections] = useState<Record<string, string>>({})
  const [carryForward, setCarryForward] = useState('')
  const [submitted, setSubmitted]   = useState(false)

  const allAnswered =
    MC_QUESTIONS.every(q => mcAnswers[q.id] !== undefined) &&
    TF_QUESTIONS.every(q => tfAnswers[q.id] !== undefined)

  const score =
    MC_QUESTIONS.filter(q => mcAnswers[q.id] === q.correct).length +
    TF_QUESTIONS.filter(q => tfAnswers[q.id] === q.correct).length

  function handleRetake() {
    setMcAnswers({})
    setTfAnswers({})
    setSubmitted(false)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>

      {/* ── Top bar ── */}
      <div style={{
        background: 'var(--header)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        gap: '16px',
        minHeight: '48px',
      }}>
        <Link href={`/learn/${courseId}`} style={{ fontFamily: 'var(--font-body)', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          ← Back to Course
        </Link>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.06em', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Gracefully Redefined · The Wellness Collection
        </span>
      </div>

      {/* ── Page body ── */}
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '56px 24px 80px', width: '100%', boxSizing: 'border-box' }}>

        {/* Header */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px' }}>
          Module 01 — Attachment Science &amp; Development
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '44px', fontWeight: 300, color: 'var(--text)', margin: '0 0 32px', lineHeight: 1.1 }}>
          Module Reflection &amp; Check-In
        </h1>

        {/* Intro note */}
        <div style={{ background: 'var(--header)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: '52px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.8, color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
            <strong style={{ fontStyle: 'normal', color: 'var(--text)', fontWeight: 500 }}>A note before you begin: </strong>
            This check-in is an opportunity to pause, reflect, and integrate what you've explored in this module. There are no right or wrong answers to the reflective questions — only your honest experience. The comprehension questions are designed to help you review key educational concepts. This course is psychoeducational in nature and is not a substitute for individualized therapy. If anything that arose feels personal or tender, we gently encourage you to bring it to a licensed mental health professional.
          </p>
        </div>

        {/* Score banner */}
        {submitted && (
          <div style={{ background: 'var(--blush)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '24px 28px', marginBottom: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 6px' }}>Comprehension Score</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 300, color: 'var(--text)', margin: 0, lineHeight: 1 }}>
                {score} <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>/ 5</span>
              </p>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', margin: 0, maxWidth: '320px', lineHeight: 1.65, fontStyle: 'italic' }}>
              Your reflective responses are yours alone — they are never reviewed or graded.
            </p>
          </div>
        )}

        {/* ══ PART ONE ══ */}
        <SectionBar>Part One — Comprehension Check</SectionBar>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 400, color: 'var(--text)', margin: '0 0 8px' }}>
          Layer 1 — Cognitive Retention
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontStyle: 'italic', color: 'var(--text-muted)', margin: '0 0 28px', lineHeight: 1.7 }}>
          The following questions invite you to review the key concepts covered in Module 1. Select your answer. This is a low-stakes check-in — not a test.
        </p>

        {/* Multiple choice questions */}
        {MC_QUESTIONS.map(q => {
          const sel = mcAnswers[q.id]
          const isAnswered = sel !== undefined
          const isCorrect  = sel === q.correct

          return (
            <div key={q.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '24px', overflow: 'hidden' }}>

              {/* Question row — cream background */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '18px 20px',
                background: 'var(--header)',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '4px',
                  flexShrink: 0,
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  fontWeight: 700,
                  marginTop: '1px',
                  background: submitted && isAnswered ? (isCorrect ? '#4a7a5a' : '#b45050') : 'var(--mid)',
                  color: submitted && isAnswered ? 'white' : 'var(--text-muted)',
                  transition: 'background 0.2s, color 0.2s',
                }}>
                  {submitted && isAnswered ? (isCorrect ? '✓' : '✗') : q.id}
                </span>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text)', margin: 0, lineHeight: 1.65, flex: 1, minWidth: 0 }}>
                  {q.question}
                </p>
              </div>

              {/* Options — white background */}
              <div style={{ background: 'var(--card)' }}>
                {q.options.map((opt, i) => {
                  const state = submitted
                    ? i === q.correct ? 'correct' : (sel === i ? 'wrong' : 'idle')
                    : sel === i ? 'selected' : 'idle'
                  const s = optionStyles(state)
                  return (
                    <label
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '13px 20px',
                        width: '100%',
                        boxSizing: 'border-box',
                        cursor: submitted ? 'default' : 'pointer',
                        background: s.bg,
                        borderBottom: i < q.options.length - 1 ? '1px solid var(--border-light)' : 'none',
                        transition: 'background 0.15s',
                        userSelect: 'none',
                      }}
                    >
                      <input type="radio" name={`mc-${q.id}`} checked={sel === i} disabled={submitted} onChange={() => !submitted && setMcAnswers(p => ({ ...p, [q.id]: i }))} style={{ display: 'none' }} />
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '24px', height: '24px', borderRadius: '4px', flexShrink: 0,
                        fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 600,
                        background: state === 'correct' ? '#4a7a5a' : state === 'wrong' ? '#b45050' : state === 'selected' ? 'var(--mid)' : 'var(--blush)',
                        color: (state === 'correct' || state === 'wrong') ? 'white' : 'var(--text-muted)',
                        border: '1px solid var(--border)',
                        transition: 'background 0.15s, color 0.15s',
                      }}>
                        {state === 'correct' ? '✓' : state === 'wrong' ? '✗' : LETTERS[i]}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: s.color, lineHeight: 1.55, fontWeight: s.weight, flex: 1, minWidth: 0 }}>
                        {opt}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* True / False questions */}
        {TF_QUESTIONS.map(q => {
          const sel = tfAnswers[q.id]
          const isAnswered = sel !== undefined
          const isCorrect  = sel === q.correct

          return (
            <div key={q.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '24px', overflow: 'hidden' }}>

              {/* Question row — cream */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '18px 20px',
                background: 'var(--header)',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '4px',
                  flexShrink: 0,
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  fontWeight: 700,
                  marginTop: '1px',
                  background: submitted && isAnswered ? (isCorrect ? '#4a7a5a' : '#b45050') : 'var(--mid)',
                  color: submitted && isAnswered ? 'white' : 'var(--text-muted)',
                  transition: 'background 0.2s, color 0.2s',
                }}>
                  {submitted && isAnswered ? (isCorrect ? '✓' : '✗') : q.id}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                    True or False
                  </span>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text)', margin: 0, lineHeight: 1.65 }}>
                    {q.question}
                  </p>
                </div>
              </div>

              {/* True / False options — white, side by side */}
              <div style={{ display: 'flex', background: 'var(--card)' }}>
                {([true, false] as const).map((val, i) => {
                  const state = submitted
                    ? val === q.correct ? 'correct' : (sel === val ? 'wrong' : 'idle')
                    : sel === val ? 'selected' : 'idle'
                  const s = optionStyles(state)
                  return (
                    <label
                      key={String(val)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 20px',
                        flex: 1,
                        boxSizing: 'border-box',
                        cursor: submitted ? 'default' : 'pointer',
                        background: s.bg,
                        borderRight: i === 0 ? '1px solid var(--border-light)' : 'none',
                        transition: 'background 0.15s',
                        userSelect: 'none',
                      }}
                    >
                      <input type="radio" name={`tf-${q.id}`} checked={sel === val} disabled={submitted} onChange={() => !submitted && setTfAnswers(p => ({ ...p, [q.id]: val }))} style={{ display: 'none' }} />
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '24px', height: '24px', borderRadius: '4px', flexShrink: 0,
                        fontFamily: 'var(--font-body)', fontSize: '10px', fontWeight: 700,
                        background: state === 'correct' ? '#4a7a5a' : state === 'wrong' ? '#b45050' : state === 'selected' ? 'var(--mid)' : 'var(--blush)',
                        color: (state === 'correct' || state === 'wrong') ? 'white' : 'var(--text-muted)',
                        border: '1px solid var(--border)',
                        transition: 'background 0.15s, color 0.15s',
                      }}>
                        {state === 'correct' ? '✓' : state === 'wrong' ? '✗' : (val ? 'T' : 'F')}
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: s.color, fontWeight: s.weight }}>
                        {val ? 'True' : 'False'}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Answer key */}
        {submitted && (
          <div style={{ background: 'var(--header)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 20px', marginBottom: '52px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>Answer Key</span>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {['1 — C', '2 — B', '3 — C', '4 — False', '5 — True'].map(a => (
                <span key={a} style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)' }}>{a}</span>
              ))}
            </div>
          </div>
        )}

        {/* ══ PART TWO ══ */}
        <SectionBar>Part Two — Reflective Application</SectionBar>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 400, color: 'var(--text)', margin: '0 0 8px' }}>
          Layer 2 — Personal Integration
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', fontStyle: 'italic', color: 'var(--text-muted)', margin: '0 0 28px', lineHeight: 1.7 }}>
          The following prompts invite you to connect what you learned to your own lived experience. These are not graded and will not be reviewed by anyone. There is no right answer — only your honest reflection. You may skip any prompt that does not feel right for you today.
        </p>

        {REFLECTIVE_PROMPTS.map((p, i) => (
          <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: '24px', overflow: 'hidden' }}>
            {/* Prompt — cream */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '18px 20px', background: 'var(--header)', borderBottom: '1px solid var(--border)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '50%', background: 'var(--blush)', border: '1px solid var(--border)', flexShrink: 0, fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginTop: '1px' }}>
                {i + 1}
              </span>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontStyle: 'italic', color: 'var(--text)', margin: 0, lineHeight: 1.7, flex: 1, minWidth: 0 }}>
                {p.prompt}
              </p>
            </div>
            {/* Text area — white */}
            <div style={{ background: 'var(--card)', padding: '18px 20px' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 10px' }}>Your reflection</p>
              <textarea
                value={reflections[p.id] || ''}
                onChange={e => setReflections(prev => ({ ...prev, [p.id]: e.target.value }))}
                placeholder="Write as much or as little as feels right…"
                rows={5}
                style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text)', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 14px', lineHeight: 1.75, resize: 'vertical', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => { e.target.style.borderColor = 'var(--gold)' }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
              />
            </div>
          </div>
        ))}

        {/* Closing quote */}
        <div style={{ background: 'var(--blush)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '32px 36px', marginBottom: '52px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontStyle: 'italic', fontWeight: 300, color: 'var(--text-muted)', margin: 0, lineHeight: 1.75 }}>
            "What you just explored took courage. These are not small questions. Take a breath before moving forward — you are doing meaningful work."
          </p>
        </div>

        {/* ══ CARRY FORWARD ══ */}
        <SectionBar>Carry Forward</SectionBar>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontStyle: 'italic', color: 'var(--text-muted)', margin: '0 0 24px', lineHeight: 1.75 }}>
          Before you move to Module 2 — Nervous System &amp; Survival Strategies — take a moment to note one thing from this module that stayed with you.
        </p>

        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: '48px' }}>
          <div style={{ padding: '16px 20px', background: 'var(--header)', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', fontStyle: 'italic', color: 'var(--text-muted)', margin: 0 }}>One thing that landed for me in Module 1:</p>
          </div>
          <div style={{ background: 'var(--card)', padding: '18px 20px' }}>
            <textarea
              value={carryForward}
              onChange={e => setCarryForward(e.target.value)}
              placeholder="Write as much or as little as feels right…"
              rows={4}
              style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text)', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px 14px', lineHeight: 1.75, resize: 'vertical', outline: 'none', transition: 'border-color 0.2s' }}
              onFocus={e => { e.target.style.borderColor = 'var(--gold)' }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
            />
          </div>
        </div>

        {/* Submit */}
        {!submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '52px' }}>
            <button
              onClick={() => { setSubmitted(true); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50) }}
              disabled={!allAnswered}
              className="btn btn-primary"
              style={{ padding: '14px 48px', fontSize: '12px', letterSpacing: '0.1em', opacity: !allAnswered ? 0.45 : 1, cursor: !allAnswered ? 'not-allowed' : 'pointer' }}
            >
              Check My Answers
            </button>
            {!allAnswered && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
                Answer all 5 comprehension questions to continue
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '52px', flexWrap: 'wrap' }}>
            <button
              onClick={handleRetake}
              className="btn btn-outline"
              style={{ padding: '12px 28px', fontSize: '12px' }}
            >
              Retake Comprehension
            </button>
            <Link href={`/learn/${courseId}`} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '12px' }}>
              ← Back to Course
            </Link>
          </div>
        )}

<p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', letterSpacing: '0.08em', fontStyle: 'italic' }}>
          Research-Grounded · Reflectively Designed · Clinically Responsible
        </p>

      </div>
    </div>
  )
}


function SectionBar({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--blush)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '11px 18px', margin: '0 0 28px' }}>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>
        {children}
      </p>
    </div>
  )
}
