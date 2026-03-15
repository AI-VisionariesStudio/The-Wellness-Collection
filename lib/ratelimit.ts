import { NextRequest, NextResponse } from 'next/server'

// Upstash-based rate limiting with graceful degradation.
// Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in your environment.
// Without those vars, rate limiting is skipped (safe for local development).

let Ratelimit: any
let Redis: any

async function getClients() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }
  if (!Redis) {
    const redisModule = await import('@upstash/redis')
    const rlModule = await import('@upstash/ratelimit')
    Redis = redisModule.Redis
    Ratelimit = rlModule.Ratelimit
  }
  return { Redis, Ratelimit }
}

type LimitConfig = {
  /** Max requests allowed in the window */
  limit: number
  /** Window duration in seconds */
  window: number
}

const configs: Record<string, LimitConfig> = {
  register:        { limit: 5,  window: 600 }, // 5 per 10 min
  'forgot-password': { limit: 3,  window: 600 }, // 3 per 10 min
  checkout:        { limit: 10, window: 60  }, // 10 per min
  contact:         { limit: 3,  window: 600 }, // 3 per 10 min
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'anonymous'
  )
}

/**
 * Returns a 429 NextResponse if the request is rate-limited, otherwise null.
 * Usage: const limit = await checkRateLimit(req, 'register')
 *        if (limit) return limit
 */
export async function checkRateLimit(
  req: NextRequest,
  action: keyof typeof configs
): Promise<NextResponse | null> {
  const clients = await getClients()
  if (!clients) return null // no Upstash configured — skip

  const cfg = configs[action]
  const redis = new clients.Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })

  const ratelimit = new clients.Ratelimit({
    redis,
    limiter: clients.Ratelimit.slidingWindow(cfg.limit, `${cfg.window} s`),
    prefix: `rl:${action}`,
  })

  const ip = getIp(req)
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    )
  }
  return null
}
