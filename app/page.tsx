import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import HomeContent from './HomeContent'

export default async function HomePage() {
  const session = await getServerSession(authOptions).catch(() => null)
  const coursesHref = session ? '/dashboard' : '/login'
  return <HomeContent coursesHref={coursesHref} />
}
