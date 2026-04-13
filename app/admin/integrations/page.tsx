'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  let bg = '#f3f4f6'
  let color = '#6b7280'
  if (status === 'ok') { bg = '#e8f0eb'; color = '#4a7a5a' }
  else if (status === 'error' || status === 'degraded') { bg = '#fef3c7'; color = '#92400e' }
  return (
    <span style={{ background: bg, color, fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {status}
    </span>
  )
}

// ── Card wrapper ──────────────────────────────────────────────────────────────
function ServiceCard({
  title,
  status,
  href,
  children,
}: {
  title: string
  status: string
  href: string
  children: React.ReactNode
}) {
  return (
    <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <a
          href={href === '#' ? undefined : href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text)', textDecoration: 'none', cursor: href === '#' ? 'default' : 'pointer' }}
          onMouseEnter={e => { if (href !== '#') (e.currentTarget as HTMLElement).style.textDecoration = 'underline' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'none' }}
        >
          {title} {href !== '#' && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>↗</span>}
        </a>
        <StatusBadge status={status} />
      </div>
      {/* Divider */}
      <div style={{ borderTop: '1px solid var(--border)', marginBottom: '20px' }} />
      {/* Content */}
      <div style={{ flex: 1 }}>{children}</div>
      {/* Footer link */}
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none', border: '1px solid var(--border)', borderRadius: '6px', padding: '5px 12px' }}
        >
          Open ↗
        </a>
      </div>
    </div>
  )
}

// ── Metric tile ───────────────────────────────────────────────────────────────
function MetricTile({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '14px 16px', textAlign: 'center' }}>
      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
        {value ?? '—'}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
    </div>
  )
}

