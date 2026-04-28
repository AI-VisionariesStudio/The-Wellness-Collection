import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import TickerBanner from '@/app/components/TickerBanner'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const userId = (session.user as any).id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              modules: { include: { lessons: true } },
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      },
      progress: true,
      certificates: { include: { course: true } },
    },
  })

  if (!user) redirect('/login')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>

      {/* ── Hero ── */}
      <section style={{ background: '#fff', paddingTop: '100px', textAlign: 'center' }}>
        <img
          src="/twc-logo.svg"
          alt="Gracefully Redefined"
          style={{ height: '200px', objectFit: 'contain', display: 'block', margin: '0 auto -90px', position: 'relative', zIndex: 2 }}
        />
        <div style={{ background: 'var(--cream)', padding: '110px 60px 60px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '24px' }}>The Wellness Collection</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.1, marginBottom: '0' }}>My Profile</h1>
            <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '36px auto 0' }} />
          </div>
        </div>
      </section>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 32px 32px' }}>

        {/* ── Three cards horizontal ── */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'stretch', flexWrap: 'wrap' }}>

          {/* Account Info */}
          <div style={{ flex: '1 1 280px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 400, color: 'var(--text)', marginBottom: '16px' }}>
              Account
            </h2>
            <div className="card" style={{ padding: '18px 22px', borderRadius: 0, height: 'calc(100% - 46px)' }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>Name</div>
                  <div style={{ fontSize: '15px', color: 'var(--text)' }}>{user.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>Email</div>
                  <div style={{ fontSize: '14px', color: 'var(--text)', wordBreak: 'break-all' }}>{user.email}</div>
                </div>
                <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '3px' }}>Member Since</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div style={{ flex: '1 1 280px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 400, color: 'var(--text)', marginBottom: '16px' }}>
              Enrolled Courses
            </h2>
            {user.enrollments.length === 0 ? (
              <div className="card" style={{ padding: '24px', textAlign: 'center', borderRadius: 0, height: 'calc(100% - 46px)' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '14px' }}>You haven&apos;t enrolled in any courses yet.</p>
                <Link href="/dashboard" className="btn btn-primary">Browse Courses</Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                {user.enrollments.map(enrollment => {
                  const allLessons = enrollment.course.modules.flatMap(m => m.lessons)
                  const completedCount = user.progress.filter(p =>
                    allLessons.find(l => l.id === p.lessonId) && p.completed
                  ).length
                  const pct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0
                  const cert = user.certificates.find(c => c.courseId === enrollment.courseId)

                  return (
                    <div key={enrollment.id} className="card" style={{ padding: '18px 22px', borderRadius: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 400, color: 'var(--text)', marginBottom: '6px' }}>
                            {enrollment.course.title}
                          </h3>
                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                            Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()} &nbsp;·&nbsp; {completedCount}/{allLessons.length} lessons
                          </p>
                          <div className="progress-bar" style={{ marginBottom: '4px' }}>
                            <div className="progress-fill" style={{ width: `${pct}%` }} />
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{pct}% complete</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                          {enrollment.completedAt ? (
                            <>
                              <span className="badge badge-success">Completed</span>
                              {cert && (
                                <a href={cert.pdfPath} download style={{ fontSize: '11px', color: 'var(--gold)', textDecoration: 'none' }}>
                                  Download Certificate
                                </a>
                              )}
                            </>
                          ) : (
                            <Link href={`/learn/${enrollment.courseId}`} className="btn btn-primary" style={{ fontSize: '12px', padding: '7px 14px' }}>
                              {pct === 0 ? 'Start' : 'Continue'} →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Security */}
          <div style={{ flex: '1 1 280px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 400, color: 'var(--text)', marginBottom: '16px' }}>
              Security
            </h2>
            <div className="card" style={{ padding: '18px 22px', borderRadius: 0, height: 'calc(100% - 46px)' }}>
              <div style={{ fontWeight: 500, color: 'var(--text)', marginBottom: '4px', fontSize: '14px' }}>Password</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>Change your account password</div>
              <Link href="/forgot-password" className="btn btn-outline" style={{ fontSize: '12px', padding: '8px 16px', display: 'inline-block' }}>
                Reset Password
              </Link>
            </div>
          </div>

        </div>
      </main>

      <TickerBanner bg="#fff" />
    </div>
  )
}
