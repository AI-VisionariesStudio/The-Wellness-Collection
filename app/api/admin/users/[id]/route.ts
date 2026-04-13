export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { audit } from '@/lib/audit'

// DELETE /api/admin/users/[id] — permanently delete a student and all their data
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = params

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    if (user.role === 'ADMIN') return NextResponse.json({ error: 'Cannot delete admin accounts.' }, { status: 403 })

    // Delete all related records, then the user
    await prisma.$transaction([
      prisma.reflectionPulse.deleteMany({ where: { userId: id } }),
      prisma.quizAttempt.deleteMany({ where: { userId: id } }),
      prisma.journalEntry.deleteMany({ where: { userId: id } }),
      prisma.progress.deleteMany({ where: { userId: id } }),
      prisma.certificate.deleteMany({ where: { userId: id } }),
      prisma.enrollment.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ])

    audit('admin.user.delete', {
      userId: (session.user as any).id,
      metadata: { deletedUserId: id, deletedEmail: user.email },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/users/[id]]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
