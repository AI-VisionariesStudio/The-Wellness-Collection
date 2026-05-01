'use client'
import { useState } from 'react'

interface User { id: string; name: string; email: string }
interface Course { id: string; title: string }

export default function ManualEnrollment({ users, courses }: { users: User[]; courses: Course[] }) {
  const [userId, setUserId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || !courseId) return
    setStatus('loading')
    setMessage('')
    const res = await fetch('/api/admin/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId }),
    })
    const data = await res.json()
    if (res.ok) {
      setStatus('success')
      setMessage(`Enrolled ${data.user.name} in ${data.course.title}.`)
      setUserId('')
      setCourseId('')
    } else {
      setStatus('error')
      setMessage(data.error || 'Enrollment failed.')
    }
  }

  return (
    <div className="card" style={{ padding: '32px' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 400, color: 'var(--text)', marginBottom: '20px' }}>
        Issue Complimentary Enrollment
      </h3>

      {status === 'success' && (
        <div style={{ background: '#e8f5ec', color: '#2d6a3f', padding: '12px 16px', borderRadius: 'var(--radius)', marginBottom: '16px', fontSize: '14px' }}>
          {message}
        </div>
      )}
      {status === 'error' && (
        <div style={{ background: '#fef2f2', color: '#c0392b', padding: '12px 16px', borderRadius: 'var(--radius)', marginBottom: '16px', fontSize: '14px' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Student</label>
          <select value={userId} onChange={e => setUserId(e.target.value)} required>
            <option value="">Select student...</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} — {u.email}</option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Course</label>
          <select value={courseId} onChange={e => setCourseId(e.target.value)} required>
            <option value="">Select course...</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={status === 'loading' || !userId || !courseId}
          style={{ whiteSpace: 'nowrap' }}
        >
          {status === 'loading' ? 'Enrolling…' : 'Enroll Free'}
        </button>
      </form>
    </div>
  )
}
