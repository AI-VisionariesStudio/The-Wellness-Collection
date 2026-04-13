# CSS Governance Migration Guide — The Wellness Collection

## Overview

This document walks you through integrating the CSS governance system into your existing codebase. The goal: **zero CSS drift, zero desktop/mobile breakage, enforced at every level from code to CI.**

---

## What You're Getting

| Layer | What It Does | Catches Problems At |
|-------|-------------|---------------------|
| **Design Tokens** | Single source of truth for all visual values | Authoring time |
| **Layout Components** | Locked responsive containers (Section, Grid, Card, Stack) | Authoring time |
| **Tailwind Lint** | Detects conflicting classes, unauthorized values | Save / commit time |
| **Stylelint** | Bans `!important`, enforces CSS rules | Save / commit time |
| **Visual Regression** | Screenshot diffs at mobile/tablet/desktop | PR / pre-deploy |
| **Spacing Tests** | Programmatic overflow/font-size/clipping checks | PR / pre-deploy |
| **CI Pipeline** | Blocks merge if any check fails | Before production |
| **Claude Code Spec** | Rules that prevent drift during AI-assisted coding | Session start |

---

## Step-by-Step Integration

### Phase 1: Foundation (Do First)

**1a. Install dependencies**

```bash
# From your project root
npm install clsx tailwind-merge
npm install -D eslint-plugin-tailwindcss stylelint stylelint-config-standard @playwright/test
npx playwright install chromium
```

**1b. Add the utility function**

Copy `lib/utils.ts` (the `cn` function) into your project. If you already have a `cn` utility using `clsx` + `tailwind-merge`, you're good — just make sure it's the version with `twMerge`.

**1c. Add design tokens**

Copy `lib/design-tokens.ts` into your project. **Customize the colors** to match your actual brand palette. The structure stays the same — only the hex values change.

To find your current colors, run this in your project:
```bash
grep -rn "bg-\[#\|text-\[#\|border-\[#" app/ components/ | head -30
```

Replace every arbitrary hex with a token reference.

**1d. Merge into tailwind.config.ts**

Don't replace your config — merge the token references in. The key changes:
- `screens` locked to only `md` and `lg`
- `colors` pulled from tokens
- `fontFamily` pulled from tokens
- `spacing` pulled from tokens

### Phase 2: Components (Do Second)

**2a. Add layout components**

Copy the five component files into `components/ui/`:
- `Section.tsx` — page-level content wrapper
- `Container.tsx` — inner content wrapper for full-bleed sections
- `Card.tsx` — any card-like surface
- `Grid.tsx` — multi-column responsive layouts
- `Stack.tsx` — vertical/horizontal spacing

**2b. Migrate pages incrementally**

You don't need to rewrite everything at once. Migrate page by page:

**Before (ad-hoc):**
```tsx
<div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-20">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
      ...
    </div>
  </div>
</div>
```

**After (governed):**
```tsx
<Section spacing="lg">
  <Grid cols={{ md: 2, lg: 3 }} gap="md">
    <Card variant="elevated">
      ...
    </Card>
  </Grid>
</Section>
```

The layout behavior is identical, but now it's **locked** — no one (including Claude Code) can accidentally change the responsive padding or grid behavior.

**2c. Priority pages to migrate first:**
1. Home page (`/`) — highest traffic, most layout complexity
2. Courses listing (`/courses`) — grid layout, cards
3. Individual course page — content + sidebar layout
4. About page — text-heavy, Section + Stack usage
5. Login/Signup — forms, simpler layout

### Phase 3: Linting (Do Third)

**3a. Add lint configs**

Copy `.stylelintrc.json` and merge `eslint.config.mjs` with your existing ESLint config.

**3b. Add scripts to package.json**

```json
{
  "scripts": {
    "lint:css": "eslint --max-warnings=0 \"app/**/*.{ts,tsx}\" \"components/**/*.{ts,tsx}\"",
    "lint:styles": "stylelint \"**/*.css\" --ignore-path .gitignore",
    "lint:all": "npm run lint:css && npm run lint:styles"
  }
}
```

**3c. Run lint and fix existing violations**

