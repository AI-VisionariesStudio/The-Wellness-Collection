import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ChecklistClient, { Section, StateMap } from './ChecklistClient'

const SECTIONS: Section[] = [
  {
    key: 'domain',
    icon: '🌐',
    title: 'Domain & DNS',
    items: [
      { key: 'domain-1', title: 'gracefullyredefined-thewellnescollection.com resolves correctly', subtitle: 'GoDaddy A record → 76.76.21.21', tag: 'critical' },
      { key: 'domain-2', title: 'www CNAME points to Vercel', subtitle: 'CNAME → cname.vercel-dns.com', tag: 'critical' },
      { key: 'domain-3', title: 'SSL certificate active (HTTPS green)', subtitle: 'Vercel auto-provisions via Let\'s Encrypt' },
      { key: 'domain-4', title: 'Vercel domain shows Valid Configuration', subtitle: 'Settings → Domains in Vercel dashboard' },
    ],
  },
  {
    key: 'env',
    icon: '🔐',
    title: 'Environment Variables',
    items: [
      { key: 'env-1', title: 'NEXTAUTH_URL set to live domain', subtitle: 'Not the Vercel .app URL', tag: 'critical' },
      { key: 'env-2', title: 'NEXTAUTH_SECRET is a strong random value', subtitle: 'Generated via crypto.randomBytes(32)', tag: 'security' },
      { key: 'env-3', title: 'Stripe live keys in Vercel env (not test keys)', subtitle: 'STRIPE_SECRET_KEY + STRIPE_PUBLISHABLE_KEY', tag: 'payment' },
      { key: 'env-4', title: 'STRIPE_WEBHOOK_SECRET set', subtitle: 'From Stripe Dashboard → Webhooks', tag: 'payment' },
      { key: 'env-5', title: 'Claude API key rotated, old key revoked', subtitle: 'ANTHROPIC_API_KEY in Vercel env', tag: 'security' },
      { key: 'env-6', title: 'Supabase/database connection string live', subtitle: 'DATABASE_URL pointing to production DB' },
    ],
  },
  {
    key: 'security',
    icon: '🛡',
    title: '7-Domain Security Architecture',
    items: [
      { key: 'sec-1', title: 'API key rotation implemented', subtitle: 'Old keys revoked, new keys in Vercel', tag: 'security' },
      { key: 'sec-2', title: 'PII protection active', subtitle: 'No PII logged or exposed in responses', tag: 'security' },
      { key: 'sec-3', title: 'Prompt injection prevention in place', subtitle: 'System prompt defense layer validated', tag: 'security' },
      { key: 'sec-4', title: 'Psychoeducational constraint enforcement live', subtitle: '3-layer: system prompt + validator + UI disclaimer', tag: 'security' },
      { key: 'sec-5', title: 'Rate limiting active on all AI endpoints', subtitle: '/api/* returns 429 after threshold', tag: 'security' },
      { key: 'sec-6', title: 'Audit logging enabled', subtitle: 'audit_logs table created and writing', tag: 'security' },
      { key: 'sec-7', title: 'Helmet security headers active', subtitle: 'X-Frame-Options, CSP, HSTS headers set', tag: 'security' },
    ],
  },
  {
    key: 'stripe',
    icon: '💳',
    title: 'Stripe & Payments',
    items: [
      { key: 'stripe-1', title: 'Stripe live mode enabled', subtitle: 'Not test mode in production', tag: 'payment' },
      { key: 'stripe-2', title: '/api/webhooks/stripe handler exists', subtitle: 'Handles payment_intent.succeeded, failed, refunded', tag: 'payment' },
      { key: 'stripe-3', title: 'Webhook signature verified', subtitle: 'stripe.webhooks.constructEvent called', tag: 'payment' },
      { key: 'stripe-4', title: 'Webhook URL set in Stripe Dashboard', subtitle: 'Points to live domain, not Vercel .app URL', tag: 'payment' },
      { key: 'stripe-5', title: 'End-to-end payment tested with real card', subtitle: 'Enrollment confirmed, email sent, course accessible', tag: 'critical' },
      { key: 'stripe-6', title: 'Stripe logo visible on checkout page', subtitle: 'Trust signal for users' },
    ],
  },
  {
    key: 'ai',
    icon: '🤖',
    title: 'AI Features — Course Companion & Reflection Pulse',
    items: [
      { key: 'ai-1', title: 'Course Companion chat widget live', subtitle: 'Sprint 1 feature', tag: 'content' },
      { key: 'ai-2', title: 'Reflection Pulse check-in live', subtitle: 'Sprint 1 feature', tag: 'content' },
      { key: 'ai-3', title: 'Educational disclaimer visible on ALL AI features', subtitle: 'Not therapeutic, not clinical — psychoeducational only', tag: 'critical' },
      { key: 'ai-4', title: 'AI responses validated through 3-layer defense', subtitle: 'System prompt + response validator + UI disclaimer', tag: 'security' },
      { key: 'ai-5', title: 'Rate limiting on AI endpoints', subtitle: 'Prevent runaway API costs', tag: 'security' },
    ],
  },
  {
    key: 'courses',
    icon: '📚',
    title: 'Courses & Content',
    items: [
      { key: 'courses-1', title: '"Your Attachment Style" course live and accessible', subtitle: 'Post-purchase enrollment flow tested', tag: 'content' },
      { key: 'courses-2', title: 'Spotlightr videos domain-locked to live domain', subtitle: 'gracefullyredefined-thewellnescollection.com', tag: 'content' },
      { key: 'courses-3', title: 'Video right-click / Save As disabled', subtitle: 'Content protection active', tag: 'security' },
      { key: 'courses-4', title: 'Certificate generation working', subtitle: 'UUID serial number, /verify endpoint live', tag: 'content' },
      { key: 'courses-5', title: 'All nav pages live: Home, About, Courses, Free Resources, Workbooks, Disclaimers, Contact', subtitle: 'No 404s on menu items', tag: 'critical' },
    ],
  },
  {
    key: 'legal',
    icon: '⚖️',
    title: 'Legal & Compliance',
    items: [
      { key: 'legal-1', title: 'Terms & Service live at /terms', tag: 'legal' },
      { key: 'legal-2', title: 'Privacy Policy live at /privacy', tag: 'legal' },
      { key: 'legal-3', title: 'AI disclaimers on all AI feature UI', subtitle: 'Educational only — not a substitute for clinical services', tag: 'legal' },
      { key: 'legal-4', title: 'GDPR endpoints tested', subtitle: 'Data export / deletion requests', tag: 'legal' },
      { key: 'legal-5', title: 'Gracefully Redefined Counseling + Wellness brand correct throughout', subtitle: 'No "KKJ" or placeholder text remaining', tag: 'content' },
    ],
  },
  {
    key: 'monitoring',
    icon: '📊',
    title: 'Monitoring & Post-Launch',
    items: [
      { key: 'mon-1', title: 'Sentry error tracking live', subtitle: 'Dashboard reviewed daily in week 1' },
      { key: 'mon-2', title: 'BetterStack uptime monitoring active', subtitle: 'Alerts configured' },
      { key: 'mon-3', title: '/api/health endpoint returns 200' },
      { key: 'mon-4', title: 'Database backups enabled in Supabase' },
      { key: 'mon-5', title: 'Support email configured in env', subtitle: 'Enrollment confirmation + cert delivery emails sending', tag: 'critical' },
      { key: 'mon-6', title: 'Admin can view audit logs' },
    ],
  },
]

export default async function ChecklistPage() {
  const session = await getServerSession(authOptions).catch(() => null)
  if (!session || (session.user as any)?.role !== 'ADMIN') redirect('/login')

  const allKeys = SECTIONS.flatMap(s => s.items.map(i => i.key))
  const rows = await prisma.checklistState.findMany({ where: { itemKey: { in: allKeys } } })

  const initial: StateMap = {}
  for (const row of rows) {
    initial[row.itemKey] = {
      checked: row.checked,
      checkedBy: row.checkedBy,
      checkedAt: row.checkedAt,
      note: row.note,
    }
  }

  return <ChecklistClient sections={SECTIONS} initial={initial} />
}
