'use client'
import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  courseTitle: string
  moduleTitle: string
  lessonTitle: string
  lessonDescription?: string | null
  backedResearch?: string | null
  open: boolean
  onClose: () => void
}

const AGENTS = [
  { name: 'Jennifer', avatar: '/avatars/Jennifer.png' },
  { name: 'Max',      avatar: '/avatars/Max.png'      },
  { name: 'Joseph',   avatar: '/avatars/Joseph.png'   },
  { name: 'Gabby',    avatar: '/avatars/Gabby.png'    },
  { name: 'Lisa',     avatar: '/avatars/Lisa.png'     },
  { name: 'Rachel',   avatar: '/avatars/Rachel.png'   },
]

const DISCLAIMER =
  'This assistant provides educational information only and is not a substitute for therapy, counseling, or professional mental health support.'

export default function CourseCompanion({
  courseTitle, moduleTitle, lessonTitle, lessonDescription, backedResearch, open, onClose,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [agentIndex, setAgentIndex] = useState(0)
  const [avatarError, setAvatarError] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [countdown, setCountdown] = useState(10)

  useEffect(() => { setAgentIndex(Math.floor(Math.random() * AGENTS.length)) }, [])
  const agent = AGENTS[agentIndex]

  // Countdown when panel opens
  useEffect(() => {
    if (open) {
      setTransitioning(true)
      setCountdown(10)
    }
  }, [open])

  useEffect(() => {
    if (!transitioning) return
    if (countdown <= 0) { setTransitioning(false); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [transitioning, countdown])

  useEffect(() => {
    if (open && !transitioning) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open, transitioning])

  useEffect(() => {
    if (open && !transitioning) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open, transitioning])

  const handleClose = () => {
    setMessages([])
    setTransitioning(false)
    setAgentIndex(prev => (prev + 1) % AGENTS.length)
    setAvatarError(false)
    onClose()
  }

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const userMsg: Message = { role: 'user', content: text }
    const next = [...messages, userMsg]
    setMessages(next)
    setLoading(true)
    try {
      const res = await fetch('/api/ai/course-companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, lessonTitle, lessonDescription, moduleTitle, courseTitle, backedResearch, conversationHistory: messages }),
      })
      const data = await res.json()
      setMessages([...next, { role: 'assistant', content: data.reply || 'Unable to respond. Please try again.' }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fade-in cc-companion-panel"
      style={{
        position: 'sticky',
        top: '52px',
        width: '360px',
        height: 'calc(100vh - 52px)',
        flexShrink: 0,
        alignSelf: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--card)',
        borderLeft: '1px solid var(--border)',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
        overflowY: 'hidden',
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .cc-companion-panel {
            position: fixed !important;
            top: 52px !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            height: calc(100vh - 52px) !important;
            z-index: 110;
            border-left: none !important;
            box-shadow: 0 -4px 24px rgba(0,0,0,0.12) !important;
          }
        }
      `}</style>
      {/* Header */}
      <div style={{
        padding: '14px 16px', background: 'var(--header)',
        borderBottom: '1px solid var(--border)', flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {!avatarError && (
            <img
              src={agent.avatar} alt={agent.name}
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: '1.5px solid var(--mid)', display: 'block' }}
              onError={() => setAvatarError(true)}
            />
          )}
          <span style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: transitioning ? '#f0a500' : '#5cb85c', border: '2px solid #fff' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 500, color: 'var(--text)', margin: 0, lineHeight: 1.2 }}>
            {agent.name}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', margin: '1px 0 0', letterSpacing: '0.04em' }}>
            {transitioning ? 'Connecting…' : `Lesson Companion · ${lessonTitle}`}
          </p>
        </div>
        <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '20px', lineHeight: 1, padding: '4px', flexShrink: 0 }} aria-label="Close">×</button>
      </div>

      {/* Countdown screen or chat */}
      {transitioning ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '32px', textAlign: 'center', background: 'var(--cream)' }}>
          <div style={{ position: 'relative' }}>
            {!avatarError && (
              <img
                src={agent.avatar} alt={agent.name}
                style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: '3px solid var(--mid)' }}
                onError={() => setAvatarError(true)}
              />
            )}
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 10px' }}>
              Your agent will be with you in
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: 300, color: 'var(--text)', margin: 0, lineHeight: 1 }}>
              {countdown}
            </p>
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', margin: 0 }}>
            {agent.name} is on their way…
          </p>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.length === 0 && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, textAlign: 'center', margin: 'auto 0' }}>
                Ask about the concepts, research, or frameworks covered in this lesson.
              </p>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                background: msg.role === 'user' ? 'var(--blush)' : 'var(--bg)',
                border: '1px solid var(--border-light)',
                borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                padding: '10px 13px',
              }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text)', margin: 0, lineHeight: 1.65 }}>{msg.content}</p>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--bg)', border: '1px solid var(--border-light)', borderRadius: '12px 12px 12px 2px', padding: '10px 13px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>{agent.name} is thinking…</p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input — extra bottom padding clears the journal tab */}
          <div style={{ padding: '12px 16px 56px', borderTop: '1px solid var(--border-light)', flexShrink: 0, background: 'var(--card)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                placeholder={`Ask ${agent.name} about this lesson…`}
                disabled={loading}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', fontSize: '13px', background: 'var(--white)', color: 'var(--text)', outline: 'none', minWidth: 0 }}
              />
              <button
                onClick={send} disabled={loading || !input.trim()}
                style={{ background: 'var(--blush)', border: '1px solid var(--mid)', borderRadius: 'var(--radius)', padding: '8px 14px', fontFamily: 'var(--font-body)', fontSize: '12px', letterSpacing: '0.05em', color: 'var(--text)', cursor: loading || !input.trim() ? 'default' : 'pointer', opacity: loading || !input.trim() ? 0.45 : 1, flexShrink: 0 }}
              >
                Send
              </button>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)', margin: '8px 0 0', lineHeight: 1.5, letterSpacing: '0.01em' }}>
              {DISCLAIMER}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
