import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function EvidencePage({
  params,
}: {
  params: { courseId: string; moduleId: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const userId = (session.user as any).id
  const isAdmin = (session.user as any).role === 'ADMIN'

  try {
    const course = await prisma.course.findUnique({ where: { id: params.courseId } })
    if (!course) redirect('/dashboard')

    // Raw query to avoid stale Prisma client type issues with new columns
    const rows = await prisma.$queryRaw<
      { id: string; courseId: string; title: string; evidenceDocumentUrl: string | null; evidenceDocumentName: string | null }[]
    >`SELECT id, "courseId", title, "evidenceDocumentUrl", "evidenceDocumentName" FROM "Module" WHERE id = ${params.moduleId}`

    const mod = rows[0]
    if (!mod || mod.courseId !== params.courseId) redirect('/dashboard')

    if (!isAdmin) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: params.courseId } },
      })
      if (!enrollment) redirect(`/courses/${params.courseId}`)
    }

    const docUrl = mod.evidenceDocumentUrl
    const docName = mod.evidenceDocumentName || 'Evidence Document'
    const googleViewerUrl = docUrl
      ? `https://docs.google.com/viewer?url=${encodeURIComponent(docUrl)}&embedded=true`
      : null

    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>

        {/* Top bar */}
        <div style={{
          background: 'var(--header)', borderBottom: '1px solid var(--border)',
          padding: '12px 24px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50,
          gap: '16px', minHeight: '48px',
        }}>
          <Link href={`/learn/${params.courseId}`} style={{ fontFamily: 'var(--font-body)', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            ← Back to Course
          </Link>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.06em', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Gracefully Redefined · The Wellness Collection
          </span>
        </div>

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '56px 24px 80px', width: '100%', boxSizing: 'border-box' }}>

          {/* Header */}
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px' }}>
            {mod.title}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '44px', fontWeight: 300, color: 'var(--text)', margin: '0 0 32px', lineHeight: 1.1 }}>
            Evidence Based Documentation
          </h1>

          {googleViewerUrl && docUrl ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>
                  {docName}
                </p>
                <a href={docUrl} target="_blank" rel="noreferrer"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'var(--gold)', textDecoration: 'none', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Download ↓
                </a>
              </div>
              <iframe
                src={googleViewerUrl}
                title={docName}
                style={{ width: '100%', height: '78vh', minHeight: '560px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
              />
              <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)', letterSpacing: '0.03em' }}>
                Having trouble viewing?{' '}
                <a href={docUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text)', textDecoration: 'underline', textDecorationColor: 'var(--border)' }}>
                  Open document directly
                </a>
              </p>
            </>
          ) : (
            <div style={{ background: 'var(--header)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '48px 32px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 300, color: 'var(--text-muted)', margin: 0 }}>
                Evidence documentation for this module has not been uploaded yet.
              </p>
            </div>
          )}

        </div>
      </div>
    )
  } catch (err: any) {
    if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
    redirect('/dashboard')
  }
}
