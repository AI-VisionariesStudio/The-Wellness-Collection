const fs = require('fs')
const path = require('path')

function write(filePath, content) {
  const dir = path.dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
  console.log('✅ Written:', filePath)
}

// Admin courses API - GET all + POST new
write('app/api/admin/courses/route.ts', `import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const courses = await prisma.course.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { enrollments: true, modules: true } } }
  })
  return NextResponse.json(courses)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const course = await prisma.course.create({
    data: {
      title: body.title || 'New Course',
      description: body.description || '',
      duration: body.duration || 1,
      price: body.price || 0,
      order: body.order || 99,
      isActive: body.isActive ?? false,
    }
  })
  return NextResponse.json(course)
}`)

// Admin courses API - GET one + PATCH + DELETE
write('app/api/admin/courses/[id]/route.ts', `import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      modules: {
        orderBy: { order: 'asc' },
        include: { lessons: { orderBy: { order: 'asc' } } }
      }
    }
  })
  return NextResponse.json(course)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const course = await prisma.course.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.duration !== undefined && { duration: body.duration }),
      ...(body.price !== undefined && { price: body.price }),
      ...(body.isActive !== undefined && { isActive: body.isActive }),
      ...(body.order !== undefined && { order: body.order }),
    }
  })
  return NextResponse.json(course)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.progress.deleteMany({ where: { lesson: { module: { courseId: params.id } } } })
  await prisma.lesson.deleteMany({ where: { module: { courseId: params.id } } })
  await prisma.module.deleteMany({ where: { courseId: params.id } })
  await prisma.enrollment.deleteMany({ where: { courseId: params.id } })
  await prisma.certificate.deleteMany({ where: { courseId: params.id } })
  await prisma.course.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}`)

// Admin lessons API - POST new
write('app/api/admin/lessons/route.ts', `import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const lesson = await prisma.lesson.create({
    data: {
      moduleId: body.moduleId,
      title: body.title || 'New Lesson',
      description: body.description || '',
      videoUrl: body.videoUrl || '',
      duration: body.duration || 2700,
      order: body.order || 99,
    }
  })
  return NextResponse.json(lesson)
}`)

// Admin lessons API - PATCH + DELETE
write('app/api/admin/lessons/[id]/route.ts', `import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const lesson = await prisma.lesson.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.videoUrl !== undefined && { videoUrl: body.videoUrl }),
      ...(body.duration !== undefined && { duration: body.duration }),
      ...(body.order !== undefined && { order: body.order }),
    }
  })
  return NextResponse.json(lesson)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.progress.deleteMany({ where: { lessonId: params.id } })
  await prisma.lesson.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}`)

// Admin modules API - POST new
write('app/api/admin/modules/route.ts', `import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const module = await prisma.module.create({
    data: {
      courseId: body.courseId,
      title: body.title || 'New Module',
      order: body.order || 99,
    }
  })
  return NextResponse.json(module)
}`)

console.log('\n🎉 All API routes secured and written successfully!')

