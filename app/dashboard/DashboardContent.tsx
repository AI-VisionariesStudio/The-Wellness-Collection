'use client'
import Link from 'next/link'
import { useLanguage } from '@/app/LanguageContext'
import { t } from '@/lib/translations'

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

type Progress = { lessonId: string; completed: boolean }

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
  availableCourses: Course[]
  enrolledIds: string[]
}

export default function DashboardContent({ certificates, enrollments, progress, availableCourses, enrolledIds }: Props) {
  const { lang } = useLanguage()
  const T = t[lang].dashboard
  const dir = lang === 'he' ? 'rtl' : 'ltr'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', direction: dir }}>
      <main className="course-content" style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 40px' }}>

        {/* Certificates */}
        {certificates.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--navy)', marginBottom: '24px' }}>
              {T.certificates}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {certificates.map(cert => (
                <div key={cert.id} className="card" style={{ padding: '28px', borderLeft: '4px solid var(--gold)' }}>
                  <div className="badge badge-success" style={{ marginBottom: '12px' }}>{T.completed}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--navy)', marginBottom: '8px' }}>{cert.course.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    {T.serial} <strong style={{ color: 'var(--navy)' }}>{cert.serialNumber}</strong>
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    {T.issued} {new Date(cert.issuedAt).toLocaleDateString()}
                  </p>
                  <a href={cert.pdfPath} download className="btn btn-gold" style={{ fontSize: '14px', padding: '10px 20px' }}>
                    {T.downloadCert}
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Enrolled Courses */}
        {enrollments.length > 0 && (
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--navy)', marginBottom: '24px' }}>
              {T.yourCourses}
            </h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              {enrollments.map(enrollment => {
                const allLessons = enrollment.course.modules.flatMap(m => m.lessons)
                const completedCount = progress.filter(p => allLessons.find(l => l.id === p.lessonId) && p.completed).length
                const pct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0

                return (
                  <div key={enrollment.id} className="card" style={{ padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--navy)', marginBottom: '8px' }}>
                        {enrollment.course.title}
                      </h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                        {enrollment.course.duration} {lang === 'he' ? 'שעות' : 'hours'} &nbsp;·&nbsp; {completedCount} {T.of} {allLessons.length} {T.lessonsComplete}
                      </p>
                      <div className="progress-bar" style={{ marginBottom: '8px' }}>
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{pct}{T.pctComplete}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                      {enrollment.completedAt ? (
                        <>
                          <span className="badge badge-success">{T.completed}</span>
                          <Link href={`/learn/${enrollment.courseId}`} style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none' }}>
                            Review Course →
                          </Link>
                        </>
                      ) : (
                        <Link href={`/learn/${enrollment.courseId}`} className="btn btn-primary">
                          {pct === 0 ? T.startCourse : T.continue} →
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Available Courses */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--navy)', marginBottom: '32px' }}>
            {enrolledIds.length === 0 ? T.getStarted : T.moreCourses}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {availableCourses.map(course => (
              <div key={course.id} style={{
                background: 'var(--cream)',
                border: '1px solid var(--border)', overflow: 'hidden',
                position: 'relative', display: 'flex', flexDirection: 'column',
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
                <div style={{ padding: '36px 40px', flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 400, color: 'var(--text)', marginBottom: '10px', lineHeight: 1.2 }}>
                    {course.title}
                  </h3>
                  <div style={{ width: '32px', height: '1px', background: 'var(--border)', margin: '0 auto 16px' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.75, marginBottom: '28px' }}>
                    {course.description}
                  </p>
                  <div style={{ marginTop: 'auto' }}>
                    {course.isComingSoon ? (
                      <button disabled className="btn" style={{ width: '100%', justifyContent: 'center', background: 'var(--border)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: '11px', letterSpacing: '0.12em', cursor: 'not-allowed', opacity: 0.7 }}>
                        {T.comingSoon}
                      </button>
                    ) : (
                      <>
                        <div style={{ marginBottom: '20px' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 300, color: 'var(--text)' }}>
                            ${(course.price / 100).toFixed(0)}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.06em', marginLeft: '10px', textTransform: 'uppercase' }}>
                            {course.moduleCount ?? ''} {T.modules}
                          </span>
                        </div>
                        <Link href={`/courses/${course.id}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', display: 'flex', fontSize: '11px', letterSpacing: '0.12em' }}>
                          {T.viewCourse}
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
