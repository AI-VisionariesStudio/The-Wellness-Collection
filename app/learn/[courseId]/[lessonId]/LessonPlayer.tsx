'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CourseCompanion from '@/app/components/CourseCompanion'
import ReflectionPulse from '@/app/components/ReflectionPulse'
import VdoCipherPlayer from '@/app/components/VdoCipherPlayer'

interface Lesson {
  id: string
  title: string
  description?: string | null
  backedResearch?: string | null
  vdoCipherId?: string | null
  documentUrl?: string | null
  documentName?: string | null
  duration: number
}

interface Course {
  id: string
  title: string
  modules: { id: string; title: string; evidenceDocumentUrl?: string | null; lessons: Lesson[] }[]
}

interface Props {
  course: Course
  lesson: Lesson
  allLessons: Lesson[]
  completedIds: string[]
  prevLessonId: string | null
  nextLessonId: string | null
  initialWatchedSecs: number
  isCompleted: boolean
  isAdmin: boolean
  documentViewUrl: string | null
}

// ── Document viewer ────────────────────────────────────────────────────────────
function DocumentViewer({ viewUrl, name }: { viewUrl: string; name: string }) {
  const ext = viewUrl.split('?')[0].split('.').pop()?.toLowerCase() || ''
  const isPdf = ext === 'pdf'
  const isLocal = viewUrl.includes('localhost') || viewUrl.includes('127.0.0.1')
  const googleUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(viewUrl)}&embedded=true`
  const officeUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(viewUrl)}`

  if (isLocal) {
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ padding: '32px 32px 24px', background: 'var(--bg)' }}>
          <img src="/GR-LOGO-OVAL.svg" alt="Gracefully Redefined"
            style={{ width: '90px', height: 'auto', borderRadius: '50%', mixBlendMode: 'multiply' }} />
        </div>
        <div style={{ padding: '24px 32px 32px', background: 'var(--header)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, color: 'var(--text)', marginBottom: '8px' }}>{name}</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
            In-page preview is available in production.<br />Open the file directly to view it now.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={viewUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '12px', padding: '10px 20px' }}>Open File</a>
            <a href={isPdf ? googleUrl : officeUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ fontSize: '12px', padding: '10px 20px' }}>
              {isPdf ? 'Open in Google Docs' : 'Open in Office Online'}
            </a>
          </div>
        </div>
      </div>
    )
  }

  if (isPdf) {
    return (
      <div>
        <iframe src={googleUrl} title={name}
          style={{ width: '100%', height: '75vh', minHeight: '500px', border: 'none', borderRadius: 'var(--radius)' }}
          allowFullScreen />
        <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', letterSpacing: '0.03em' }}>
          Having trouble viewing?{' '}
          <a href={viewUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text)', textDecoration: 'underline', textDecorationColor: 'var(--border)' }}>
            Open PDF directly
          </a>
        </p>
      </div>
    )
  }

  return (
    <div>
      <iframe src={officeUrl} title={name}
        style={{ width: '100%', height: '75vh', minHeight: '500px', border: 'none', borderRadius: 'var(--radius)' }}
        allowFullScreen />
      <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', letterSpacing: '0.03em' }}>
        Having trouble viewing?{' '}
        <a href={googleUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text)', textDecoration: 'underline', textDecorationColor: 'var(--border)' }}>
          Open in Google Docs
        </a>
      </p>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function LessonPlayer({
  course,
  lesson,
  allLessons,
  completedIds,
  prevLessonId,
  nextLessonId,
  isCompleted: initialCompleted,
  isAdmin,
  documentViewUrl,
}: Props) {
  const router = useRouter()
  const [completed, setCompleted] = useState(initialCompleted)
  const [marking, setMarking] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [companionOpen, setCompanionOpen] = useState(false)
  const [resetting, setResetting] = useState<string | null>(null)
  const [showPrePulse, setShowPrePulse] = useState(true)
  const [showPostPulse, setShowPostPulse] = useState(false)
  const currentModule = course.modules.find(m => m.lessons.some(l => l.id === lesson.id))
  const moduleTitle = currentModule?.title ?? ''

  const resetLesson = useCallback(async (lessonId: string) => {
    setResetting(lessonId)
    await fetch('/api/admin/progress', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId }),
    })
    setResetting(null)
    router.refresh()
  }, [router])

  const markComplete = useCallback(async () => {
    if (completed || marking) return
    setMarking(true)
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: lesson.id, watchedSecs: lesson.duration, completed: true }),
    })
    setCompleted(true)
    setMarking(false)
    if (nextLessonId) {
      router.push(`/learn/${course.id}/${nextLessonId}`)
    } else {
      router.push(`/learn/${course.id}/complete`)
    }
  }, [completed, marking, lesson.id, lesson.duration, nextLessonId, course.id, router])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── Lesson top bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--header)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        height: '52px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '16px',
      }}>
        <Link href={`/courses/${course.id}`} style={{ fontFamily: 'var(--font-body)', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          ← {course.title}
        </Link>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', letterSpacing: '0.06em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {completedIds.length} / {allLessons.length} complete
        </span>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '6px 14px', fontSize: '12px', fontFamily: 'var(--font-body)', letterSpacing: '0.06em', cursor: 'pointer', color: 'var(--text)', whiteSpace: 'nowrap' }}
        >
          {sidebarOpen ? 'Hide' : 'Lessons'}
        </button>
      </div>

      {/* ── Body: sidebar + main content + companion panel ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>

        {/* Sidebar — sticky, stays at top-left as user scrolls */}
        {sidebarOpen && (
          <aside style={{
            width: '260px',
            flexShrink: 0,
            position: 'sticky',
            top: '52px',
            height: 'calc(100vh - 52px)',
            overflowY: 'auto',
            background: 'var(--card)',
            borderRight: '1px solid var(--border)',
          }}>
            {course.modules.map((mod, mi) => (
              <div key={mod.id}>
                <div style={{ padding: '14px 20px', background: 'var(--header)', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 700, color: 'var(--text)', margin: 0, letterSpacing: '0.02em' }}>
                    Module {mi + 1}
                  </p>
                </div>

                {mod.lessons.map((l, li) => {
                  const isDone = completedIds.includes(l.id)
                  const isCurrent = l.id === lesson.id
                  return (
                    <div key={l.id} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '11px 18px',
                      borderBottom: '1px solid var(--border-light)',
                      background: isCurrent ? 'var(--blush)' : 'transparent',
                    }}>
                      <Link
                        href={`/learn/${course.id}/${l.id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0, textDecoration: 'none' }}
                      >
                        <div style={{
                          width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                          background: isDone ? 'var(--success)' : isCurrent ? 'var(--border)' : 'var(--border-light)',
                          color: isDone ? 'white' : 'var(--text-muted)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', fontWeight: 600,
                        }}>
                          {isDone ? '✓' : li + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: isCurrent ? 'var(--text)' : 'var(--text-muted)', margin: 0, fontWeight: isCurrent ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {l.title}
                          </p>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                            {Math.floor(l.duration / 60)} min
                          </p>
                        </div>
                      </Link>
                      {isAdmin && isDone && (
                        <button
                          onClick={() => resetLesson(l.id)}
                          disabled={resetting === l.id}
                          title="Reset completion"
                          style={{ background: 'none', border: 'none', cursor: resetting === l.id ? 'default' : 'pointer', padding: '4px', color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1, flexShrink: 0, opacity: resetting === l.id ? 0.4 : 0.6 }}
                        >×</button>
                      )}
                    </div>
                  )
                })}

                <Link
                  href={`/learn/${course.id}/reflection`}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 18px', borderBottom: '1px solid var(--border)', background: 'var(--mid)', textDecoration: 'none' }}
                >
                  <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'var(--mid)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>✎</div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', letterSpacing: '0.04em', color: 'var(--text)', margin: 0, fontWeight: 500 }}>
                      Module Reflection &amp; Check-In
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Comprehension + personal reflection
                    </p>
                  </div>
                </Link>
                <Link
                  href={`/learn/${course.id}/evidence/${mod.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg)', textDecoration: 'none' }}
                >
                  <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>⊕</div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', letterSpacing: '0.04em', color: 'var(--text)', margin: 0, fontWeight: 500 }}>
                      Evidence Based Documentation
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Research &amp; source materials
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </aside>
        )}

        {/* ── Main content column ── */}
        <main style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <div style={{ maxWidth: '760px', marginLeft: sidebarOpen ? 'max(0px, calc(50vw - 640px))' : 'auto', marginRight: 'auto', padding: '32px 28px 64px' }}>

            {/* Lesson title + actions row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 300, color: 'var(--text)', margin: '0 0 4px', lineHeight: 1.3 }}>
                  {lesson.title}
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'var(--text-muted)', margin: 0, letterSpacing: '0.03em' }}>
                  {Math.floor(lesson.duration / 60)} min
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setCompanionOpen(o => !o)}
                  className="btn btn-outline"
                  style={{ fontSize: '11px', padding: '10px 18px', letterSpacing: '0.1em', background: companionOpen ? 'var(--blush)' : undefined }}
                >
                  ✦ Ask AI
                </button>
                <button
                  onClick={markComplete}
                  disabled={completed || marking}
                  className="btn btn-primary"
                  style={{
                    background: completed ? 'var(--success)' : undefined,
                    color: completed ? 'white' : undefined,
                    opacity: marking ? 0.7 : 1,
                  }}
                >
                  {completed ? '✓ Completed' : marking ? 'Saving…' : nextLessonId ? 'Mark Complete & Next →' : 'Mark Complete ✓'}
                </button>
              </div>
            </div>

            {lesson.description && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: '28px' }}>
                {lesson.description}
              </p>
            )}

            {/* PRE pulse + video */}
            {lesson.vdoCipherId && (
              <div>
                {showPrePulse && (
                  <ReflectionPulse
                    stage="PRE"
                    lessonId={lesson.id}
                    lessonTitle={lesson.title}
                    moduleTitle={moduleTitle}
                    onDismiss={() => setShowPrePulse(false)}
                  />
                )}
                <div style={{ position: 'relative', borderRadius: showPrePulse ? '0 0 var(--radius-lg) var(--radius-lg)' : 'var(--radius-lg)', overflow: 'hidden' }}>
                  <VdoCipherPlayer
                    videoId={lesson.vdoCipherId}
                    lessonId={lesson.id}
                    onEnded={() => setShowPostPulse(true)}
                  />
                  {showPrePulse && !isAdmin && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 2, cursor: 'default' }} />
                  )}
                </div>
              </div>
            )}

            {/* Prev / Next navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '32px', marginTop: '40px', borderTop: '1px solid var(--border-light)' }}>
              {prevLessonId ? (
                <Link href={`/learn/${course.id}/${prevLessonId}`} className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  ← Previous
                </Link>
              ) : <span />}
              {nextLessonId ? (
                <Link href={`/learn/${course.id}/${nextLessonId}`} className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '13px' }}>
                  Next →
                </Link>
              ) : (
                <Link href={`/learn/${course.id}/complete`} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }}>
                  Finish Course →
                </Link>
              )}
            </div>

            {/* Document / PowerPoint viewer — bottom of content */}
            {documentViewUrl && (
              <div style={{ marginTop: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                  <div style={{ flex: 1, height: '2px', background: 'var(--mid)' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap', padding: '0 4px' }}>
                    Lesson Plan
                  </span>
                  <div style={{ flex: 1, height: '2px', background: 'var(--mid)' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0 }}>
                    {lesson.documentName || 'Document'}
                  </p>
                  {isAdmin && (
                    <a href={`/api/lesson/${lesson.id}/document`} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'underline', textDecorationColor: 'var(--border)' }}>
                      Download
                    </a>
                  )}
                </div>
                <DocumentViewer viewUrl={documentViewUrl} name={lesson.documentName || 'Document'} />
              </div>
            )}

          </div>
        </main>

        {/* ── Course Companion — sticky right column ── */}
        <CourseCompanion
          courseTitle={course.title}
          moduleTitle={moduleTitle}
          lessonTitle={lesson.title}
          lessonDescription={lesson.description}
          backedResearch={lesson.backedResearch}
          open={companionOpen}
          onClose={() => setCompanionOpen(false)}
        />
      </div>

      {/* POST Reflection Pulse — full-screen modal, triggered when video finishes */}
      {showPostPulse && (
        <ReflectionPulse
          stage="POST"
          lessonId={lesson.id}
          lessonTitle={lesson.title}
          moduleTitle={moduleTitle}
          onDismiss={() => setShowPostPulse(false)}
        />
      )}
    </div>
  )
}
