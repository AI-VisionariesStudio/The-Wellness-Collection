export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/ratelimit'

function sanitize(value: string | undefined, maxLen: number): string {
  if (!value) return ''
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, maxLen)
}

export async function POST(req: NextRequest) {
  const limited = await checkRateLimit(req, 'faq-chat')
  if (limited) return limited

  let body: {
    message?: string
    agentName?: string
    conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const message = sanitize(body.message, 1000)
  const agentName = sanitize(body.agentName, 50)
  const conversationHistory = Array.isArray(body.conversationHistory)
    ? body.conversationHistory.slice(-10)
    : []

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const systemPrompt = `You are ${agentName || 'a support agent'}, a warm and knowledgeable member of The Wellness Collection support team by Gracefully Redefined. You help visitors understand the platform and courses before they enroll.

THE WELLNESS COLLECTION — PLATFORM OVERVIEW:
- Operated by Gracefully Redefined, a licensed-clinician-led wellness education brand
- Offers psychoeducational online courses focused on attachment science, emotional wellness, relationship health, and personal growth
- Courses are self-paced, mobile-friendly, and accessible on any device
- Progress is saved automatically — learners can stop and resume anytime
- Certificates are issued instantly upon course completion
- Platform supports English and Hebrew

WHAT YOU CAN ANSWER:
- What courses are offered and what they cover
- How enrollment and payment works
- Technical questions (device compatibility, progress saving, certificate download)
- Account questions (password reset, email verification)
- General platform navigation
- Course structure (modules, lessons, reflection check-ins, AI lesson companion)

HOW TO HANDLE UNKNOWNS:
- For specific pricing: direct them to the Courses page or email support@gracefullyredefined.com
- For specific course content you don't have: "I can connect you with our team — reach us at support@gracefullyredefined.com"
- Never fabricate specific dates, prices, or course content

TONE: Warm, professional, upbeat. You genuinely care about helping people access wellness education. Keep responses concise — 1 to 3 short paragraphs max.

BOUNDARIES: You are a support agent, not a therapist. Never provide clinical advice, diagnoses, or therapeutic guidance. If someone expresses distress, warmly direct them to professional support and the 988 Lifeline (call or text 988).`

  const messages = [
    ...conversationHistory.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: message },
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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: systemPrompt,
        messages,
      }),
    })

    if (!res.ok) {
      console.error('[faq-chat] Anthropic API error:', res.status)
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 502 })
    }

    const data = await res.json()
    const reply: string = data.content?.[0]?.text ?? 'Unable to respond. Please try again.'
    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[faq-chat]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