```bash
npm run lint:all
```

Expect warnings on first run. Fix them in batches:
- Class conflicts (`p-4 p-8`) → pick one
- Arbitrary values (`text-[#8B7355]`) → replace with token
- `!important` → remove and fix specificity

### Phase 4: Visual Testing (Do Fourth)

**4a. Add Playwright config and test files**

Copy `playwright.config.ts` and the `e2e/` directory.

**4b. Update the `pages` array in `visual-regression.spec.ts`**

Edit the array to match your actual routes:
```ts
const pages = [
  { path: '/',            name: 'home' },
  { path: '/about',       name: 'about' },
  { path: '/courses',     name: 'courses' },
  { path: '/login',       name: 'login' },
  // add your actual routes
];
```

**4c. Generate initial baselines**

```bash
npm run dev  # start your dev server
npx playwright test --update-snapshots
```

This creates the "golden" screenshots. Commit them to git.

**4d. Test it works**

Make any CSS change, then run:
```bash
npx playwright test
```

It should fail showing the diff. That's the system working.

### Phase 5: CI Pipeline (Do Last)

**5a. Add the GitHub Action**

Copy `.github/workflows/css-governance.yml` into your repo.

**5b. Add secrets**

In GitHub repo settings → Secrets, add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Any other env vars needed for build

**5c. Test with a PR**

Create a branch, make a minor CSS change, open a PR. The workflow should run and either pass or fail based on the change.

### Phase 6: Claude Code Integration

**6a. Append CSS governance rules to your spec**

Copy the contents of `CSS_GOVERNANCE_SPEC.md` and append them to your `CLAUDE_CODE_EXECUTABLE_SPEC.md`.

**6b. Session initialization check**

When starting a Claude Code session that involves CSS/layout work, the first instruction should be:

```
Before making any CSS changes, confirm you've read the CSS Governance 
section of the executable spec. List the 5 absolute rules.
```

This forces acknowledgment before work begins.

---

## Troubleshooting

### "Playwright screenshots differ on CI vs local"

Font rendering varies across OS. Solutions:
- Run Playwright in Docker locally to match CI: `npx playwright test --headed`
- Increase `maxDiffPixelRatio` to `0.02` (2%) if font diffs are the only issue
- Use `--ignore-snapshots` for initial CI runs while stabilizing

### "ESLint flags classes in third-party components"

Add to your ESLint config's `settings.tailwindcss.whitelist`:
```js
whitelist: ['container-wellness', 'some-third-party-class']
```

### "I need a breakpoint other than md/lg"

Document why in a code comment and add it to `tailwind.config.ts` with a note:
```ts
screens: {
  md: breakpoints.md,
  lg: breakpoints.lg,
  // EXCEPTION: xl needed for ultra-wide course video layout
  // Approved: [date] — [reason]
  xl: '1280px',
}
```

### "Design tokens don't match my current colors"

Run the color audit:
```bash
grep -rhn "bg-\|text-\|border-" app/ components/ | \
  grep -oP '(bg|text|border)-\[#[a-fA-F0-9]+\]' | \
  sort | uniq -c | sort -rn
```

This shows every arbitrary color in your codebase. Map each to a token.

---

## Command Reference

| Command | When to Use |
|---------|-------------|
| `npm run lint:all` | Before every commit with CSS changes |
| `npm run test:visual` | Before pushing CSS changes |
| `npm run test:css:update` | After intentional visual changes (approve new baselines) |
| `npm run governance` | Full check — lint + visual + spacing |
| `npm run governance:fix` | Auto-fix lintable issues |

---

## Success Criteria

You'll know the governance is working when:

1. **Claude Code sessions** never produce raw Tailwind on page files — only component usage
2. **PRs with CSS changes** automatically run visual regression in CI
3. **No `!important`** exists anywhere in the codebase
4. **No arbitrary values** (`[#hex]`, `[Xpx]`) outside of design tokens
5. **Every page** looks correct at 390px, 768px, and 1440px — verified by screenshots
6. **Zero horizontal overflow** at any breakpoint
7. **Font sizes** never drop below 14px on mobile for body text
