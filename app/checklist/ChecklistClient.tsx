'use client'
import { useState } from 'react'

export type ItemState = { checked: boolean; checkedBy: string | null; checkedAt: Date | null; note: string | null }
export type StateMap = Record<string, ItemState>

export type ChecklistItem = {
  key: string
  title: string
  subtitle?: string
  tag?: string
}

export type Section = {
  key: string
  icon: string
  title: string
  items: ChecklistItem[]
}

const TAG_COLORS: Record<string, string> = {
  critical: '#dc2626',
  security: '#7c3aed',
  payment:  '#2563eb',
  content:  '#059669',
  legal:    '#d97706',
}

export default function ChecklistClient({ sections, initial }: { sections: Section[]; initial: StateMap }) {
  const [states, setStates] = useState<StateMap>(initial)
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [noteText, setNoteText] = useState('')
  const [checkerName, setCheckerName] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('checklist-name') ?? 'Admin'
    return 'Admin'
  })
  const [editingName, setEditingName] = useState(false)

  const totalItems = sections.reduce((n, s) => n + s.items.length, 0)
  const checkedCount = Object.values(states).filter(s => s.checked).length
  const pct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  async function toggle(key: string) {
    const current = states[key]?.checked ?? false
    const next = !current
    setStates(prev => ({
      ...prev,
      [key]: { ...prev[key], checked: next, checkedBy: next ? checkerName : null, checkedAt: next ? new Date() : null, note: prev[key]?.note ?? null },
    }))
    setSaving(prev => ({ ...prev, [key]: true }))
    await fetch('/api/admin/checklist', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemKey: key, checked: next, checkedBy: next ? checkerName : null }),
    })
    setSaving(prev => ({ ...prev, [key]: false }))
  }

  async function saveNote(key: string) {
    setStates(prev => ({ ...prev, [key]: { ...prev[key], note: noteText || null } }))
    setEditingNote(null)
    await fetch('/api/admin/checklist', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemKey: key, checked: states[key]?.checked ?? false, note: noteText || null }),
    })
  }

  function saveName(name: string) {
    setCheckerName(name)
    localStorage.setItem('checklist-name', name)
    setEditingName(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)', padding: '48px 40px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '12px' }}>
            Gracefully Redefined · The Wellness Collection
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '40px', fontWeight: 300, color: 'var(--text)', marginBottom: '8px' }}>
            Pre-Launch Checklist
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            {checkedCount} of {totalItems} items complete
          </p>

          {/* Progress bar */}
          <div style={{ height: '6px', background: 'var(--border)', borderRadius: '99px', overflow: 'hidden', marginBottom: '12px' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#16a34a' : 'var(--gold)', borderRadius: '99px', transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pct}% complete</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Checking as:</span>
              {editingName ? (
                <input
                  autoFocus
                  defaultValue={checkerName}
                  onBlur={e => saveName(e.target.value || 'Admin')}
                  onKeyDown={e => e.key === 'Enter' && saveName((e.target as HTMLInputElement).value || 'Admin')}
                  style={{ fontSize: '12px', padding: '3px 8px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)', width: '120px' }}
                />
              ) : (
                <button onClick={() => setEditingName(true)} style={{ fontSize: '12px', color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
                  {checkerName}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sections */}
        {sections.map(section => {
          const sectionChecked = section.items.filter(i => states[i.key]?.checked).length
          return (
            <div key={section.key} style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '18px' }}>{section.icon}</span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 400, color: 'var(--text)', margin: 0, flex: 1 }}>
                  {section.title}
                </h2>
                <span style={{ fontSize: '12px', color: sectionChecked === section.items.length ? '#16a34a' : 'var(--text-muted)' }}>
                  {sectionChecked}/{section.items.length}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {section.items.map(item => {
                  const st = states[item.key]
                  const isChecked = st?.checked ?? false
                  const isSaving = saving[item.key]

                  return (
                    <div key={item.key} className="card" style={{ padding: '14px 18px', opacity: isSaving ? 0.7 : 1, transition: 'opacity 0.15s', background: isChecked ? 'var(--cream)' : '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <button
                          onClick={() => toggle(item.key)}
                          disabled={isSaving}
                          style={{
                            width: '20px', height: '20px', flexShrink: 0, marginTop: '1px',
                            border: isChecked ? 'none' : '2px solid var(--border)',
                            borderRadius: '4px', background: isChecked ? 'var(--gold)' : 'transparent',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          {isChecked && <span style={{ color: '#fff', fontSize: '12px', lineHeight: 1 }}>✓</span>}
                        </button>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '14px', color: isChecked ? 'var(--text-muted)' : 'var(--text)', textDecoration: isChecked ? 'line-through' : 'none', fontWeight: 500 }}>
                              {item.title}
                            </span>
                            {item.tag && (
                              <span style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', background: TAG_COLORS[item.tag] ?? '#888', padding: '2px 6px', borderRadius: '3px' }}>
                                {item.tag}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '3px 0 0', lineHeight: 1.5 }}>{item.subtitle}</p>
                          )}
                          {st?.checkedBy && (
                            <p style={{ fontSize: '11px', color: 'var(--mid)', margin: '4px 0 0' }}>
                              ✓ {st.checkedBy} · {st.checkedAt ? new Date(st.checkedAt).toLocaleDateString() : ''}
                            </p>
                          )}
                          {st?.note && editingNote !== item.key && (
                            <div style={{ marginTop: '6px', padding: '6px 10px', background: '#fffbeb', borderLeft: '3px solid var(--gold)', borderRadius: '2px', fontSize: '12px', color: 'var(--text-muted)' }}>
                              {st.note}
                            </div>
                          )}
                          {editingNote === item.key && (
                            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                              <input
                                autoFocus
                                value={noteText}
                                onChange={e => setNoteText(e.target.value)}
                                placeholder="Add a note…"
                                onKeyDown={e => e.key === 'Enter' && saveNote(item.key)}
                                style={{ flex: 1, fontSize: '12px', padding: '5px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-body)' }}
                              />
                              <button onClick={() => saveNote(item.key)} style={{ fontSize: '12px', padding: '5px 12px', background: 'var(--gold)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}>Save</button>
                              <button onClick={() => setEditingNote(null)} style={{ fontSize: '12px', padding: '5px 10px', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer' }}>Cancel</button>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => { setEditingNote(item.key === editingNote ? null : item.key); setNoteText(st?.note ?? '') }}
                          style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: '2px 4px' }}
                          title="Add note"
                        >
                          {st?.note ? '📝' : '+note'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {pct === 100 && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, color: 'var(--text)' }}>
              All items complete. Ready to launch.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
