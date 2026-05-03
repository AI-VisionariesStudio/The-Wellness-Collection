'use client'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'
import MilestoneCelebration from '@/app/components/MilestoneCelebration'

type Certificate = {
  id: string
  serialNumber: string
  pdfPath: string
  issuedAt: string | Date
  course: { title: string }
}

type Enrollment = {
  id: string
  courseId: string
  completedAt: string | Date | null
  course: {
    title: string
    duration: number
    modules: { lessons: { id: string }[] }[]
  }
}

type Progress = { lessonId: string; completed: boolean; completedAt?: string | null }

type Course = {
  id: string
  title: string
  description: string
  price: number
  isComingSoon: boolean
  thumbnail?: string
  moduleCount?: number
}

type Props = {
  certificates: Certificate[]
  enrollments: Enrollment[]
  progress: Progress[]
  allCourses: Course[]
  enrolledIds: string[]
  streak: number
  totalCompleted: number
  isAdmin: boolean
}

export default function DashboardContent({ certificates, enrollments, progress, allCourses, enrolledIds, streak, totalCompleted, isAdmin }: Props) {
  const { lang } = useLanguage()
  const T = t[lang].dashboard
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', direction: dir }}>

      {/* ── Hero ── */}
      <section style={{ background: 'var(--cream)', padding: '40px 20px 32px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <img
          src="/twc-logo.svg"
          alt="Gracefully Redefined"
          style={{ width: '100px', height: '100px', objectFit: 'contain', display: 'block', margin: '0 auto 20px' }}
        />
        <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '14px' }}>The Wellness Collection</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 40px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.1, margin: 0 }}>Administrative Dashboard</h1>
        <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '20px auto 0' }} />
      </section>

      <MilestoneCelebration totalCompleted={totalCompleted} streak={streak} />

      <main style={{ maxWidth: '1060px', margin: '0 auto', padding: '48px 20px 80px' }}>

        {/* ── Certificates ── */}
        {certificates.length > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '8px', textAlign: 'center' }}>
              {T.certificates}
            </p>
            <div style={{ width: '32px', height: '1px', background: 'var(--mid)', margin: '0 auto 36px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {certificates.map(cert => (
                <div key={cert.id} style={{ background: '#fff', border: '1px solid var(--border)', padding: '28px 32px', borderLeft: '3px solid var(--gold)', boxShadow: '0 2px 12px rgba(180,160,140,0.08)' }}>
                  <div style={{ fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px', fontWeight: 600 }}>{T.completed}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 400, color: 'var(--text)', marginBottom: '8px' }}>{cert.course.title}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>{T.serial} <strong>{cert.serialNumber}</strong></p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>{T.issued} {new Date(cert.issuedAt).toLocaleDateString()}</p>
                  <a href={cert.pdfPath} download className="btn btn-outline" style={{ fontSize: '11px', letterSpacing: '0.12em', padding: '9px 20px' }}>
                    {T.downloadCert}
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Learning Streak ── */}
        {streak > 0 && (
          <section style={{ marginBottom: '64px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2520 100%)',
              padding: '28px 36px',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
            }}>
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '52px', fontWeight: 300, color: 'var(--gold, #c8922a)', lineHeight: 1 }}>{streak}</div>
                <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>
                  {streak === 1 ? 'Day' : 'Days'}
                </div>
              </div>
              <div style={{ width: '1px', height: '48px', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, color: '#fff', marginBottom: '6px' }}>
                  {streak === 1 ? "You're on your way." : streak >= 7 ? 'A week of intentional growth.' : `${streak} days of showing up.`}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                  {streak === 1 ? 'Every journey begins with a single step. Keep going.' : streak >= 7 ? 'Consistency is how understanding becomes transformation.' : 'Small, steady effort is how lasting change is built.'}
                </div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: '28px', color: 'var(--gold, #c8922a)', flexShrink: 0 }}>✦</div>
            </div>
          </section>
        )}

        {/* ── All Courses ── */}
        <section>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
            {allCourses.map(course => {
              const isEnrolled = enrolledIds.includes(course.id)
              const enrollment = enrollments.find(e => e.courseId === course.id)
              const allLessons = enrollment ? enrollment.course.modules.flatMap(m => m.lessons) : []
              const completedCount = allLessons.length > 0
                ? progress.filter(p => allLessons.find(l => l.id === p.lessonId) && p.completed).length
                : 0
              const pct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0

              return (
                <div key={course.id} style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 20px rgba(180,160,140,0.10)',
                }}>
                  {course.isComingSoon && (
                    <div style={{ position: 'absolute', top: '18px', right: '18px', background: 'var(--text-muted)', color: '#fff', padding: '4px 14px', borderRadius: '100px', fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', zIndex: 1 }}>
                      {T.comingSoon}
                    </div>
                  )}
                  {isEnrolled && !course.isComingSoon && (
                    <div style={{ position: 'absolute', top: '18px', left: '18px', background: 'var(--success)', color: '#fff', padding: '4px 14px', borderRadius: '100px', fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', zIndex: 1 }}>
                      Enrolled
                    </div>
                  )}

                  <div style={{ width: '100%', height: '140px', background: 'var(--cream)', borderBottom: '1px solid var(--border)', backgroundImage: `url(${course.thumbnail || '/twc-logo.svg'})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: course.thumbnail ? 'contain' : '64px 64px' }} />

                  <div style={{ padding: '18px 24px', flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 400, color: 'var(--text)', marginBottom: '6px', lineHeight: 1.2 }}>
                      {course.title}
                    </h3>
                    <div style={{ width: '24px', height: '1px', background: 'var(--border)', margin: '0 auto 10px' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                      {course.description}
                    </p>

                    {/* Progress bar for enrolled */}
                    {isEnrolled && allLessons.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <div className="progress-bar" style={{ marginBottom: '6px' }}>
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.06em', margin: 0 }}>{pct}{T.pctComplete}</p>
                      </div>
                    )}

                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {course.isComingSoon ? (
                        <button disabled style={{ padding: '8px 0', background: 'var(--border)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: '10px', letterSpacing: '0.12em', cursor: 'not-allowed', opacity: 0.7 }}>
                          {T.comingSoon}
                        </button>
                      ) : (
                        <>
                          {!isEnrolled && !isAdmin && (
                            <div style={{ marginBottom: '2px' }}>
                              <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 300, color: 'var(--text)' }}>
                                ${(course.price / 100).toFixed(0)}
                              </span>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.06em', marginLeft: '6px', textTransform: 'uppercase' }}>
                                {course.moduleCount ?? ''} {T.modules}
                              </span>
                            </div>
                          )}
                          {isEnrolled ? (
                            <Link href={`/learn/${course.id}`} className="btn btn-outline" style={{ justifyContent: 'center', display: 'flex', fontSize: '10px', letterSpacing: '0.12em', padding: '8px 16px' }}>
                              {enrollment?.completedAt ? 'Review Course →' : (pct === 0 ? T.startCourse : `${T.continue} →`)}
                            </Link>
                          ) : (
                            <Link href={`/courses/${course.id}`} className="btn btn-outline" style={{ justifyContent: 'center', display: 'flex', fontSize: '10px', letterSpacing: '0.12em', padding: '8px 16px' }}>
                              {T.viewCourse}
                            </Link>
                          )}
                          {isAdmin && (
                            <Link href={`/admin/courses/${course.id}`} style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '0.08em', textAlign: 'center', textDecoration: 'none' }}>
                              Edit Course →
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

      </main>
    </div>
  )
}
