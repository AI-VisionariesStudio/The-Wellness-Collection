'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function AdminCourseEditorPage() {
  const params = useParams()
  const courseId = params.id as string
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch(`/api/admin/courses/${courseId}?lessons=true`)
      .then(r => r.json())
      .then(data => { setCourse(data); setLoading(false) })
  }, [courseId])

  async function addLesson(moduleId: string) {
    const res = await fetch(`/api/admin/lessons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleId, title: 'New Lesson', description: '', videoUrl: '', duration: 2700, order: 99 })
    })
    const newLesson = await res.json()
    setCourse((prev: any) => ({
      ...prev,
      modules: prev.modules.map((m: any) =>
        m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
      )
    }))
  }

  async function updateLesson(lessonId: string, _moduleId: string, field: string, value: any) {
    setSaving(true)
    await fetch(`/api/admin/lessons/${lessonId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value })
    })
    setSaving(false)
  }

  async function uploadDocument(lessonId: string, moduleId: string, file: File) {
    setUploading(prev => ({ ...prev, [lessonId]: true }))
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) {
      handleLessonChange(lessonId, moduleId, 'documentUrl', data.url)
      handleLessonChange(lessonId, moduleId, 'documentName', data.name)
      await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentUrl: data.url, documentName: data.name }),
      })
    } else {
      alert(data.error || 'Upload failed')
    }
    setUploading(prev => ({ ...prev, [lessonId]: false }))
  }

  async function removeDocument(lessonId: string, moduleId: string) {
    handleLessonChange(lessonId, moduleId, 'documentUrl', null)
    handleLessonChange(lessonId, moduleId, 'documentName', null)
    await fetch(`/api/admin/lessons/${lessonId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentUrl: null, documentName: null }),
    })
  }

  async function deleteLesson(lessonId: string, moduleId: string) {
    if (!confirm('Delete this lesson?')) return
    await fetch(`/api/admin/lessons/${lessonId}`, { method: 'DELETE' })
    setCourse((prev: any) => ({
      ...prev,
      modules: prev.modules.map((m: any) =>
        m.id === moduleId ? { ...m, lessons: m.lessons.filter((l: any) => l.id !== lessonId) } : m
      )
    }))
  }

  function handleLessonChange(lessonId: string, moduleId: string, field: string, value: any) {
    setCourse((prev: any) => ({
      ...prev,
      modules: prev.modules.map((m: any) =>
        m.id === moduleId ? {
          ...m,
          lessons: m.lessons.map((l: any) => l.id === lessonId ? { ...l, [field]: value } : l)
        } : m
      )
    }))
  }

  async function addModule() {
    const res = await fetch(`/api/admin/modules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, title: 'New Module', order: 99 })
    })
    const newModule = await res.json()
    setCourse((prev: any) => ({ ...prev, modules: [...prev.modules, { ...newModule, lessons: [] }] }))
  }

  async function updateModule(moduleId: string, field: string, value: any) {
    await fetch(`/api/admin/modules/${moduleId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value }),
    })
  }

  function handleModuleChange(moduleId: string, field: string, value: any) {
    setCourse((prev: any) => ({
      ...prev,
      modules: prev.modules.map((m: any) => m.id === moduleId ? { ...m, [field]: value } : m),
    }))
  }

  async function deleteModule(moduleId: string) {
    if (!confirm('Delete this module and all its lessons? This cannot be undone.')) return
    await fetch(`/api/admin/modules/${moduleId}`, { method: 'DELETE' })
    setCourse((prev: any) => ({
      ...prev,
      modules: prev.modules.filter((m: any) => m.id !== moduleId),
    }))
  }

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '24px' }}>Loading...</div>
  if (!course) return <div style={{ padding: '80px', textAlign: 'center' }}>Course not found</div>

  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '48px 40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <Link href="/admin/courses" style={{ fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>← Course Editor</Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 300, marginTop: '8px' }}>{course.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            {saving ? 'Saving...' : 'Changes save automatically'}
          </p>
        </div>

        <div style={{ display: 'grid', gap: '32px' }}>
          {course.modules?.map((module: any, mi: number) => (
            <div key={module.id} className="card" style={{ overflow: 'hidden' }}>
              <div style={{ padding: '16px 28px', background: 'var(--header)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Module {mi + 1}:</span>
                  <input
                    value={module.title}
                    onChange={e => handleModuleChange(module.id, 'title', e.target.value)}
                    onFocus={e => (e.target.style.borderBottomColor = 'var(--border)')}
                    onBlur={e => { updateModule(module.id, 'title', e.target.value); e.target.style.borderBottomColor = 'transparent' }}
                    style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 400, border: 'none', background: 'transparent', outline: 'none', flex: 1, color: 'var(--text)', padding: '2px 4px', borderBottom: '1px solid transparent', cursor: 'text' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button onClick={() => addLesson(module.id)} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '12px' }}>
                    + Add Lesson
                  </button>
                  <button onClick={() => deleteModule(module.id)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '12px' }}>
                    Delete Module
                  </button>
                </div>
              </div>

              <div>
                {module.lessons?.map((lesson: any, li: number) => (
                  <div key={lesson.id} style={{ padding: '24px 28px', borderBottom: '1px solid var(--border)', background: 'white' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Lesson {li + 1} Title</label>
                        <input
                          value={lesson.title}
                          onChange={e => handleLessonChange(lesson.id, module.id, 'title', e.target.value)}
                          onBlur={e => updateLesson(lesson.id, module.id, 'title', e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Duration (seconds — e.g. 2700 = 45min)</label>
                        <input
                          type="number"
                          value={lesson.duration}
                          onChange={e => handleLessonChange(lesson.id, module.id, 'duration', parseInt(e.target.value))}
                          onBlur={e => updateLesson(lesson.id, module.id, 'duration', parseInt(e.target.value))}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                        <label>Spotlightr Video URL</label>
                        <input
                          value={lesson.videoUrl || ''}
                          placeholder="https://subdomain.cdn.spotlightr.com/watch/ABC123"
                          onChange={e => handleLessonChange(lesson.id, module.id, 'videoUrl', e.target.value)}
                          onBlur={e => updateLesson(lesson.id, module.id, 'videoUrl', e.target.value)}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                        <label>Document Attachment</label>
                        {lesson.documentUrl ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--white)' }}>
                            <span style={{ fontSize: '18px' }}>📄</span>
                            <a href={lesson.documentUrl} target="_blank" rel="noreferrer" style={{ flex: 1, fontSize: '14px', color: 'var(--text)', textDecoration: 'underline', textDecorationColor: 'var(--border)' }}>
                              {lesson.documentName || lesson.documentUrl.split('/').pop()}
                            </a>
                            <button
                              type="button"
                              onClick={() => removeDocument(lesson.id, module.id)}
                              style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase' }}
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label style={{ all: 'unset', display: 'block', cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 16px', border: '1px dashed var(--border)', borderRadius: 'var(--radius)', background: 'var(--white)', color: 'var(--text-muted)', fontSize: '14px' }}>
                              {uploading[lesson.id]
                                ? <><span>⏳</span> Uploading…</>
                                : <><span>📎</span> Click to upload PDF, Word, Excel, or PowerPoint</>
                              }
                            </div>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                              style={{ display: 'none' }}
                              disabled={uploading[lesson.id]}
                              onChange={e => {
                                const file = e.target.files?.[0]
                                if (file) uploadDocument(lesson.id, module.id, file)
                                e.target.value = ''
                              }}
                            />
                          </label>
                        )}
                      </div>
                      <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                        <label>Lesson Description</label>
                        <textarea
                          rows={2}
                          value={lesson.description || ''}
                          onChange={e => handleLessonChange(lesson.id, module.id, 'description', e.target.value)}
                          onBlur={e => updateLesson(lesson.id, module.id, 'description', e.target.value)}
                          style={{ resize: 'vertical' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
                        <label>Backed Research (AI Companion source content)</label>
                        <textarea
                          rows={6}
                          value={lesson.backedResearch || ''}
                          placeholder="Paste the research, frameworks, citations, and key concepts the AI should draw from when answering questions about this lesson…"
                          onChange={e => handleLessonChange(lesson.id, module.id, 'backedResearch', e.target.value)}
                          onBlur={e => updateLesson(lesson.id, module.id, 'backedResearch', e.target.value)}
                          style={{ resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={() => deleteLesson(lesson.id, module.id)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '13px' }}>
                        Delete Lesson
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '32px' }}>
          <button onClick={addModule} className="btn btn-outline">+ Add Module</button>
        </div>
      </div>
    </div>
  )
}