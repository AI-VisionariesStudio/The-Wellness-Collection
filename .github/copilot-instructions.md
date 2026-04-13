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

---

## CSS & Layout Governance (MANDATORY)

### Absolute Rules — Violations Are Blockers

1. **NEVER add raw Tailwind classes to page-level files.**
   Use `<Section>`, `<Container>`, `<Card>`, `<Grid>`, `<Stack>` from `@/components/ui`.
   Wrong: `<div className="max-w-7xl mx-auto px-4 md:px-8">`
   Right: `<Section width="default">`

2. **NEVER introduce a new spacing, color, or font value.**
   All values come from `lib/design-tokens.ts` → `tailwind.config.ts`.
   If a value doesn't exist, ADD IT TO TOKENS FIRST, then use it.
   Wrong: `className="text-[#8B7355]"` or `className="p-[22px]"`
   Right: `className="text-primary-600"` or `className="p-5"`

3. **NEVER use breakpoints other than `base`, `md`, `lg`.**
   Mobile-first. Three breakpoints only. No `sm:`, `xl:`, `2xl:`.

4. **NEVER use `!important`.**
   Fix the architecture, not the symptom.

5. **NEVER use arbitrary values `[...]` for spacing, colors, or sizes.**
   Wrong: `w-[347px]`, `text-[15px]`, `bg-[#f0f0f0]`
   Right: Use the closest token value.

6. **ALL layout changes require mobile + desktop verification.**
   Verify at 390px (mobile) and 1440px (desktop) before marking complete.

### Component Usage Rules

7. **Page sections → `<Section>`** — handles max-width, padding, vertical spacing.
8. **Multi-column layouts → `<Grid>`** — handles responsive columns and gap.
9. **Vertical/horizontal lists → `<Stack>`** — handles consistent gap.
10. **Card-like surfaces → `<Card>`** — handles variant styling, padding, radius.

### Responsive Rules

11. **Mobile-first ALWAYS.** Write mobile layout first (no prefix), then `md:`, then `lg:`.
12. **Test at exact breakpoint boundaries.** 767px = mobile. 768px = tablet. 1024px = desktop.

### Process Rules

13. **Run lint before committing CSS changes.** `npm run lint:all`
14. **One CSS concern per commit.** Don't mix feature work with CSS refactoring.

### Existing CSS Vars (Preserved — Do Not Remove)

The following vars are used site-wide in legacy pages. Do NOT rename or remove them:
`--bg`, `--header`, `--blush`, `--card`, `--white`, `--text`, `--text-muted`,
`--border`, `--border-light`, `--success`, `--navy`, `--gold`, `--cream`, `--mid`,
`--font-display`, `--font-body`, `--radius`, `--radius-lg`, `--shadow`, `--shadow-lg`, `--transition`

New pages and components use design tokens + layout components instead.
