export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import path from 'path'

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const MAX_SIZE = 50 * 1024 * 1024 // 50 MB
const BUCKET = 'documents'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== 'ADMIN')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file)
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    if (!ALLOWED_TYPES.has(file.type))
      return NextResponse.json(
        { error: 'File type not allowed.' },
        { status: 400 }
      )

    if (file.size > MAX_SIZE)
      return NextResponse.json({ error: 'File exceeds 50 MB limit' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const safeName = file.name
      .replace(/[^a-z0-9.\-_]/gi, '_')
      .toLowerCase()
      .slice(0, 100)
    const filename = `${Date.now()}-${safeName}`

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error)
      return NextResponse.json({ error: `Storage upload failed: ${error.message}` }, { status: 500 })

    const { data: publicData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(data.path)

    return NextResponse.json({ url: publicData.publicUrl, name: file.name })
  } catch (err) {
    console.error('[POST /api/admin/upload]', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}

