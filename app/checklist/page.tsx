import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function ChecklistPage() {
  const session = await getServerSession(authOptions).catch(() => null)

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect('/login')
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999 }}>
      <iframe
        src="https://thewellnesscollectionchecklist.netlify.app/"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="The Wellness Collection Checklist"
      />
    </div>
  )
}
