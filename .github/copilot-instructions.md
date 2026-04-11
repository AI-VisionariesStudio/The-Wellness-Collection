# Wellness Collection — Copilot Workspace Instructions

You are working in **The Wellness Collection** — a Next.js 14 platform (Supabase, Prisma, Stripe, Vercel) for wellness courses and healing.

## When to Use the Wellness Fixes Agent

For any work involving:
- **Features, pages, or components** on the platform
- **Wellness course content** or dashboard functionality
- **Bug fixes or improvements** to existing pages

**Delegate to `@wellness-fixes`** — it has scope-limited tool access and respects architectural boundaries (no auth/middleware/Stripe changes without approval).

## Key Boundaries

- ❌ DO NOT modify: `app/api/auth/`, `middleware.ts`, `lib/stripe.ts`, `app/api/stripe/` without explicit confirmation
- ✅ DO ask before editing ANY file not already discussed in the conversation
- ✅ DO focus on features and pages (wellness courses, dashboards, coming soon, etc.)

## Tech Stack Context

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma |
| Auth | NextAuth.js |
| Payment | Stripe |
| Deployment | Vercel |

## Common Endpoints to Know

- **Wellness leads**: `/api/leads/wellness` (POST: name, email → wellnessLead table)
- **Progress tracking**: `/api/progress`
- **Courses**: `/app/courses/` (protected, dashboard at `/app/dashboard/`)
- **Coming soon gate**: `/app/coming-soon/` (public lead capture)

## Quick Links

- Prisma schema: `prisma/schema.prisma`
- Email templates: `lib/email.ts`
- Auth config: `lib/auth.ts` (restricted)
