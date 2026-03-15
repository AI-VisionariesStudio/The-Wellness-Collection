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
}

const DISCLAIMER =
  'This assistant provides educational information only and is not a substitute for therapy, counseling, or professional mental health support.'

export default function CourseCompanion({ courseTitle, moduleTitle, lessonTitle }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

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
        body: JSON.stringify({
          message: text,
          lessonTitle,
          moduleTitle,
          courseTitle,
          conversationHistory: messages,
        }),
      })
      const data = await res.json()
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.reply || 'Unable to respond. Please try again.',
      }
      setMessages([...next, assistantMsg])
    } catch {
      setMessages([
        ...next,
        { role: 'assistant', content: 'Something went wrong. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    /* Right side, vertically centered — stays out of the way of content */
    <div style={{ position: 'fixed', right: '24px', top: '50%', transform: 'translateY(-50%)', zIndex: 100 }}>

      {/* Toggle button — vertical writing, compact */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'block',
          background: open ? 'var(--text)' : 'var(--blush)',
          color: open ? 'var(--white)' : 'var(--text)',
          border: '1px solid var(--mid)',
          borderRadius: 'var(--radius)',
          padding: '14px 10px',
          fontFamily: 'var(--font-body)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: 'var(--shadow)',
          whiteSpace: 'nowrap',
          writingMode: 'vertical-rl',
          transition: 'var(--transition)',
        }}
      >
        {open ? '× Close' : '✦ Ask About This Lesson'}
      </button>

      {/* Chat panel — opens to the left of the button */}
      {open && (
        <div
          className="fade-in"
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            right: 'calc(100% + 10px)',
            width: '340px',
            maxHeight: '480px',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 16px',
              background: 'var(--header)',
              borderBottom: '1px solid var(--border)',
              flexShrink: 0,
            }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 500, color: 'var(--text)', margin: 0 }}>
              Lesson Companion
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0', letterSpacing: '0.04em' }}>
              {lessonTitle}
            </p>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.length === 0 && (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  textAlign: 'center',
                  margin: 'auto 0',
                }}
              >
                Ask about the concepts, research, or frameworks covered in this lesson.
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  background: msg.role === 'user' ? 'var(--blush)' : 'var(--bg)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius)',
                  padding: '10px 13px',
                }}
              >
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text)', margin: 0, lineHeight: 1.65 }}>
                  {msg.content}
                </p>
              </div>
            ))}

            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  background: 'var(--bg)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius)',
                  padding: '10px 13px',
                }}
              >
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                  Thinking…
                </p>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '12px 16px 14px',
              borderTop: '1px solid var(--border-light)',
              flexShrink: 0,
              background: 'var(--card)',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                placeholder="Ask about this lesson…"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  background: 'var(--white)',
                  color: 'var(--text)',
                  outline: 'none',
                  width: 'unset',
                  minWidth: 0,
                }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                style={{
                  background: 'var(--blush)',
                  border: '1px solid var(--mid)',
                  borderRadius: 'var(--radius)',
                  padding: '8px 14px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  color: 'var(--text)',
                  cursor: loading || !input.trim() ? 'default' : 'pointer',
                  opacity: loading || !input.trim() ? 0.45 : 1,
                  flexShrink: 0,
                  transition: 'var(--transition)',
                }}
              >
                Send
              </button>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                color: 'var(--text-muted)',
                margin: '8px 0 0',
                lineHeight: 1.5,
                letterSpacing: '0.01em',
              }}
            >
              {DISCLAIMER}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
