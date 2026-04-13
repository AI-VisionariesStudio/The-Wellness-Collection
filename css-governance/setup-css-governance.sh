#!/bin/bash

# ================================================
# CSS GOVERNANCE SETUP — The Wellness Collection
# ================================================
# Run this script from your project root to install
# all governance tooling and configure the project.
#
# Usage:
#   chmod +x setup-css-governance.sh
#   ./setup-css-governance.sh
# ================================================

set -e

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   CSS Governance Setup                       ║"
echo "║   The Wellness Collection                    ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ──────────────────────────────────────────
# 1. INSTALL DEPENDENCIES
# ──────────────────────────────────────────
echo "📦 Installing governance dependencies..."

# Tailwind class conflict detection
npm install -D eslint-plugin-tailwindcss

# CSS linting (catches !important, specificity issues)
npm install -D stylelint stylelint-config-standard

# Class merging utility (prevents conflicts in components)
npm install clsx tailwind-merge

# Visual regression testing
npm install -D @playwright/test

# Install Playwright browser
npx playwright install chromium

echo "✅ Dependencies installed"

# ──────────────────────────────────────────
# 2. ADD NPM SCRIPTS
# ──────────────────────────────────────────
echo ""
echo "📝 Adding npm scripts..."

# Use node to safely merge scripts into package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

pkg.scripts = pkg.scripts || {};

// Add governance scripts (don't overwrite existing)
const newScripts = {
  'lint:css': 'eslint --max-warnings=0 \"app/**/*.{ts,tsx}\" \"components/**/*.{ts,tsx}\"',
  'lint:styles': 'stylelint \"**/*.css\" --ignore-path .gitignore',
  'lint:all': 'npm run lint:css && npm run lint:styles',
  'test:visual': 'playwright test e2e/visual-regression.spec.ts',
  'test:spacing': 'playwright test e2e/spacing-consistency.spec.ts',
  'test:css': 'npm run test:visual && npm run test:spacing',
  'test:css:update': 'playwright test --update-snapshots',
  'governance': 'npm run lint:all && npm run test:css',
  'governance:fix': 'eslint --fix \"app/**/*.{ts,tsx}\" \"components/**/*.{ts,tsx}\"',
};

for (const [key, value] of Object.entries(newScripts)) {
  if (!pkg.scripts[key]) {
    pkg.scripts[key] = value;
    console.log('  Added script: ' + key);
  } else {
    console.log('  Skipped (exists): ' + key);
  }
}

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

echo "✅ NPM scripts configured"

# ──────────────────────────────────────────
# 3. CREATE DIRECTORY STRUCTURE
# ──────────────────────────────────────────
echo ""
echo "📁 Creating directory structure..."

mkdir -p e2e/snapshots
mkdir -p .github/workflows

echo "✅ Directories created"

# ──────────────────────────────────────────
# 4. SETUP GITIGNORE ENTRIES
# ──────────────────────────────────────────
echo ""
echo "📝 Updating .gitignore..."

GITIGNORE_ENTRIES=(
  "# CSS Governance"
  "e2e/test-results/"
  "playwright-report/"
  "blob-report/"
)

for entry in "${GITIGNORE_ENTRIES[@]}"; do
  if ! grep -qF "$entry" .gitignore 2>/dev/null; then
    echo "$entry" >> .gitignore
    echo "  Added: $entry"
  fi
done

echo "✅ .gitignore updated"

# ──────────────────────────────────────────
# 5. SUMMARY
# ──────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   Setup Complete!                            ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "📋 FILES TO COPY INTO YOUR PROJECT:"
echo ""
echo "  Core Token System:"
echo "    lib/design-tokens.ts     → lib/design-tokens.ts"
echo "    lib/utils.ts             → lib/utils.ts"
echo "    tailwind.config.ts       → tailwind.config.ts (merge with existing)"
echo "    app/globals.css          → app/globals.css (merge with existing)"
echo ""
echo "  Layout Components:"
echo "    components/ui/Section.tsx    → components/ui/Section.tsx"
echo "    components/ui/Container.tsx  → components/ui/Container.tsx"
echo "    components/ui/Card.tsx       → components/ui/Card.tsx"
echo "    components/ui/Grid.tsx       → components/ui/Grid.tsx"
echo "    components/ui/Stack.tsx      → components/ui/Stack.tsx"
echo "    components/ui/index.ts       → components/ui/index.ts"
echo ""
echo "  Testing:"
echo "    playwright.config.ts               → playwright.config.ts"
echo "    e2e/visual-regression.spec.ts      → e2e/visual-regression.spec.ts"
echo "    e2e/spacing-consistency.spec.ts    → e2e/spacing-consistency.spec.ts"
echo ""
echo "  Linting:"
echo "    eslint.config.mjs       → eslint.config.mjs (merge with existing)"
echo "    .stylelintrc.json       → .stylelintrc.json"
echo ""
echo "  CI/CD:"
echo "    .github/workflows/css-governance.yml"
echo ""
echo "  Spec:"
echo "    CSS_GOVERNANCE_SPEC.md  → Append to CLAUDE_CODE_EXECUTABLE_SPEC.md"
echo ""
echo "🚀 QUICK START COMMANDS:"
echo ""
echo "  npm run lint:all        # Check for CSS issues"
echo "  npm run test:visual     # Run visual regression tests"
echo "  npm run test:css:update # Update screenshot baselines"
echo "  npm run governance      # Run full governance check"
echo ""
echo "📖 See CSS_GOVERNANCE_SPEC.md for all rules."
echo ""
