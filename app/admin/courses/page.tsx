'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [uploadingThumb, setUploadingThumb] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/admin/courses')
      .then(r => r.json())
      .then(data => { setCourses(data); setLoading(false) })
  }, [])

  async function updateCourse(id: string, field: string, value: any) {
    setSaving(id)
    await fetch(`/api/admin/courses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value })
    })
    setSaving(null)
  }

  async function uploadThumbnail(courseId: string, file: File) {
    setUploadingThumb(prev => ({ ...prev, [courseId]: true }))
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) {
      handleChange(courseId, 'thumbnail', data.url)
      await updateCourse(courseId, 'thumbnail', data.url)
    } else {
      alert(data.error || 'Upload failed')
    }
    setUploadingThumb(prev => ({ ...prev, [courseId]: false }))
  }

  async function addCourse() {
    const res = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Course', description: '', price: 0, isActive: false })
    })
    const newCourse = await res.json()
    setCourses([...courses, newCourse])
  }

  async function deleteCourse(id: string) {
    if (!confirm('Delete this course? This cannot be undone.')) return
    await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })
    setCourses(courses.filter(c => c.id !== id))
  }

  function handleChange(id: string, field: string, value: any) {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '24px' }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '48px 40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div>
            <Link href="/admin" style={{ fontSize: '13px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>← Admin Panel</Link>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', fontWeight: 300, marginTop: '8px' }}>Course Editor</h1>
          </div>
          <button onClick={addCourse} className="btn btn-primary">+ Add New Course</button>
        </div>

        {/* Course List */}
        <div style={{ display: 'grid', gap: '24px' }}>
          {courses.map(course => (
            <div key={course.id} className="card" style={{ padding: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>

                {/* Title */}
                <div className="form-group">
                  <label>Course Title</label>
                  <input
                    value={course.title}
                    onChange={e => handleChange(course.id, 'title', e.target.value)}
                    onBlur={e => updateCourse(course.id, 'title', e.target.value)}
                  />
                </div>

                {/* Price */}
                <div className="form-group">
                  <label>Price (in dollars — e.g. 175 = $175)</label>
                  <input
                    type="number"
                    value={Math.round(course.price / 100)}
                    onChange={e => handleChange(course.id, 'price', parseInt(e.target.value) * 100)}
                    onBlur={e => updateCourse(course.id, 'price', parseInt(e.target.value) * 100)}
                  />
                </div>

                {/* Description */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea
                    rows={3}
                    value={course.description}
                    onChange={e => handleChange(course.id, 'description', e.target.value)}
                    onBlur={e => updateCourse(course.id, 'description', e.target.value)}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Learning Outcomes */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Learning Outcomes (one per line)</label>
                  <textarea
                    rows={4}
                    value={(course.outcomes || []).join('\n')}
                    onChange={e => handleChange(course.id, 'outcomes', e.target.value.split('\n'))}
                    onBlur={e => updateCourse(course.id, 'outcomes', e.target.value.split('\n').filter((s: string) => s.trim()))}
                    placeholder={"Understand attachment styles\nImprove communication with your partner\n..."}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Thumbnail */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Course Thumbnail</label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {course.thumbnail && (
                      <img src={course.thumbnail} alt="thumbnail" style={{ height: '80px', width: '120px', objectFit: 'cover', borderRadius: 'var(--radius)', border: '1px solid var(--border)', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <input
                        value={course.thumbnail || ''}
                        placeholder="https://... or upload below"
                        onChange={e => handleChange(course.id, 'thumbnail', e.target.value)}
                        onBlur={e => updateCourse(course.id, 'thumbnail', e.target.value)}
                        style={{ marginBottom: '8px' }}
                      />
                      <label style={{ all: 'unset', cursor: 'pointer', display: 'inline-block' }}>
                        <span className="btn btn-outline" style={{ fontSize: '12px', padding: '8px 16px' }}>
                          {uploadingThumb[course.id] ? 'Uploading…' : 'Upload Image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          disabled={uploadingThumb[course.id]}
                          onChange={e => { const f = e.target.files?.[0]; if (f) uploadThumbnail(course.id, f); e.target.value = '' }}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="form-group">
                  <label>Duration (hours)</label>
                  <input
                    type="number"
                    value={course.duration}
                    onChange={e => handleChange(course.id, 'duration', parseInt(e.target.value))}
                    onBlur={e => updateCourse(course.id, 'duration', parseInt(e.target.value))}
                  />
                </div>

                {/* Order */}
                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={course.order}
                    onChange={e => handleChange(course.id, 'order', parseInt(e.target.value))}
                    onBlur={e => updateCourse(course.id, 'order', parseInt(e.target.value))}
                  />
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <label style={{ textTransform: 'none', fontSize: '14px', letterSpacing: 0, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={course.isActive}
                      onChange={e => { handleChange(course.id, 'isActive', e.target.checked); updateCourse(course.id, 'isActive', e.target.checked) }}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Active (visible to students)
                  </label>
                  <label style={{ textTransform: 'none', fontSize: '14px', letterSpacing: 0, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={course.isComingSoon ?? false}
                      onChange={e => { handleChange(course.id, 'isComingSoon', e.target.checked); updateCourse(course.id, 'isComingSoon', e.target.checked) }}
                      style={{ width: '16px', height: '16px' }}
                    />
                    Coming Soon (shows badge, disables enroll)
                  </label>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {course._count?.enrollments || 0} enrolled · {course._count?.modules || 0} modules
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {saving === course.id && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Saving...</span>}
                  <Link href={`/admin/courses/${course.id}`} className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '13px' }}>
                    {course.isComingSoon ? 'Coming Soon' : 'Edit Course →'}
                  </Link>
                  <button onClick={() => deleteCourse(course.id)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontSize: '13px' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
