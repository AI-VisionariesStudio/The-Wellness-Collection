'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

type Props = {
  lessonId: string
  lessonTitle: string
}

const PROMPTS = [
  'What resonated most with you in this lesson?',
  'What did this bring up for you personally?',
  'How might you apply something from this lesson in your life?',
  'What surprised you — about the content, or about yourself?',
  'What would you like to remember from this lesson?',
]

export default function JournalDrawer({ lessonId, lessonTitle }: Props) {
  const [open, setOpen] = useState(false)
  const [body, setBody] = useState('')
  const [saved, setSaved] = useState(true)
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState(PROMPTS[0])
  useEffect(() => { setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]) }, [])
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load existing entry when opened
  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch(`/api/journal?lessonId=${lessonId}`)
      .then(r => r.json())
      .then(data => { setBody(data.body || ''); setLoading(false) })
      .catch(() => setLoading(false))
  }, [open, lessonId])

  // Auto-focus textarea when opened
  useEffect(() => {
    if (open && !loading) {
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [open, loading])

  const handleChange = useCallback((value: string) => {
    setBody(value)
    setSaved(false)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, body: value }),
      })
      setSaved(true)
    }, 1200)
  }, [lessonId])

  return (
    <>
      <style>{`
        .journal-drawer {
          position: fixed;
          bottom: 0;
          right: 0;
          width: 420px;
          max-width: 100vw;
          z-index: 200;
          font-family: var(--font-body, Georgia, serif);
        }
        .journal-tab {
          position: absolute;
          bottom: 100%;
          right: 32px;
          background: var(--blush, #e8c4b8);
          color: var(--text, #1a1a1a);
          border: none;
          padding: 10px 20px 8px;
          border-radius: 8px 8px 0 0;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .journal-tab:hover { background: #ddb0a0; }
        .journal-panel {
          background: #fff;
          border-top: 1px solid var(--border, #e0d8d0);
          border-left: 1px solid var(--border, #e0d8d0);
          box-shadow: -4px 0 40px rgba(0,0,0,0.12);
          height: 0;
          overflow: hidden;
          transition: height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .journal-panel.open { height: 420px; }
        .journal-inner { padding: 28px 28px 20px; height: 100%; display: flex; flex-direction: column; }
        .journal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
        .journal-title { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted, #888); }
        .journal-lesson { font-size: 14px; color: var(--text, #1a1a1a); margin-top: 4px; font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px; }
        .journal-close { background: none; border: none; cursor: pointer; color: var(--text-muted, #888); font-size: 20px; line-height: 1; padding: 0; }
        .journal-prompt { font-size: 13px; color: var(--gold, #c8922a); font-style: italic; margin-bottom: 14px; line-height: 1.5; }
        .journal-textarea {
          flex: 1;
          width: 100%;
          border: 1px solid var(--border, #e0d8d0);
          border-radius: 6px;
          padding: 14px;
          font-size: 14px;
          line-height: 1.75;
          color: var(--text, #1a1a1a);
          resize: none;
          font-family: Georgia, serif;
          background: #fdfaf6;
          outline: none;
          transition: border-color 0.2s;
        }
        .journal-textarea:focus { border-color: var(--gold, #c8922a); }
        .journal-textarea::placeholder { color: #bbb; font-style: italic; }
        .journal-footer { display: flex; justify-content: flex-end; margin-top: 10px; }
        .journal-status { font-size: 11px; color: var(--text-muted, #aaa); letter-spacing: 0.06em; }
        @media (max-width: 640px) {
          .journal-drawer { width: 100vw; }
          .journal-tab { right: 16px; }
        }
      `}</style>

      <div className="journal-drawer">
        <button
          className="journal-tab"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close journal' : 'Open journal'}
        >
          <span style={{ fontSize: '14px' }}>✦</span>
          My Journal
          <span style={{ fontSize: '10px', opacity: 0.7 }}>{open ? '▼' : '▲'}</span>
        </button>

        <div className={`journal-panel${open ? ' open' : ''}`}>
          <div className="journal-inner">
            <div className="journal-header">
              <div>
                <div className="journal-title">Lesson Journal</div>
                <div className="journal-lesson">{lessonTitle}</div>
              </div>
              <button className="journal-close" onClick={() => setOpen(false)}>×</button>
            </div>

            {loading ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                Loading your notes…
              </div>
            ) : (
              <>
                <div className="journal-prompt">"{prompt}"</div>
                <textarea
                  ref={textareaRef}
                  className="journal-textarea"
                  value={body}
                  onChange={e => handleChange(e.target.value)}
                  placeholder="Your thoughts are private and belong only to you…"
                />
                <div className="journal-footer">
                  <span className="journal-status">
                    {saved ? (body ? '✓ Saved' : '') : 'Saving…'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
