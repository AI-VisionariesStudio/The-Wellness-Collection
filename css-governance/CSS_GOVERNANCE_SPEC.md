# ================================================
# CSS GOVERNANCE RULES — The Wellness Collection
# ================================================
# Append this to CLAUDE_CODE_EXECUTABLE_SPEC.md
# These rules are MANDATORY for all Claude Code sessions.
# ================================================

## CSS & Layout Governance (MANDATORY)

### Absolute Rules — Violations Are Blockers

1. **NEVER add raw Tailwind classes to page-level files.**
   Use `<Section>`, `<Container>`, `<Card>`, `<Grid>`, `<Stack>` components.
   Wrong: `<div className="max-w-7xl mx-auto px-4 md:px-8">`
   Right: `<Section width="default">`

2. **NEVER introduce a new spacing, color, or font value.**
   All values come from `lib/design-tokens.ts` → `tailwind.config.ts`.
   If a value doesn't exist, ADD IT TO TOKENS FIRST, then use it.
   Wrong: `className="text-[#8B7355]"` or `className="p-[22px]"`
   Right: `className="text-primary-600"` or `className="p-5"`

3. **NEVER use breakpoints other than `base`, `md`, `lg`.**
   Mobile-first. Three breakpoints only. No `sm:`, `xl:`, `2xl:`.
   If you think you need another breakpoint, explain why in a comment.

4. **NEVER use `!important`.**
   If specificity is a problem, the component architecture is wrong.
   Fix the architecture, not the symptom.

5. **NEVER use arbitrary values `[...]` for spacing, colors, or sizes.**
   Wrong: `w-[347px]`, `text-[15px]`, `bg-[#f0f0f0]`
   Right: Use the closest token value.
   Exception: One-off positioning values with documented justification.

6. **ALL layout changes require mobile + desktop verification.**
   Before marking a CSS task complete, verify at both:
   - 390px wide (iPhone 13/14)
   - 1440px wide (standard desktop)
   Provide screenshot or confirmation of both.

### Component Usage Rules

7. **Page sections → `<Section>`**
   Every top-level content block on a page uses Section.
   Section handles: max-width, horizontal padding, vertical spacing.

8. **Multi-column layouts → `<Grid>`**
   Courses grid, feature cards, testimonials — all use Grid.
   Grid handles: responsive columns, gap spacing.

9. **Vertical/horizontal lists → `<Stack>`**
   Form fields, nav items, content blocks in sequence — all use Stack.
   Stack handles: consistent gap between children.

10. **Card-like surfaces → `<Card>`**
    Anything with a background, border, shadow, and padding.
    Card handles: variant styling, responsive padding, border radius.

### Responsive Rules

11. **Mobile-first ALWAYS.**
    Write the mobile layout first (no prefix).
    Add `md:` overrides for tablet. Add `lg:` overrides for desktop.
    Wrong: `hidden lg:block` (desktop-first thinking)
    Right: `block md:grid md:grid-cols-2` (mobile-first, progressively enhanced)

12. **Test at exact breakpoint boundaries.**
    767px should look like mobile.
    768px should look like tablet.
    1023px should look like tablet.
    1024px should look like desktop.

### Process Rules

13. **Run lint before committing CSS changes.**
    `npx eslint --max-warnings=0 'app/**/*.{ts,tsx}' 'components/**/*.{ts,tsx}'`

14. **Run visual regression locally before pushing.**
    `npx playwright test e2e/visual-regression.spec.ts`
    If screenshots differ, either fix the regression or update baselines
    with `--update-snapshots` and document why.

15. **One CSS concern per commit.**
    Don't mix feature work with CSS refactoring.
    Makes it easy to revert if something breaks.
