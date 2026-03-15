import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ManualEnrollment from './ManualEnrollment'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') redirect('/dashboard')

  try {
    const [users, courses, certificates, enrollments] = await Promise.all([
      prisma.user.findMany({ where: { role: 'STUDENT' }, orderBy: { createdAt: 'desc' } }),
      prisma.course.findMany({
        orderBy: { order: 'asc' },
        include: {
          _count: { select: { enrollments: true } },
          enrollments: {
            include: { user: { select: { id: true, name: true, email: true, caseNumber: true, courtState: true } } },
            orderBy: { enrolledAt: 'desc' },
          },
        },
      }),
      prisma.certificate.findMany({ include: { user: true, course: true }, orderBy: { issuedAt: 'desc' }, take: 20 }),
      prisma.enrollment.findMany({ include: { user: true, course: true }, orderBy: { enrolledAt: 'desc' }, take: 20 }),
    ])

    const stats = {
      totalUsers: users.filter(u => u.role === 'STUDENT').length,
      totalEnrollments: enrollments.length,
      totalCertificates: certificates.length,
      totalRevenue: enrollments.reduce((sum, e) => sum + e.paidAmount, 0),
    }

    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 40px' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '48px' }}>
            {[
              { label: 'Total Students', value: stats.totalUsers },
              { label: 'Enrollments', value: stats.totalEnrollments },
              { label: 'Certificates Issued', value: stats.totalCertificates },
              { label: 'Revenue', value: `$${(stats.totalRevenue / 100).toFixed(2)}` },
            ].map(stat => (
              <div key={stat.label} className="card" style={{ padding: '28px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--text)', fontWeight: 600 }}>{stat.value}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Courses */}
          <section style={{ marginBottom: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text)' }}>Courses</h2>
              <Link href="/admin/courses" className="btn btn-primary" style={{ fontSize: '14px' }}>Edit Courses →</Link>
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '1px solid var(--border)' }}>
                    {['Course', 'Duration', 'Price', 'Enrollments', 'Status'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 500 }}>{course.title}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{course.duration}h</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>${(course.price / 100).toFixed(0)}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{course._count.enrollments}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span className={`badge ${course.isActive ? 'badge-success' : 'badge-pending'}`}>
                          {course.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent Students */}
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text)', marginBottom: '20px' }}>Recent Students</h2>
            <div className="card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '1px solid var(--border)' }}>
                    {['Name', 'Email', 'Case Number', 'State', 'Joined'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => u.role === 'STUDENT').slice(0, 15).map(user => (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 500 }}>{user.name}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{user.email}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{user.caseNumber || '—'}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{user.courtState || '—'}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Manual Enrollment */}
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text)', marginBottom: '20px' }}>Manual Enrollment</h2>
            <ManualEnrollment
              users={users.map(u => ({ id: u.id, name: u.name, email: u.email }))}
              courses={courses.map(c => ({ id: c.id, title: c.title }))}
            />
          </section>

          {/* Enrolled Clients by Course */}
          <section style={{ marginBottom: '48px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text)', marginBottom: '20px' }}>Enrolled Clients by Course</h2>
            <div style={{ display: 'grid', gap: '24px' }}>
              {courses.map((course: any) => (
                <div key={course.id} className="card" style={{ overflow: 'hidden' }}>
                  <div style={{ padding: '16px 24px', background: 'var(--header)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 400, margin: 0 }}>{course.title}</h3>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{course._count.enrollments} enrolled</span>
                  </div>
                  {course.enrollments.length === 0 ? (
                    <div style={{ padding: '20px 24px', color: 'var(--text-muted)', fontSize: '14px' }}>No enrollments yet.</div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f8f9fa', borderBottom: '1px solid var(--border)' }}>
                          {['Name', 'Email', 'Case Number', 'State', 'Enrolled'].map(h => (
                            <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {course.enrollments.map((enr: any) => (
                          <tr key={enr.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '14px 20px', fontWeight: 500, fontSize: '14px' }}>{enr.user.name}</td>
                            <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{enr.user.email}</td>
                            <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{enr.user.caseNumber || '—'}</td>
                            <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{enr.user.courtState || '—'}</td>
                            <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{new Date(enr.enrolledAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Certificates Issued */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text)', marginBottom: '20px' }}>Certificates Issued</h2>
            <div className="card" style={{ overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa', borderBottom: '1px solid var(--border)' }}>
                    {['Student', 'Course', 'Serial Number', 'Issued'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {certificates.map(cert => (
                    <tr key={cert.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 500 }}>{cert.user.name}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{cert.course.title}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <code style={{ fontSize: '12px', background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>{cert.serialNumber}</code>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '14px' }}>{new Date(cert.issuedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    )
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
    console.error('[AdminPage]', err)
    return (
      <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ padding: '48px', textAlign: 'center', maxWidth: '460px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--text)', marginBottom: '12px' }}>
            Something&apos;s not quite right on our end.
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.7 }}>
            Please try refreshing — we&apos;ll have things back to normal shortly. If this continues, reach out to us at{' '}
            <a href="mailto:support@gracefullyredefined.com" style={{ color: 'var(--gold)' }}>support@gracefullyredefined.com</a>
          </p>
          <Link href="/admin" className="btn btn-primary">Try Again</Link>
        </div>
      </div>
    )
  }
}
