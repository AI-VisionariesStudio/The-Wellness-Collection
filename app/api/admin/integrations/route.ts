export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// ── GitHub ────────────────────────────────────────────────────────────────────
async function fetchGitHub() {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO
  if (!token || !repo) return { status: 'unconfigured' }

  const headers = {
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    Accept: 'application/vnd.github+json',
  }

  try {
    const [repoRes, commitsRes, runsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${repo}`, { headers, cache: 'no-store' }),
      fetch(`https://api.github.com/repos/${repo}/commits?per_page=5`, { headers, cache: 'no-store' }),
      fetch(`https://api.github.com/repos/${repo}/actions/runs?per_page=3`, { headers, cache: 'no-store' }),
    ])

    const [repoData, commitsData, runsData] = await Promise.all([
      repoRes.json(),
      commitsRes.json(),
      runsRes.json(),
    ])

    const repoInfo = {
      name: repoData.name,
      open_issues_count: repoData.open_issues_count,
      pushed_at: repoData.pushed_at,
      default_branch: repoData.default_branch,
    }

    const commits = Array.isArray(commitsData)
      ? commitsData.map((c: any) => ({
          sha: c.sha?.slice(0, 7),
          message: (c.commit?.message?.split('\n')[0] ?? '').slice(0, 72),
          author: c.commit?.author?.name,
          date: c.commit?.author?.date,
        }))
      : []

    const runs = Array.isArray(runsData?.workflow_runs)
      ? runsData.workflow_runs.map((r: any) => ({
          name: r.name,
          status: r.status,
          conclusion: r.conclusion,
          head_branch: r.head_branch,
          created_at: r.created_at,
          html_url: r.html_url,
        }))
      : []

    return { status: 'ok', repo: repoInfo, commits, runs }
  } catch (err: any) {
    return { status: 'error', message: err.message }
  }
}

// ── Vercel ────────────────────────────────────────────────────────────────────
async function fetchVercel() {
  const token = process.env.VERCEL_TOKEN
  const projectId = process.env.VERCEL_PROJECT_ID
  if (!token || !projectId) return { status: 'unconfigured' }

  const headers = { Authorization: `Bearer ${token}` }

  try {
    const [projectRes, deploymentsRes] = await Promise.all([
      fetch(`https://api.vercel.com/v9/projects/${projectId}`, { headers, cache: 'no-store' }),
      fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=5`, { headers, cache: 'no-store' }),
    ])

    const [projectData, deploymentsData] = await Promise.all([
      projectRes.json(),
      deploymentsRes.json(),
    ])

    const project = {
      name: projectData.name,
      framework: projectData.framework,
    }

    const deployments = Array.isArray(deploymentsData?.deployments)
      ? deploymentsData.deployments.map((d: any) => ({
          uid: d.uid,
          state: d.state,
          target: d.target,
          created: d.created,
          url: d.url,
          commitMessage: d.meta?.githubCommitMessage,
        }))
      : []

    return { status: 'ok', project, deployments }
  } catch (err: any) {
    return { status: 'error', message: err.message }
  }
}

// ── Supabase (via Prisma) ─────────────────────────────────────────────────────
async function fetchSupabase() {
  try {
    const [userCount, enrollmentCount, certificateCount, leadCount, journalCount, recentUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.enrollment.count(),
        prisma.certificate.count(),
        prisma.wellnessLead.count(),
        prisma.journalEntry.count(),
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { email: true, createdAt: true, role: true },
        }),
      ])

    return {
      status: 'ok',
      stats: {
        users: userCount,
        enrollments: enrollmentCount,
        certificates: certificateCount,
        leads: leadCount,
        journalEntries: journalCount,
      },
      recentUsers,
    }
  } catch (err: any) {
    return { status: 'error', message: err.message }
  }
}

// ── Resend ────────────────────────────────────────────────────────────────────
async function fetchResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { status: 'unconfigured' }

  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    })
    const data = await res.json()
    return {
      status: 'ok',
      fromEmail: process.env.EMAIL_FROM ?? null,
      domains: Array.isArray(data?.data) ? data.data : [],
    }
  } catch (err: any) {
    return { status: 'error', message: err.message }
  }
}

// ── Upstash ───────────────────────────────────────────────────────────────────
async function fetchUpstash() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return { status: 'unconfigured' }

  const headers = { Authorization: `Bearer ${token}` }

  try {
    const [infoRes, dbsizeRes] = await Promise.all([
      fetch(`${url}/info`, { headers, cache: 'no-store' }),
      fetch(`${url}/dbsize`, { headers, cache: 'no-store' }),
    ])

    const [infoData, dbsizeData] = await Promise.all([
      infoRes.json(),
      dbsizeRes.json(),
    ])

    // infoData.result is a long string with "key:value\r\n" pairs
    const infoStr: string = infoData?.result ?? ''
    const parsed: Record<string, string> = {}
    for (const line of infoStr.split('\n')) {
      const colonIdx = line.indexOf(':')
      if (colonIdx > -1) {
        const key = line.slice(0, colonIdx).trim()
        const val = line.slice(colonIdx + 1).trim()
        parsed[key] = val
      }
    }

    return {
      status: 'ok',
      used_memory_human: parsed.used_memory_human ?? null,
      uptime_in_days: parsed.uptime_in_days ?? null,
      connected_clients: parsed.connected_clients ?? null,
      total_commands_processed: parsed.total_commands_processed ?? null,
      keyCount: dbsizeData?.result ?? null,
    }
  } catch (err: any) {
    return { status: 'error', message: err.message }
  }
}

// ── Betterstack ───────────────────────────────────────────────────────────────
async function fetchBetterstack() {
  const apiKey = process.env.BETTERSTACK_API_KEY
  if (!apiKey) return { status: 'unconfigured' }

  try {
    const res = await fetch('https://uptime.betterstack.com/api/v2/monitors', {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: 'no-store',
    })
    const data = await res.json()
    const monitors = Array.isArray(data?.data)
      ? data.data.map((m: any) => ({
          id: m.id,
          name: m.attributes?.pronounceable_name,
          status: m.attributes?.status,
          url: m.attributes?.url,
          availability: m.attributes?.availability,
        }))
      : []
    return { status: 'ok', monitors }
  } catch (err: any) {
    return { status: 'error', message: err.message }
  }
}

// ── Anthropic ─────────────────────────────────────────────────────────────────
function fetchAnthropic() {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return { status: 'unconfigured' }
  const last4 = key.slice(-4)
  return {
    status: 'ok',
    keyConfigured: true,
    keyMasked: `sk-ant-...${last4}`,
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [
    githubResult,
    vercelResult,
    supabaseResult,
    resendResult,
    upstashResult,
    betterstackResult,
  ] = await Promise.allSettled([
    fetchGitHub(),
    fetchVercel(),
    fetchSupabase(),
    fetchResend(),
    fetchUpstash(),
    fetchBetterstack(),
  ])

  const unwrap = (r: PromiseSettledResult<any>) =>
    r.status === 'fulfilled' ? r.value : { status: 'error', message: String((r as any).reason) }

  return NextResponse.json({
    github: unwrap(githubResult),
    vercel: unwrap(vercelResult),
    supabase: unwrap(supabaseResult),
    resend: unwrap(resendResult),
    upstash: unwrap(upstashResult),
    betterstack: unwrap(betterstackResult),
    anthropic: fetchAnthropic(),
    fetchedAt: new Date().toISOString(),
  })
}
