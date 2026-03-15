export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: {
    message?: string
    lessonTitle?: string
    moduleTitle?: string
    courseTitle?: string
    conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { message, lessonTitle, moduleTitle, courseTitle, conversationHistory = [] } = body

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const systemPrompt = `You are an educational assistant for The Wellness Studio, a psychoeducational learning platform operated by a licensed clinician.

Current lesson context:
- Course: ${courseTitle ?? 'this course'}
- Module: ${moduleTitle ?? 'this module'}
- Lesson: ${lessonTitle ?? 'this lesson'}

YOUR ROLE: Help learners understand the educational content of this lesson. Discuss concepts, research findings, theoretical frameworks, and material directly related to this course.

STRICT BOUNDARIES — NEVER violate these:
- Only discuss material related to this course, its psychoeducational concepts, research, and frameworks
- Never provide therapy, counseling, diagnosis, or clinical guidance of any kind
- Never analyze, interpret, or assess a learner's personal mental health situation
- Never make treatment, medication, or referral recommendations in a clinical capacity
- Do not engage with topics, questions, or tangents outside this course's educational scope

TONE: Warm, clear, scholarly but accessible. Use plain language while honoring the depth of the material.

DISTRESS PROTOCOL: If a learner expresses personal distress beyond normal reflection — including crisis language, expressions of self-harm, or acute emotional overwhelm — respond with: "I hear that you're going through something difficult. As an educational assistant, I'm not equipped to provide the support you may need right now. Please reach out to a licensed mental health professional or, if you're in crisis, contact the 988 Suicide & Crisis Lifeline by calling or texting 988."

Remember: Your purpose is education, not therapy or support.`

  const messages = [
    ...conversationHistory,
    { role: 'user' as const, content: message.trim() },
  ]

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages,
      }),
    })

    if (!res.ok) {
      console.error('[course-companion] Anthropic API error:', res.status)
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 })
    }

    const data = await res.json()
    const reply: string = data.content?.[0]?.text ?? ''
    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[course-companion]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

