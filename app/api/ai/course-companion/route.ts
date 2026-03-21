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
    lessonDescription?: string
    moduleTitle?: string
    courseTitle?: string
    backedResearch?: string
    conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { message, lessonTitle, lessonDescription, moduleTitle, courseTitle, backedResearch, conversationHistory = [] } = body

  if (!message?.trim()) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const moduleContent = [
    lessonDescription && `Lesson overview: ${lessonDescription}`,
    backedResearch && `Backed research and key concepts:\n${backedResearch}`,
  ].filter(Boolean).join('\n\n')

  const systemPrompt = `You are an educational assistant for The Wellness Studio, a psychoeducational learning platform operated by a licensed clinician.

Current lesson context:
- Course: ${courseTitle ?? 'this course'}
- Module: ${moduleTitle ?? 'this module'}
- Lesson: ${lessonTitle ?? 'this lesson'}

${moduleContent ? `MODULE CONTENT — your sole source of truth for answering questions:\n\n${moduleContent}\n\n` : ''}YOUR ROLE: Help learners understand the content of this specific lesson. Your answers must be grounded exclusively in the lesson overview and backed research provided above.

STRICT BOUNDARIES — NEVER violate these:
- ONLY answer questions using the module content provided above. Do not draw on outside knowledge, other courses, or general information not present in this lesson's content.
- If a question cannot be answered from the provided module content, say: "That topic isn't covered in this lesson's material. I can only help with questions about what's included in this lesson."
- Never provide therapy, counseling, diagnosis, or clinical guidance of any kind
- Never analyze, interpret, or assess a learner's personal mental health situation
- Never make treatment, medication, or referral recommendations in a clinical capacity

TONE: Warm, clear, scholarly but accessible. Use plain language while honoring the depth of the material.

DISTRESS PROTOCOL: If a learner expresses personal distress beyond normal reflection — including crisis language, expressions of self-harm, or acute emotional overwhelm — respond with: "I hear that you're going through something difficult. As an educational assistant, I'm not equipped to provide the support you may need right now. Please reach out to a licensed mental health professional or, if you're in crisis, contact the 988 Suicide & Crisis Lifeline by calling or texting 988."

Remember: Your purpose is education grounded in this lesson's content only — not therapy, not general advice, and not outside knowledge.`

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

