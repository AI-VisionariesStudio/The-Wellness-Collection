import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CoursesPage() {
  const session = await getServerSession(authOptions).catch(() => null)
  if (!session?.user) redirect('/login')
  const userId = (session?.user as any)?.id ?? null

  const courses = await prisma.course.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { modules: true } } },
  })

  const enrolledIds: string[] = userId
    ? (await prisma.enrollment.findMany({ where: { userId }, select: { courseId: true } })).map(e => e.courseId)
    : []

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>

      {/* ── Hero ── */}
      <section style={{ background: 'var(--cream)', padding: '40px 20px 32px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <img
          src="/twc-logo.svg"
          alt="Gracefully Redefined"
          style={{ width: '100px', height: '100px', objectFit: 'contain', display: 'block', margin: '0 auto 20px' }}
        />
        <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '8px' }}>The Wellness Collection</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.1, margin: '0 auto', maxWidth: '600px' }}>
          The Wellness Courses
        </h1>
        <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '16px auto' }} />
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 300, fontStyle: 'italic', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>
          Psychoeducational journeys rooted in trauma recovery, attachment healing, and nervous system care.
        </p>
      </section>

      {/* ── Course Grid ── */}
      <main style={{ maxWidth: '1060px', margin: '0 auto', padding: '48px 20px 80px' }}>
        {courses.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '16px' }}>Courses coming soon.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '32px' }}>
            {courses.map(course => {
              const isEnrolled = enrolledIds.includes(course.id)
              const moduleCount = (course as any)._count?.modules ?? 0

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
                      Coming Soon
                    </div>
                  )}
                  {isEnrolled && (
                    <div style={{ position: 'absolute', top: '18px', left: '18px', background: 'var(--success)', color: '#fff', padding: '4px 14px', borderRadius: '100px', fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', zIndex: 1 }}>
                      Enrolled
                    </div>
                  )}

                  {(course as any).thumbnail ? (
                    <img src={(course as any).thumbnail} alt={course.title} style={{ width: '100%', height: '140px', objectFit: 'contain', display: 'block', background: '#fff', padding: '12px' }} />
                  ) : (
                    <div style={{ width: '100%', height: '96px', background: '#fff', borderBottom: '1px solid var(--border)', backgroundImage: 'url(/twc-logo.svg)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '56px 56px' }} />
                  )}

                  <div style={{ padding: '18px 24px', flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 400, color: 'var(--text)', marginBottom: '6px', lineHeight: 1.2 }}>
                      {course.title}
                    </h2>
                    <div style={{ width: '24px', height: '1px', background: 'var(--border)', margin: '0 auto 10px' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.6, marginBottom: '16px', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                      {course.description}
                    </p>

                    <div style={{ marginTop: 'auto' }}>
                      {course.isComingSoon ? (
                        <button disabled style={{ width: '100%', padding: '8px 0', background: 'var(--border)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontSize: '10px', letterSpacing: '0.12em', cursor: 'not-allowed', opacity: 0.7 }}>
                          Coming Soon
                        </button>
                      ) : (
                        <>
                          {!isEnrolled && (
                            <div style={{ marginBottom: '10px' }}>
                              <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 300, color: 'var(--text)' }}>
                                ${(course.price / 100).toFixed(0)}
                              </span>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.06em', marginLeft: '6px', textTransform: 'uppercase' }}>
                                {moduleCount} {moduleCount === 1 ? 'module' : 'modules'}
                              </span>
                            </div>
                          )}
                          <Link href={`/courses/${course.id}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', display: 'flex', fontSize: '10px', letterSpacing: '0.12em', padding: '8px 16px' }}>
                            {isEnrolled ? 'Continue Course →' : 'View Course →'}
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
