export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/ratelimit'
import { audit, getIp } from '@/lib/audit'
import { validateAiResponse } from '@/lib/validateAiResponse'

// Strip control characters, collapse newlines, enforce max length.
function sanitize(value: string | undefined, maxLen: number): string {
  if (!value) return ''
  return value
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .slice(0, maxLen)
}

export async function POST(req: NextRequest) {
  const limited = await checkRateLimit(req, 'ai-reflection')
  if (limited) return limited

  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id

  let body: {
    score?: number
    stage?: 'PRE' | 'POST'
    lessonTitle?: string
    moduleTitle?: string
    lessonId?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { score, stage, lessonId } = body

  if (!score || score < 1 || score > 5) {
    return NextResponse.json({ error: 'Score must be 1–5' }, { status: 400 })
  }
  if (stage !== 'PRE' && stage !== 'POST') {
    return NextResponse.json({ error: 'Stage must be PRE or POST' }, { status: 400 })
  }
  if (!body.lessonTitle) {
    return NextResponse.json({ error: 'lessonTitle is required' }, { status: 400 })
  }

  // Sanitize title fields — single-line, strict length cap.
  const lessonTitle = sanitize(body.lessonTitle, 200)
  const moduleTitle = sanitize(body.moduleTitle, 200)

  if (!lessonTitle) {
    return NextResponse.json({ error: 'lessonTitle is required' }, { status: 400 })
  }

  // Persist the engagement record
  if (lessonId) {
    try {
      await prisma.reflectionPulse.create({
        data: { userId, lessonId, stage, engagementScore: score },
      })
    } catch (err) {
      // Non-fatal — proceed even if save fails
      console.error('[reflection-response] DB write failed:', err)
    }
  }

  const systemPrompt = `You are an educational content assistant for The Wellness Collection by Gracefully Redefined, a psychoeducational learning platform.

Your task: Provide a brief 2–3 sentence educational response to a learner checking in before or after a lesson.

STRICT RULES:
- Educational framing only — concepts, frameworks, research, theoretical perspectives from the lesson topic
- No emotional processing language, therapeutic language, or clinical guidance
- Do not reference or interpret the learner's score or emotional state
- Do not ask follow-up questions or prompt personal sharing
- For PRE-lesson responses: prime the learner with one relevant concept or a focused question to hold while watching
- For POST-lesson responses: reinforce one key educational idea and suggest a reflective integration lens
- Tone: warm, scholarly, accessible — 2–3 sentences only`

  const lessonRef = moduleTitle
    ? `"${lessonTitle}" in module "${moduleTitle}"`
    : `"${lessonTitle}"`

  const userPrompt = stage === 'PRE'
    ? `Lesson: ${lessonRef}. A learner is about to begin this lesson. Write a 2–3 sentence educational primer: one key concept or guiding question for them to hold as they watch. Educational tone only.`
    : `Lesson: ${lessonRef}. A learner just completed this lesson. Write a 2–3 sentence response that reinforces one key educational idea from this topic and suggests a reflective lens for integrating the material. Educational tone only.`

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
        max_tokens: 300,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })

    if (!res.ok) {
      console.error('[reflection-response] Anthropic API error:', res.status)
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 })
    }

    const data = await res.json()
    const text: string = validateAiResponse(data.content?.[0]?.text ?? '', 'reflection-response')
    audit('ai.reflection.request', { userId, ip: getIp(req), metadata: { stage, lessonTitle } })
    return NextResponse.json({ text })
  } catch (err) {
    console.error('[reflection-response]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
