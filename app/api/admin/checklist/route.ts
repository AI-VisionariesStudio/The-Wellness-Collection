import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { itemKey, checked, note, checkedBy } = await req.json()
  if (!itemKey) return NextResponse.json({ error: 'itemKey required' }, { status: 400 })

  const state = await prisma.checklistState.upsert({
    where: { itemKey },
    create: {
      itemKey,
      checked: checked ?? false,
      checkedBy: checked ? (checkedBy ?? null) : null,
      checkedAt: checked ? new Date() : null,
      note: note ?? null,
    },
    update: {
      checked: checked ?? false,
      checkedBy: checked ? (checkedBy ?? null) : null,
      checkedAt: checked ? new Date() : null,
      ...(note !== undefined ? { note } : {}),
    },
  })

  return NextResponse.json(state)
}