// ── Row label ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: '1px solid var(--border-light, #f0f0f0)', fontSize: '13px' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ color: 'var(--text)', fontWeight: 500 }}>{value ?? '—'}</span>
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '28px' }}>
      {[80, 100, 60, 90, 70].map((w, i) => (
        <div
          key={i}
          style={{
            height: i === 0 ? '20px' : '14px',
            width: `${w}%`,
            background: '#f0f0f0',
            borderRadius: '6px',
            marginBottom: '12px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  )
}

// ── Unconfigured card ─────────────────────────────────────────────────────────
function UnconfiguredCard({ title, vars }: { title: string; vars: string[] }) {
  return (
    <ServiceCard title={title} status="unconfigured" href="#">
      <div style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.7 }}>
        Add the following to your <code style={{ background: '#f0f0f0', padding: '1px 6px', borderRadius: '4px', fontSize: '12px' }}>.env.local</code> to connect:
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {vars.map(v => (
            <code key={v} style={{ background: '#f8f9fa', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: 'var(--text)' }}>
              {v}
            </code>
          ))}
        </div>
      </div>
    </ServiceCard>
  )
}

// ── GitHub card ───────────────────────────────────────────────────────────────
function GitHubCard({ data }: { data: any }) {
  if (data.status === 'unconfigured') return <UnconfiguredCard title="GitHub" vars={['GITHUB_TOKEN', 'GITHUB_REPO']} />

  const repoUrl = data.repo?.name
    ? `https://github.com/${data.repo.name}`
    : 'https://github.com'

  const conclusionColor = (c: string | null) => {
    if (c === 'success') return '#4a7a5a'
    if (c === 'failure') return '#dc2626'
    if (c === 'cancelled') return '#6b7280'
    return '#92400e'
  }

  return (
    <ServiceCard title="GitHub" status={data.status} href={repoUrl}>
      <InfoRow label="Repository" value={data.repo?.name} />
      <InfoRow label="Open Issues" value={data.repo?.open_issues_count} />
      <InfoRow label="Last Push" value={timeAgo(data.repo?.pushed_at)} />
      <InfoRow label="Default Branch" value={data.repo?.default_branch} />

      {data.commits?.length > 0 && (
        <>
          <div style={{ marginTop: '16px', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recent Commits
          </div>
          {data.commits.map((c: any) => (
            <div key={c.sha} style={{ display: 'flex', gap: '10px', padding: '6px 0', borderBottom: '1px solid var(--border-light, #f0f0f0)', fontSize: '12px' }}>
              <code style={{ color: 'var(--text-muted)', minWidth: '52px', flexShrink: 0 }}>{c.sha}</code>
              <span style={{ color: 'var(--text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</span>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0, whiteSpace: 'nowrap' }}>{timeAgo(c.date)}</span>
            </div>
          ))}
        </>
      )}

      {data.runs?.length > 0 && (
        <>
          <div style={{ marginTop: '16px', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Workflow Runs
          </div>
          {data.runs.map((r: any, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: '1px solid var(--border-light, #f0f0f0)', fontSize: '12px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: conclusionColor(r.conclusion), flexShrink: 0, display: 'inline-block' }} />
              <span style={{ flex: 1, color: 'var(--text)' }}>{r.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{r.head_branch}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{timeAgo(r.created_at)}</span>
            </div>
          ))}
        </>
      )}
    </ServiceCard>
  )
}

// ── Vercel card ───────────────────────────────────────────────────────────────
function VercelCard({ data }: { data: any }) {
  if (data.status === 'unconfigured') return <UnconfiguredCard title="Vercel" vars={['VERCEL_TOKEN', 'VERCEL_PROJECT_ID']} />

  const stateStyle = (s: string) => {
    if (s === 'READY') return { bg: '#e8f0eb', color: '#4a7a5a' }
    if (s === 'ERROR') return { bg: '#fee2e2', color: '#dc2626' }
    if (s === 'BUILDING') return { bg: '#fef3c7', color: '#92400e' }
    return { bg: '#f3f4f6', color: '#6b7280' }
  }

  return (
    <ServiceCard title="Vercel" status={data.status} href="https://vercel.com/dashboard">
      <InfoRow label="Project" value={data.project?.name} />
      <InfoRow label="Framework" value={data.project?.framework ?? 'nextjs'} />

      {data.deployments?.length > 0 && (
        <>
          <div style={{ marginTop: '16px', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recent Deployments
          </div>
          {data.deployments.map((d: any) => {
            const s = stateStyle(d.state)
            return (
              <div key={d.uid} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: '1px solid var(--border-light, #f0f0f0)', fontSize: '12px' }}>
                <span style={{ background: s.bg, color: s.color, padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, flexShrink: 0 }}>{d.state}</span>
                <span style={{ flex: 1, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.commitMessage ?? d.url ?? '—'}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', flexShrink: 0 }}>{d.target ?? '—'}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', flexShrink: 0 }}>{timeAgo(d.created ? new Date(d.created).toISOString() : null)}</span>
              </div>
            )
          })}
        </>
      )}
    </ServiceCard>
  )
}

// ── Supabase card ─────────────────────────────────────────────────────────────
function SupabaseCard({ data }: { data: any }) {
  return (
    <ServiceCard title="Supabase / Database" status={data.status} href="https://app.supabase.com">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
        <MetricTile label="Users" value={data.stats?.users} />
        <MetricTile label="Enrollments" value={data.stats?.enrollments} />
        <MetricTile label="Certificates" value={data.stats?.certificates} />
        <MetricTile label="Leads" value={data.stats?.leads} />
        <MetricTile label="Journal Entries" value={data.stats?.journalEntries} />
      </div>

      {data.recentUsers?.length > 0 && (
        <>
          <div style={{ marginTop: '4px', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recent Users
          </div>
          {data.recentUsers.map((u: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border-light, #f0f0f0)', fontSize: '12px' }}>
              <span style={{ color: 'var(--text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '12px', flexShrink: 0 }}>{u.role}</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: '12px', flexShrink: 0 }}>{timeAgo(u.createdAt)}</span>
            </div>
          ))}
        </>
      )}
    </ServiceCard>
  )
}

// ── Resend card ───────────────────────────────────────────────────────────────
function ResendCard({ data }: { data: any }) {
  if (data.status === 'unconfigured') return <UnconfiguredCard title="Resend" vars={['RESEND_API_KEY']} />

  const domainStatusStyle = (s: string) => {
    if (s === 'verified') return { bg: '#e8f0eb', color: '#4a7a5a' }
    if (s === 'failed') return { bg: '#fee2e2', color: '#dc2626' }
    return { bg: '#fef3c7', color: '#92400e' }
  }

  return (
    <ServiceCard title="Resend" status={data.status} href="https://resend.com/emails">
      <InfoRow label="From Email" value={data.fromEmail} />
      <InfoRow label="Domains" value={data.domains?.length ?? 0} />

      {data.domains?.length > 0 && (
        <>
          <div style={{ marginTop: '16px', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Domains
          </div>
          {data.domains.map((d: any) => {
            const s = domainStatusStyle(d.status)
            return (
              <div key={d.id ?? d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border-light, #f0f0f0)', fontSize: '12px' }}>
                <span style={{ color: 'var(--text)' }}>{d.name}</span>
                <span style={{ background: s.bg, color: s.color, padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>{d.status}</span>
              </div>
            )
          })}
        </>
      )}
    </ServiceCard>
  )
}

// ── Upstash card ──────────────────────────────────────────────────────────────
function UpstashCard({ data }: { data: any }) {
  if (data.status === 'unconfigured') return <UnconfiguredCard title="Upstash Redis" vars={['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN']} />

  return (
    <ServiceCard title="Upstash Redis" status={data.status} href="https://console.upstash.com">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <MetricTile label="Keys" value={data.keyCount} />
        <MetricTile label="Memory" value={data.used_memory_human} />
        <MetricTile label="Connected Clients" value={data.connected_clients} />
        <MetricTile label="Total Commands" value={data.total_commands_processed ? Number(data.total_commands_processed).toLocaleString() : null} />
      </div>
      <div style={{ marginTop: '12px' }}>
        <InfoRow label="Uptime" value={data.uptime_in_days ? `${data.uptime_in_days} days` : null} />
      </div>
    </ServiceCard>
  )
}

// ── Betterstack card ──────────────────────────────────────────────────────────
function BetterstackCard({ data }: { data: any }) {
  if (data.status === 'unconfigured') return <UnconfiguredCard title="Betterstack" vars={['BETTERSTACK_API_KEY']} />

  const dotColor = (s: string) => {
    if (s === 'up') return '#4a7a5a'
    if (s === 'down') return '#dc2626'
    return '#9ca3af'
  }

  return (
    <ServiceCard title="Betterstack" status={data.status} href="https://uptime.betterstack.com">
      {data.monitors?.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No monitors configured.</div>
      )}
      {data.monitors?.map((m: any) => (
        <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: '1px solid var(--border-light, #f0f0f0)', fontSize: '13px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: dotColor(m.status), flexShrink: 0, display: 'inline-block' }} />
          <span style={{ flex: 1, color: 'var(--text)', fontWeight: 500 }}>{m.name}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            {m.availability != null ? `${Number(m.availability).toFixed(2)}%` : '—'}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{m.status}</span>
        </div>
      ))}
    </ServiceCard>
  )
}

// ── Anthropic card ────────────────────────────────────────────────────────────
function AnthropicCard({ data }: { data: any }) {
  if (data.status === 'unconfigured') return <UnconfiguredCard title="Anthropic" vars={['ANTHROPIC_API_KEY']} />

  return (
    <ServiceCard title="Anthropic" status={data.status} href="https://console.anthropic.com">
      <InfoRow label="Key Configured" value={data.keyConfigured ? 'Yes' : 'No'} />
      <InfoRow label="API Key" value={data.keyMasked} />
      <div style={{ marginTop: '14px', background: '#f8f9fa', borderRadius: '8px', padding: '12px 14px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Usage analytics available at{' '}
        <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold, #b5965a)' }}>
          console.anthropic.com
        </a>
      </div>
    </ServiceCard>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function IntegrationsDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [fetchedAt, setFetchedAt] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/integrations', { cache: 'no-store' })
      const json = await res.json()
      setData(json)
      setFetchedAt(json.fetchedAt)
    } catch {
      // keep old data on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 40px' }}>
        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <Link
              href="/admin"
              style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '10px' }}
            >
              ← Back to Admin
            </Link>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--text)', margin: 0, lineHeight: 1.2 }}>
              Infrastructure Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px', margin: '6px 0 0' }}>
              Live status across all connected services
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <button
              onClick={load}
              disabled={loading}
              style={{
                background: 'var(--text)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontFamily: 'var(--font-body)',
              }}
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            {fetchedAt && (
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Last fetched {timeAgo(fetchedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
          }}
        >
          {loading && !data ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : data ? (
            <>
              <GitHubCard data={data.github} />
              <VercelCard data={data.vercel} />
              <SupabaseCard data={data.supabase} />
              <ResendCard data={data.resend} />
              <UpstashCard data={data.upstash} />
              <BetterstackCard data={data.betterstack} />
              <AnthropicCard data={data.anthropic} />
            </>
          ) : (
            <div style={{ gridColumn: '1 / -1', color: 'var(--text-muted)', textAlign: 'center', padding: '60px 0' }}>
              Failed to load data. <button onClick={load} style={{ background: 'none', border: 'none', color: 'var(--gold, #b5965a)', cursor: 'pointer', textDecoration: 'underline' }}>Try again</button>
            </div>
          )}
        </div>

        {/* Responsive override */}
        <style suppressHydrationWarning>{`
          @media (max-width: 768px) {
            div[style*="repeat(2, 1fr)"] {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </main>
    </div>
  )
}
