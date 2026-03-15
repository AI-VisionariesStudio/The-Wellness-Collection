'use client'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

type Lesson = {
  id: string
  title: string
  duration: number
  order: number
}

type Module = {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

type Props = {
  course: {
    id: string
    title: string
    description: string | null
    price: number
    isComingSoon: boolean
    thumbnail?: string
    modules: Module[]
    outcomes: string[]
  }
  isAdmin: boolean
  enrollment: boolean
  progress: { lessonId: string; completed: boolean }[]
  pct: number
  isLoggedIn: boolean
}

export default function CourseContent({ course, isAdmin, enrollment, progress, pct, isLoggedIn }: Props) {
  const { lang } = useLanguage()
  const T = t[lang].course
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: 'var(--font-body)', direction: dir }}>
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '60px 40px 100px' }}>

        {isAdmin && (
          <div style={{ marginBottom: '28px', textAlign: 'center' }}>
            <Link href={`/admin/courses/${course.id}`} className="btn btn-outline" style={{ fontSize: '12px', padding: '8px 16px' }}>
              {T.editCourse}
            </Link>
          </div>
        )}

        {/* ── Course Card ── */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '56px' }}>
          <div style={{
            width: '100%', maxWidth: '400px',
            background: '#fff',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            position: 'relative',
            boxShadow: '0 2px 20px rgba(180,160,140,0.10)',
          }}>
            {course.isComingSoon && (
              <div style={{ position: 'absolute', top: '18px', right: '18px', background: 'var(--text-muted)', color: '#fff', padding: '4px 14px', borderRadius: '100px', fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', zIndex: 1 }}>
                {T.comingSoon}
              </div>
            )}

            {course.thumbnail ? (
              <img src={course.thumbnail} alt={course.title} style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0', borderBottom: '1px solid var(--border)' }}>
                <img src="/GR-LOGO-OVAL.JPG" alt="Gracefully Redefined" style={{ height: '150px', objectFit: 'contain' }} />
              </div>
            )}

            <div style={{ padding: '36px 40px', textAlign: 'center' }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 400, color: 'var(--text)', marginBottom: '10px', lineHeight: 1.2 }}>
                {course.title}
              </h1>
              <div style={{ width: '32px', height: '1px', background: 'var(--border)', margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.75, marginBottom: '28px' }}>
                {course.description}
              </p>

              {enrollment && (
                <div style={{ marginBottom: '24px' }}>
                  <div className="progress-bar" style={{ marginBottom: '8px' }}>
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{pct}{T.complete}</p>
                </div>
              )}

              {!enrollment && !isAdmin && (
                <div style={{ marginBottom: '20px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 300, color: 'var(--text)' }}>
                    ${(course.price / 100).toFixed(0)}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.06em', marginLeft: '10px', textTransform: 'uppercase' }}>
                    {course.modules.length} {T.modules}
                  </span>
                </div>
              )}

              {!enrollment && !isAdmin && !course.isComingSoon && isLoggedIn && (
                <Link href={`/courses/${course.id}/enroll`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', display: 'flex', fontSize: '11px', letterSpacing: '0.12em' }}>
                  {T.enrollNow}
                </Link>
              )}
              {!enrollment && !isAdmin && !course.isComingSoon && !isLoggedIn && (
                <Link href={`/login?next=/courses/${course.id}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', display: 'flex', fontSize: '11px', letterSpacing: '0.12em' }}>
                  {T.signInToEnroll}
                </Link>
              )}
              {!enrollment && !isAdmin && course.isComingSoon && (
                <button disabled className="btn" style={{ width: '100%', justifyContent: 'center', background: 'var(--border)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: '11px', letterSpacing: '0.12em', cursor: 'not-allowed', opacity: 0.7 }}>
                  {T.notAvailable}
                </button>
              )}
              {enrollment && pct < 100 && (
                <Link href={`/learn/${course.id}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', display: 'flex', fontSize: '11px', letterSpacing: '0.12em' }}>
                  {T.continueCourse}
                </Link>
              )}
              {enrollment && pct === 100 && (
                <p style={{ fontSize: '13px', color: 'var(--success)', letterSpacing: '0.06em', fontWeight: 500 }}>{T.courseComplete}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Outcomes ── */}
        {course.outcomes.length > 0 && (
          <div style={{ maxWidth: '680px', margin: '0 auto 56px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {T.whatYouLearn}
              </p>
              <div style={{ width: '32px', height: '1px', background: 'var(--border)', margin: '0 auto' }} />
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {course.outcomes.map((outcome, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', fontSize: '15px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)', lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px', fontSize: '15px' }}>✓</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Curriculum ── */}
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
              {T.curriculum}
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '34px', fontWeight: 300, color: 'var(--text)', margin: '0 0 12px' }}>
              {T.whatsInside}
            </h2>
            <div style={{ width: '32px', height: '1px', background: 'var(--border)', margin: '0 auto' }} />
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {course.modules.map((module, mi) => (
              <div key={module.id} style={{ background: '#fff', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 1px 8px rgba(180,160,140,0.06)' }}>
                <div style={{ padding: '14px 28px', background: 'var(--header)', borderBottom: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    {T.module} {mi + 1}
                  </p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 400, color: 'var(--text)', margin: 0 }}>
                    {module.title}
                  </h3>
                </div>
                <div>
                  {module.lessons.map((lesson, li) => {
                    const lessonProgress = progress.find(p => p.lessonId === lesson.id)
                    const isCompleted = lessonProgress?.completed
                    const canAccess = !!(enrollment || isAdmin)

                    return (
                      <div key={lesson.id} style={{
                        padding: '14px 28px',
                        borderBottom: '1px solid var(--border-light)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: isCompleted ? '#f8fdf9' : '#fff',
                      }}>
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: '14px' }}>{lesson.title}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', letterSpacing: '0.04em' }}>{Math.floor(lesson.duration / 60)} {T.min}</div>
                          </div>
                          <div style={{
                            width: '30px', height: '30px', borderRadius: '50%',
                            background: isCompleted ? 'var(--success)' : 'var(--header)',
                            color: isCompleted ? 'white' : 'var(--text-muted)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', fontWeight: 600, flexShrink: 0,
                            border: '1px solid var(--border)',
                          }}>
                            {isCompleted ? '✓' : li + 1}
                          </div>
                        </div>
                        {canAccess ? (
                          <Link href={`/learn/${course.id}/${lesson.id}`} className="btn btn-outline" style={{ padding: '7px 16px', fontSize: '11px', letterSpacing: '0.08em' }}>
                            {isCompleted ? T.review : T.start}
                          </Link>
                        ) : (
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>{T.enrollToAccess}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
