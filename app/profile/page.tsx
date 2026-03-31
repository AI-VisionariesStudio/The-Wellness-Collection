import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
          src="/twc-logo.png"
          alt="Gracefully Redefined"
          style={{ height: '200px', objectFit: 'contain', display: 'block', margin: '0 auto -90px', position: 'relative', zIndex: 2 }}
        />
        <div style={{ background: 'var(--cream)', padding: '110px 60px 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <p style={{ fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '24px' }}>The Wellness Collection</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 300, color: 'var(--text)', lineHeight: 1.1, marginBottom: '0' }}>My Profile</h1>
            <div style={{ width: '40px', height: '1px', background: 'var(--mid)', margin: '36px auto 0' }} />
          </div>
        </div>
      </section>

      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 40px' }}>

        {/* Account Info */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, color: 'var(--text)', marginBottom: '20px' }}>
            Account
          </h2>
          <div className="card" style={{ padding: '32px', display: 'grid', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Name</div>
                <div style={{ fontSize: '16px', color: 'var(--text)' }}>{user.name}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Email</div>
                <div style={{ fontSize: '16px', color: 'var(--text)' }}>{user.email}</div>
              </div>
            </div>
            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Member Since</div>
              <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
        </section>

        {/* Enrolled Courses */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, color: 'var(--text)', marginBottom: '20px' }}>
            Enrolled Courses
          </h2>
          {user.enrollments.length === 0 ? (
            <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>You haven&apos;t enrolled in any courses yet.</p>
              <Link href="/dashboard" className="btn btn-primary">Browse Courses</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {user.enrollments.map(enrollment => {
                const allLessons = enrollment.course.modules.flatMap(m => m.lessons)
                const completedCount = user.progress.filter(p =>
                  allLessons.find(l => l.id === p.lessonId) && p.completed
                ).length
                const pct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0
                const cert = user.certificates.find(c => c.courseId === enrollment.courseId)

                return (
                  <div key={enrollment.id} className="card" style={{ padding: '24px 28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 400, color: 'var(--text)', marginBottom: '8px' }}>
                          {enrollment.course.title}
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                          Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()} &nbsp;·&nbsp; {completedCount} of {allLessons.length} lessons complete
                        </p>
                        <div className="progress-bar" style={{ marginBottom: '6px' }}>
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pct}% complete</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                        {enrollment.completedAt ? (
                          <>
                            <span className="badge badge-success">Completed</span>
                            {cert && (
                              <a href={cert.pdfPath} download style={{ fontSize: '12px', color: 'var(--gold)', textDecoration: 'none' }}>
                                Download Certificate
                              </a>
                            )}
                          </>
                        ) : (
                          <Link href={`/learn/${enrollment.courseId}`} className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 18px' }}>
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
        </section>

        {/* Password */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, color: 'var(--text)', marginBottom: '20px' }}>
            Security
          </h2>
          <div className="card" style={{ padding: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 500, color: 'var(--text)', marginBottom: '4px' }}>Password</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Change your account password</div>
            </div>
            <Link href="/forgot-password" className="btn btn-outline" style={{ fontSize: '13px', padding: '8px 18px' }}>
              Reset Password
            </Link>
          </div>
        </section>

      </main>
    </div>
  )
}
