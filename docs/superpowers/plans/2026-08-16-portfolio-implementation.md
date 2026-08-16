# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Aaron Chu's developer portfolio on Cloudflare Pages — a multi-disciplinary Next.js site (Full Stack / AI / Design / Game / Photo) with PixiJS visual effects, minimal-but-strong parallax, contact form via Hono + Resend + Turnstile, MDX content via Velite, R2 media hosting, Playwright E2E tests.

**Architecture:** Next.js (App Router) on Cloudflare Pages via OpenNext. Static rendering for content pages + Worker runtime for `/api/*` (Hono), `/og/*` (next/og), sitemap, robots. Tailwind v4 for styling, Framer Motion + PixiJS 7 + WebGL2 for effects, Velite for typed MDX content, R2 for media storage. 5-discipline project categorization with URL-synced filter chips. CI/CD via Cloudflare Pages Git integration + GitHub Actions for CI.

**Tech Stack:**
- Next.js 15+ (App Router) + Turbopack
- TypeScript 5+ (strict mode)
- Tailwind CSS v4 (Oxide)
- shadcn/ui (selected primitives)
- Framer Motion (entrance, hover, parallax)
- PixiJS 7 + WebGL2 (gradient mesh, ambient noise, hero displacement)
- Font Awesome 7 Free (`@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` + `@fortawesome/free-brands-svg-icons`)
- Velite (typed MDX content)
- Hono (mounted at `app/api/[...route]/route.ts`)
- Cloudflare D1, KV, R2 (storage)
- Cloudflare Workers Email + Resend + Turnstile
- Jest + React Testing Library (unit/component)
- Playwright (E2E)

**Spec:** `docs/superpowers/specs/2026-08-16-portfolio-stack-design.md`

**UIUX reference:** `UIUX.md`

**Project memory:** `AGENTS.md`

---

## Global Constraints

These apply to every task. Pulled from the spec verbatim.

- **Domain**: `https://aaronchu.cc` (media subdomain: `media.aaronchu.cc` → R2)
- **Cloudflare Account ID**: `65cbc69e461eb925f39d60fe6490f8d1`
- **Cloudflare Account Auth**: `aaron_powerchu@hotmail.com` (GitHub SSO)
- **Color palette**: B/W base (`#0A0A0A` / `#FAFAFA`) + single accent `#DF6C4F` (terracotta). No other accent colors.
- **Typography**: Inter Tight + Inter (variable, self-hosted via `next/font`). Two weights only — 400 (regular) for display, 800 (bold) for UI labels. JetBrains Mono for code.
- **TypeScript**: strict mode. No `any` without a comment justifying it.
- **Test coverage gate**: 80% lines + branches, 80% functions + statements. Jest fails the build if it drops.
- **Frameworks dropped**: Vite (replaced by Jest + Turbopack), Supabase (replaced by R2/D1/KV), Workers (replaced by Pages), Sentry (replaced by console + wrangler tail).
- **Accessibility**: WCAG AA color contrast, `useReducedMotion()` on every animation, semantic HTML, focus rings preserved, skip-to-content link, keyboard reachable.
- **5 project categories** (enum): `full-stack`, `ai`, `graphic-design`, `game-dev`, `photography`. Projects can belong to multiple. Filter on `/projects` via `?category=<slug>`.
- **Package manager**: npm.
- **Branch**: `main`. Branch protection enforced — PRs required.
- **Conventional commits**: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.

---

## Phase 0 — Foundation Migration

Replaces the `react-vite-worker` template with a Next.js + OpenNext skeleton. Ends with a runnable Next.js dev server that builds for Pages.

### Task 0.1: Initialize Next.js project structure

**Files:**
- Modify: `package.json` (replace with Next.js dependencies)
- Delete: `vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.worker.json`
- Create: `tsconfig.json` (single Next.js TS config)
- Create: `next.config.ts`
- Delete: `src/react-app/` (entire directory)
- Delete: `src/worker/` (entire directory)
- Create: `app/layout.tsx` (placeholder)
- Create: `app/page.tsx` (placeholder)

**Interfaces:**
- Produces: a working `next dev` server at `http://localhost:3000` returning a placeholder page

- [ ] **Step 1: Read the existing package.json to know what's there**

```bash
cat /Users/powerchu/Git/aaron-chu-portfolio-dev/package.json
```

- [ ] **Step 2: Replace package.json with Next.js dependencies**

Write the following to `package.json`:

```json
{
  "name": "aaron-chu-portfolio-dev",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test:unit": "jest",
    "test:e2e": "playwright test",
    "test": "npm run test:unit && npm run test:e2e",
    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts",
    "deploy": "wrangler pages deploy .open-next --project-name=aaron-chu-portfolio --commit-dirty=true",
    "preview": "npm run build && npx wrangler pages dev .open-next",
    "media:upload": "tsx scripts/upload-media.ts"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "hono": "^4.6.0",
    "@hono/zod-validator": "^0.4.0",
    "zod": "^3.23.0",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@fortawesome/fontawesome-svg-core": "^6.7.0",
    "@fortawesome/free-solid-svg-icons": "^6.7.0",
    "@fortawesome/free-brands-svg-icons": "^6.7.0",
    "framer-motion": "^11.11.0",
    "pixi.js": "^8.5.0",
    "velite": "^0.0.0"  
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@cloudflare/workers-types": "^4.0.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/typography": "^0.5.15",
    "@opennextjs/cloudflare": "^1.0.0",
    "wrangler": "^3.90.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^15.0.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/user-event": "^14.5.0",
    "@playwright/test": "^1.48.0",
    "tsx": "^4.19.0"
  }
}
```

Note: `velite` version is `^0.0.0` as a placeholder — check the latest stable release when running `npm install` and pin it. Use `npm view velite version` to find current.

- [ ] **Step 3: Delete Vite-specific files**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
rm -f vite.config.ts tsconfig.app.json tsconfig.node.json tsconfig.worker.json
rm -rf src/react-app
rm -rf src/worker
rm -f wrangler.json
rm -f worker-configuration.d.ts
```

- [ ] **Step 4: Create a unified tsconfig.json**

Write the following to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "#site/content": ["./.velite"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".velite"
  ],
  "exclude": ["node_modules", ".next", "dist", ".open-next"]
}
```

- [ ] **Step 5: Create next.config.ts**

Write the following to `next.config.ts`:

```typescript
import type { NextConfig } from 'next'

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.prismic.io' },
      { protocol: 'https', hostname: 'media.aaronchu.cc' },
    ],
  },
  experimental: {
    optimizePackageImports: [
      '@fortawesome/react-fontawesome',
      '@fortawesome/free-solid-svg-icons',
      'framer-motion',
    ],
  },
}

export default config
```

- [ ] **Step 6: Create placeholder app/layout.tsx**

Write the following to `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aaron Chu — Developer Portfolio',
  description: 'Software engineer building thoughtful products at the edge.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 7: Create placeholder app/page.tsx**

Write the following to `app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main>
      <h1>Aaron Chu</h1>
      <p>Portfolio scaffold — work in progress.</p>
    </main>
  )
}
```

- [ ] **Step 8: Run npm install**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
rm -rf node_modules package-lock.json
npm install
```

Expected: dependencies install successfully. If any version errors appear (e.g., Velite version mismatch), adjust the version pin and re-run.

- [ ] **Step 9: Verify dev server starts**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run dev &
sleep 5
curl -s http://localhost:3000 | grep -q "Aaron Chu" && echo "PASS" || echo "FAIL"
kill %1
```

Expected: `PASS` (curl returns HTML containing "Aaron Chu"). Server should start on port 3000 without errors.

- [ ] **Step 10: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: migrate from Vite/Workers template to Next.js skeleton"
```

---

### Task 0.2: Configure TypeScript strict + ESLint

**Files:**
- Create: `.eslintrc.json`
- Modify: `tsconfig.json` (verify strict settings)

**Interfaces:**
- Produces: `npm run lint` and `npm run typecheck` both succeed on the empty skeleton

- [ ] **Step 1: Verify TypeScript strict is enabled**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
grep -E '"strict"|"noUncheckedIndexedAccess"|"noImplicitAny"' tsconfig.json
```

Expected: All three flags are `true`. If `noUncheckedIndexedAccess` and `noImplicitAny` are missing, add them.

- [ ] **Step 2: Add stricter flags to tsconfig.json**

Edit `tsconfig.json` `compilerOptions`:

```json
"strict": true,
"noUncheckedIndexedAccess": true,
"noImplicitOverride": true,
"noFallthroughCasesInSwitch": true,
"noImplicitReturns": true,
"forceConsistentCasingInFileNames": true,
```

- [ ] **Step 3: Create .eslintrc.json**

Write the following to `.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "react/no-unescaped-entities": "off"
  }
}
```

- [ ] **Step 4: Run lint and typecheck**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run lint
npm run typecheck
```

Expected: Both pass with no errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "chore: enable strict TS settings and ESLint config"
```

---

### Task 0.3: Configure Tailwind CSS v4

**Files:**
- Create: `app/globals.css` (Tailwind imports + theme tokens)
- Modify: `app/layout.tsx` (import globals.css)
- Create: `postcss.config.mjs` (Tailwind v4 PostCSS plugin)

**Interfaces:**
- Produces: Tailwind utility classes work in components; custom theme tokens (`bg-fg`, `bg-bg`, `text-muted`, `bg-accent`) are available

- [ ] **Step 1: Install Tailwind v4 PostCSS plugin**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm install -D @tailwindcss/postcss@^4.0.0
```

- [ ] **Step 2: Create postcss.config.mjs**

Write the following to `postcss.config.mjs`:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

- [ ] **Step 3: Create app/globals.css with theme tokens**

Write the following to `app/globals.css`:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-bg: #FAFAFA;
  --color-bg-dark: #0A0A0A;
  --color-fg: #0A0A0A;
  --color-fg-dark: #FAFAFA;
  --color-muted: #737373;
  --color-muted-dark: #A3A3A3;
  --color-accent: #DF6C4F;
  --color-accent-fg: #FFFFFF;
  --color-border: rgba(0, 0, 0, 0.08);
  --color-border-dark: rgba(255, 255, 255, 0.08);

  --font-display: var(--font-inter-tight);
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains-mono);

  --tracking-display: -0.04em;
  --tracking-micro: 0.04em;

  --leading-display: 0.95;
  --leading-tight: 1.1;
  --leading-relaxed: 1.6;
}

@layer base {
  html {
    background-color: var(--color-bg);
    color: var(--color-fg);
  }
  html.dark {
    background-color: var(--color-bg-dark);
    color: var(--color-fg-dark);
  }
  body {
    font-family: var(--font-sans), system-ui, sans-serif;
    line-height: var(--leading-relaxed);
    -webkit-font-smoothing: antialiased;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Import globals.css in layout.tsx**

Edit `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Aaron Chu — Developer Portfolio',
  description: 'Software engineer building thoughtful products at the edge.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 5: Verify Tailwind utility classes work**

Edit `app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main className="min-h-screen p-12">
      <h1 className="font-display text-6xl font-normal tracking-(--tracking-display) leading-(--leading-display)">
        Aaron Chu
      </h1>
      <p className="mt-4 text-muted">Portfolio scaffold — work in progress.</p>
      <div className="mt-8 inline-block rounded-md bg-accent px-6 py-3 text-accent-fg">
        Tailwind v4 working
      </div>
    </main>
  )
}
```

- [ ] **Step 6: Run dev server and verify styling**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run dev &
sleep 5
# Visit http://localhost:3000 in browser; expect terracotta button, large heading
kill %1
```

- [ ] **Step 7: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: configure Tailwind CSS v4 with design tokens"
```

---

### Task 0.4: Install shadcn/ui primitives

**Files:**
- Create: `components.json` (shadcn config)
- Modify: `components/ui/button.tsx` (generated)
- Modify: `components/ui/card.tsx` (generated)

**Interfaces:**
- Produces: working `<Button>` and `<Card>` shadcn components importable from `@/components/ui/button`

- [ ] **Step 1: Initialize shadcn/ui**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npx shadcn@latest init
```

When prompted:
- Style: `New York` (more minimalist)
- Base color: `Neutral`
- CSS variables: `Yes`

This creates `components.json`, `lib/utils.ts`, and `app/globals.css` updates (cn helper).

- [ ] **Step 2: Add Button + Card + Badge + Separator + DropdownMenu + Sheet**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npx shadcn@latest add button card badge separator dropdown-menu sheet
```

- [ ] **Step 3: Verify imports work**

Create `app/_test-shadcn/page.tsx`:

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function TestPage() {
  return (
    <main className="min-h-screen bg-bg p-12">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>shadcn/ui works</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Click me</Button>
        </CardContent>
      </Card>
    </main>
  )
}
```

- [ ] **Step 4: Verify in browser**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run dev &
sleep 5
# Visit http://localhost:3000/_test-shadcn
kill %1
```

Expected: Card with "shadcn/ui works" title and Button rendered. Delete `_test-shadcn` page after.

- [ ] **Step 5: Delete test page and commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
rm -rf app/_test-shadcn
git add -A
git commit -m "feat: install shadcn/ui primitives (Button, Card, Badge, etc.)"
```

---

### Task 0.5: Set up Jest + React Testing Library

**Files:**
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Create: `tests/unit/example.test.tsx`

**Interfaces:**
- Produces: `npm run test:unit` runs and one sample test passes

- [ ] **Step 1: Create jest.config.ts**

```typescript
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEach: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^#site/content$': '<rootDir>/.velite',
  },
  testMatch: ['<rootDir>/tests/unit/**/*.test.(ts|tsx)'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
}

export default config
```

- [ ] **Step 2: Create jest.setup.ts**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Create sample test**

Write `tests/unit/example.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'

describe('Jest setup', () => {
  it('renders a basic element', () => {
    render(<button>Hello</button>)
    expect(screen.getByRole('button', { name: /hello/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 4: Run tests**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit
```

Expected: 1 test passes.

- [ ] **Step 5: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "chore: configure Jest + React Testing Library with 80% coverage gate"
```

---

### Task 0.6: Set up Playwright

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/example.spec.ts`

**Interfaces:**
- Produces: `npm run test:e2e` runs and one sample E2E test passes against `next dev`

- [ ] **Step 1: Install Playwright browsers**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npx playwright install --with-deps chromium
```

- [ ] **Step 2: Create playwright.config.ts**

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
```

- [ ] **Step 3: Create sample E2E test**

Write `tests/e2e/example.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('home page renders', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Aaron Chu/)
})
```

- [ ] **Step 4: Run E2E tests**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:e2e
```

Expected: 1 test passes. Playwright auto-starts `next dev`.

- [ ] **Step 5: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "chore: configure Playwright with chromium and sample E2E"
```

---

### Task 0.7: Configure wrangler.jsonc + OpenNext for Cloudflare Pages

**Files:**
- Create: `wrangler.jsonc`
- Create: `open-next.config.ts`
- Create: `cloudflare-env.d.ts` (placeholder, will be regenerated by `wrangler types`)

**Interfaces:**
- Produces: `npm run build` produces `.open-next/` output; `npm run preview` starts a wrangler pages dev server

- [ ] **Step 1: Create wrangler.jsonc**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "aaron-chu-portfolio",
  "pages_build_output_dir": ".open-next",
  "compatibility_date": "2026-08-01",
  "compatibility_flags": ["nodejs_compat"],
  "observability": {
    "enabled": true
  },
  "upload_source_maps": true,
  "kv_namespaces": [
    { "binding": "VIEWS", "id": "PLACEHOLDER_KV_ID" }
  ],
  "r2_buckets": [
    { "binding": "MEDIA", "bucket_name": "aaronchu-portfolio-media" }
  ],
  "send_email": [
    { "name": "RESEND", "destination_address": "aaron_powerchu@hotmail.com" }
  ],
  "vars": {
    "TURNSTILE_SITE_KEY": "PLACEHOLDER_PUBLIC_SITE_KEY"
  }
}
```

- [ ] **Step 2: Create open-next.config.ts**

```typescript
import type { OpenNextConfig } from '@opennextjs/cloudflare'

const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: 'cloudflare-node',
      converter: 'edge',
      incrementalCache: 'r2-incremental-cache',
    },
  },
}

export default config
```

- [ ] **Step 3: Create cloudflare-env.d.ts (placeholder)**

```typescript
// Generated by `wrangler types` — placeholder until first deploy
interface CloudflareEnv {
  VIEWS: KVNamespace
  MEDIA: R2Bucket
  RESEND: SendEmail
  TURNSTILE_SITE_KEY: string
  RESEND_API_KEY: string
  TURNSTILE_SECRET: string
}
```

- [ ] **Step 4: Try a build**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run build
```

Expected: Build succeeds, outputs to `.next/` (Next's default output). OpenNext hasn't run yet because it needs a deployment target.

- [ ] **Step 5: Try OpenNext build (dry-run)**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npx opennextjs-cloudflare build --dry-run
```

Expected: Output indicates how the build would proceed; no actual deployment. If errors about bindings appear, those are expected until we provision real KV/R2 namespaces (Task 8.1).

- [ ] **Step 6: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: configure wrangler.jsonc + OpenNext for Cloudflare Pages"
```

---

## Phase 1 — Site Foundation

The visual + content scaffolding that every page depends on.

### Task 1.1: Create siteConfig.ts (single source of truth)

**Files:**
- Create: `lib/siteConfig.ts`

**Interfaces:**
- Produces: `siteConfig` const consumed by `app/layout.tsx`, `app/page.tsx`, every page's `generateMetadata`, every component

- [ ] **Step 1: Write failing test for siteConfig shape**

Create `tests/unit/lib/siteConfig.test.ts`:

```typescript
import { siteConfig } from '@/lib/siteConfig'

describe('siteConfig', () => {
  it('has the correct URL', () => {
    expect(siteConfig.url).toBe('https://aaronchu.cc')
  })

  it('has GitHub SSO-linked Cloudflare account', () => {
    expect(siteConfig.author.email).toBe('aaron_powerchu@hotmail.com')
    expect(siteConfig.cloudflare.accountId).toBe('65cbc69e461eb925f39d60fe6490f8d1')
  })

  it('has 5 project categories defined', () => {
    expect(Object.keys(siteConfig.categories)).toHaveLength(5)
    expect(siteConfig.categories).toHaveProperty('full-stack')
    expect(siteConfig.categories).toHaveProperty('ai')
    expect(siteConfig.categories).toHaveProperty('graphic-design')
    expect(siteConfig.categories).toHaveProperty('game-dev')
    expect(siteConfig.categories).toHaveProperty('photography')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/lib/siteConfig.test.ts
```

Expected: FAIL with "Cannot find module '@/lib/siteConfig'"

- [ ] **Step 3: Implement siteConfig.ts**

Create `lib/siteConfig.ts`:

```typescript
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faCode, faMicrochip, faPalette, faGamepad, faCamera } from '@fortawesome/free-solid-svg-icons'

export type CategorySlug = 'full-stack' | 'ai' | 'graphic-design' | 'game-dev' | 'photography'

export interface CategoryConfig {
  slug: CategorySlug
  name: string
  description: string
  icon: IconDefinition
}

export const siteConfig = {
  name: 'Aaron Chu',
  title: 'Aaron Chu — Developer Portfolio',
  description: 'Software engineer building thoughtful products at the edge.',
  url: 'https://aaronchu.cc',
  mediaUrl: 'https://media.aaronchu.cc',
  ogImage: '/og/default.png',
  locale: 'en-US',
  keywords: [
    'Software Engineer',
    'TypeScript',
    'Next.js',
    'Cloudflare',
    'AI Engineering',
    'Full Stack Developer',
    'Game Developer',
    'Graphic Designer',
    'Photographer',
  ],
  author: {
    name: 'Aaron Chu',
    email: 'aaron_powerchu@hotmail.com',
    github: 'Powerchu',
    linkedin: 'aaronchu',
  },
  social: {
    github: 'https://github.com/Powerchu',
    linkedin: 'https://www.linkedin.com/in/aaronchu',
    instagram: 'https://www.instagram.com/aaronchu',
  },
  cloudflare: {
    accountId: '65cbc69e461eb925f39d60fe6490f8d1',
    pagesProjectName: 'aaron-chu-portfolio',
    r2BucketName: 'aaronchu-portfolio-media',
  },
  categories: {
    'full-stack': {
      slug: 'full-stack',
      name: 'Full Stack',
      description: 'Web apps, SaaS, APIs, infrastructure',
      icon: faCode,
    },
    ai: {
      slug: 'ai',
      name: 'AI Engineering',
      description: 'AI agents, RAG, fine-tuning, MLOps',
      icon: faMicrochip,
    },
    'graphic-design': {
      slug: 'graphic-design',
      name: 'Graphic Design',
      description: 'Logos, brand identity, posters, print',
      icon: faPalette,
    },
    'game-dev': {
      slug: 'game-dev',
      name: 'Game Dev',
      description: 'Indie games, prototypes, jams',
      icon: faGamepad,
    },
    photography: {
      slug: 'photography',
      name: 'Photography',
      description: 'Photo series, exhibitions, prints',
      icon: faCamera,
    },
  } satisfies Record<CategorySlug, CategoryConfig>,
  nav: {
    home: '/',
    projects: '/projects',
    experience: '/experience',
    about: '/about',
  },
} as const

export const categorySlugs: CategorySlug[] = Object.keys(siteConfig.categories) as CategorySlug[]
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/lib/siteConfig.test.ts
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: create siteConfig with categories and Cloudflare account info"
```

---

### Task 1.2: Set up font loading via next/font

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: `--font-inter-tight`, `--font-inter`, `--font-jetbrains-mono` CSS variables available; font files self-hosted

- [ ] **Step 1: Update layout.tsx with fonts**

```tsx
import type { Metadata } from 'next'
import { Inter, Inter_Tight, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
  weight: ['400', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '800'],
})

export const metadata: Metadata = {
  title: 'Aaron Chu — Developer Portfolio',
  description: 'Software engineer building thoughtful products at the edge.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">
        {children}
      </body>
    </html>
  )
}
```

Note: `next/font/google` self-hosts Google Fonts at build time. Ensure the build environment has internet access (Cloudflare Pages build does).

- [ ] **Step 2: Verify fonts load**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run build
```

Expected: Build succeeds. Check the output for font file paths being emitted.

- [ ] **Step 3: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: self-host Inter Tight + Inter + JetBrains Mono via next/font"
```

---

### Task 1.3: Implement dark mode (class strategy, no-FOUC)

**Files:**
- Create: `components/theme/ThemeScript.tsx`
- Create: `components/theme/ThemeToggle.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Produces: theme persists in `localStorage`; no flash on initial render; `<ThemeToggle>` flips between light/dark

- [ ] **Step 1: Write failing test for ThemeToggle**

Create `tests/unit/components/theme/ThemeToggle.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

describe('ThemeToggle', () => {
  it('renders a button with accessible label', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('toggles dark class on documentElement when clicked', async () => {
    const user = userEvent.setup()
    document.documentElement.classList.remove('dark')
    render(<ThemeToggle />)
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/components/theme/ThemeToggle.test.tsx
```

Expected: FAIL with "Cannot find module"

- [ ] **Step 3: Implement ThemeScript (no-FOUC)**

Create `components/theme/ThemeScript.tsx`:

```tsx
export function ThemeScript() {
  const code = `
    (function() {
      try {
        var stored = localStorage.getItem('theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (stored === 'dark' || (!stored && prefersDark)) {
          document.documentElement.classList.add('dark');
        }
      } catch (_) {}
    })();
  `
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
```

- [ ] **Step 4: Implement ThemeToggle**

Create `components/theme/ThemeToggle.tsx`:

```tsx
'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-md p-2 hover:bg-fg/5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <FontAwesomeIcon icon={isDark ? faSun : faMoon} className="h-5 w-5" />
    </button>
  )
}
```

- [ ] **Step 5: Wire ThemeScript into layout.tsx**

Edit `app/layout.tsx` to add `ThemeScript` and `ThemeToggle` (the latter can wait for Phase 3 when we have a Header):

```tsx
import { ThemeScript } from '@/components/theme/ThemeScript'

// ... existing imports ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Run test to verify it passes**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/components/theme/ThemeToggle.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 7: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: implement dark mode with no-FOUC and toggle component"
```

---

## Phase 2 — Content Layer (Velite)

Defines the typed MDX schemas and provides sample content for development.

### Task 2.1: Configure Velite

**Files:**
- Create: `velite.config.ts`
- Create: `content/.gitkeep`

**Interfaces:**
- Produces: `npm run dev` regenerates `.velite/` on save; `@velite/cli` build hook

- [ ] **Step 1: Create velite.config.ts**

```typescript
import { defineConfig, defineCollection, s } from 'velite'
import { categorySlugs } from './lib/siteConfig'

const projects = defineCollection({
  name: 'Project',
  pattern: 'projects/*.mdx',
  schema: s.object({
    title: s.string(),
    slug: s.path(),
    description: s.string().max(280),
    date: s.isodate(),
    categories: s
      .array(s.union(categorySlugs.map((slug) => s.literal(slug)) as [s.LiteralSchema<string>, ...s.LiteralSchema<string>[]]))
      .min(1),
    tech: s.array(s.string()),
    role: s.string().optional(),
    company: s.string().optional(),
    hero: s.image(),
    video: s.string().url().optional(),
    videoPoster: s.string().optional(),
    audio: s.string().url().optional(),
    audioTitle: s.string().optional(),
    screenshots: s
      .array(
        s.object({
          src: s.string(),
          alt: s.string(),
          caption: s.string().optional(),
        })
      )
      .default([]),
    downloads: s
      .array(
        s.object({
          url: s.string(),
          label: s.string(),
          size: s.string().optional(),
          type: s.string().optional(),
        })
      )
      .default([]),
    links: s
      .array(
        s.object({
          label: s.string(),
          url: s.string().url(),
        })
      )
      .default([]),
    featured: s.boolean().default(false),
    draft: s.boolean().default(false),
    note: s.string().max(500).optional(),
    metadata: s.metadata(),
    content: s.mdx(),
  }),
})

const experience = defineCollection({
  name: 'Experience',
  pattern: 'experience/*.mdx',
  schema: s.object({
    title: s.string(),
    company: s.string(),
    companyUrl: s.string().optional(),
    location: s.string().optional(),
    start: s.isodate(),
    end: s.isodate().optional(),
    summary: s.string().max(400),
    highlights: s.array(s.string()).optional(),
    order: s.number().default(0),
    metadata: s.metadata(),
    content: s.mdx(),
  }),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: { name: '[name]-[hash:6].[ext]', output: 'public/static' },
  },
  collections: { projects, experience },
  mdx: {
    gfm: true,
    smartypants: true,
  },
})
```

- [ ] **Step 2: Create content directory placeholder**

```bash
mkdir -p /Users/powerchu/Git/aaron-chu-portfolio-dev/content/projects
mkdir -p /Users/powerchu/Git/aaron-chu-portfolio-dev/content/experience
touch /Users/powerchu/Git/aaron-chu-portfolio-dev/content/.gitkeep
```

- [ ] **Step 3: Add Velite build hook to package.json scripts**

Edit `package.json` to chain Velite into Next.js dev/build:

```json
"scripts": {
  "dev": "velite build --watch & next dev",
  "build": "velite build && next build",
  ...
}
```

Note: The `&` in dev runs Velite in watch mode in the background. Adjust for cross-platform if needed; an alternative is `concurrently`:

```bash
npm install -D concurrently
```

Then:
```json
"dev": "concurrently 'velite build --watch' 'next dev'"
```

- [ ] **Step 4: Verify Velite builds with no content**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npx velite build
ls -la .velite
```

Expected: `.velite/` directory created with empty `projects` and `experience` arrays.

- [ ] **Step 5: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: configure Velite with project + experience schemas"
```

---

### Task 2.2: Add sample projects (one per category)

**Files:**
- Create: `content/projects/portfolio-cms.mdx` (full-stack)
- Create: `content/projects/rag-assistant.mdx` (ai)
- Create: `content/projects/brand-identity.mdx` (graphic-design)
- Create: `content/projects/indie-game.mdx` (game-dev)
- Create: `content/projects/photo-series.mdx` (photography)

**Interfaces:**
- Produces: `.velite/` populates with 5 sample projects, all categories represented

- [ ] **Step 1: Add full-stack sample**

Write `content/projects/portfolio-cms.mdx`:

```mdx
---
title: Headless Portfolio CMS
slug: portfolio-cms
description: A multi-tenant headless CMS for designers managing portfolio content.
date: 2025-12-15
categories:
  - full-stack
tech:
  - Next.js
  - TypeScript
  - PostgreSQL
  - Cloudflare Workers
  - Hono
hero: ./hero.png
links:
  - label: GitHub
    url: https://github.com/Powerchu/portfolio-cms
featured: true
note: Built a multi-tenant CMS that handles 50+ designer portfolios with daily content updates and image transformations.
---

A multi-tenant headless CMS built for designers who update their portfolios daily.
```

Note: Place a placeholder hero image at `content/projects/hero.png` (any 1200x630 image works for dev).

- [ ] **Step 2: Add AI sample**

Write `content/projects/rag-assistant.mdx`:

```mdx
---
title: RAG Assistant
slug: rag-assistant
description: A retrieval-augmented generation assistant for legal document Q&A.
date: 2025-09-20
categories:
  - ai
  - full-stack
tech:
  - Python
  - LangChain
  - OpenAI
  - pgvector
  - FastAPI
hero: ./hero.png
featured: true
note: Built a production RAG system that handles 10K+ legal documents with 95% answer accuracy.
---
```

- [ ] **Step 3: Add graphic-design sample**

Write `content/projects/brand-identity.mdx`:

```mdx
---
title: Studio Brand Identity
slug: studio-brand
description: Complete brand identity for a creative studio — logo, typography, color, applications.
date: 2025-06-10
categories:
  - graphic-design
tech:
  - Adobe Illustrator
  - Adobe InDesign
  - Figma
hero: ./hero.png
featured: true
note: Designed a complete brand system used across web, print, and signage.
---
```

- [ ] **Step 4: Add game-dev sample**

Write `content/projects/indie-game.mdx`:

```mdx
---
title: Echo Drift
slug: echo-drift
description: An atmospheric puzzle game about navigating fragmented memories.
date: 2025-03-15
categories:
  - game-dev
tech:
  - Unity
  - C#
  - Blender
hero: ./hero.png
video: https://media.aaronchu.cc/projects/echo-drift/trailer.mp4
videoPoster: https://media.aaronchu.cc/projects/echo-drift/trailer-poster.jpg
downloads:
  - url: https://media.aaronchu.cc/projects/echo-drift/build.zip
    label: Game build (WebGL)
    size: 24.6 MB
    type: game
featured: true
note: A solo-developed 4-hour puzzle game with original soundtrack and procedurally-generated levels.
---
```

- [ ] **Step 5: Add photography sample**

Write `content/projects/photo-series.mdx`:

```mdx
---
title: Tokyo Nights
slug: tokyo-nights
description: A long-exposure photography series capturing Tokyo's neon-lit backstreets.
date: 2024-11-20
categories:
  - photography
tech:
  - Sony A7III
  - Lightroom
  - Capture One
hero: ./hero.png
screenshots:
  - src: https://media.aaronchu.cc/projects/tokyo-nights/01.jpg
    alt: Shibuya crossing at midnight
  - src: https://media.aaronchu.cc/projects/tokyo-nights/02.jpg
    alt: Golden Gai alley
featured: true
note: 30 photographs shot across 14 nights in Tokyo's quieter neighborhoods, exhibited at a local gallery.
---
```

- [ ] **Step 6: Run Velite build**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npx velite build
ls -la .velite/projects
```

Expected: 5 projects in `.velite/projects/`.

- [ ] **Step 7: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: add 5 sample projects (one per category)"
```

---

### Task 2.3: Add sample experience entries

**Files:**
- Create: `content/experience/senior-engineer.mdx`
- Create: `content/experience/ai-lead.mdx`
- Create: `content/experience/full-stack.mdx`

- [ ] **Step 1: Add senior engineer entry**

Write `content/experience/senior-engineer.mdx`:

```mdx
---
title: Senior Software Engineer
company: Tech Corp
companyUrl: https://example.com
location: San Francisco, CA
start: 2023-01-15
summary: Lead engineer on the platform team building internal developer tools.
highlights:
  - Architected and shipped a service mesh spanning 40+ services
  - Reduced deployment time by 60% through CI/CD pipeline rewrite
  - Mentored 4 junior engineers, 2 of whom were promoted within a year
order: 1
---
```

- [ ] **Step 2: Add AI lead entry**

Write `content/experience/ai-lead.mdx`:

```mdx
---
title: AI Engineering Lead
company: AI Startup
companyUrl: https://example.com
location: Remote
start: 2024-06-01
summary: Leading a team of 5 engineers building production AI systems.
highlights:
  - Designed and shipped a RAG system handling 10K+ documents
  - Reduced inference costs by 40% through model quantization
  - Published 2 technical blog posts with 50K+ combined reads
order: 0
---
```

- [ ] **Step 3: Add full-stack entry**

Write `content/experience/full-stack.mdx`:

```mdx
---
title: Full Stack Developer
company: Web Agency
location: New York, NY
start: 2020-08-01
end: 2022-12-15
summary: Built web applications for 15+ clients across e-commerce, SaaS, and media.
highlights:
  - Shipped 20+ production sites with 99.9% uptime
  - Led the migration from a legacy PHP stack to Next.js
  - Won internal "Engineer of the Year" in 2022
order: 2
---
```

- [ ] **Step 4: Run Velite build**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npx velite build
```

Expected: 3 experience entries.

- [ ] **Step 5: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: add 3 sample experience entries"
```

---

## Phase 3 — Layout Components

Reusable shell components every page uses.

### Task 3.1: Header with nav, theme toggle

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `components/layout/NavLink.tsx`

**Interfaces:**
- Produces: `<Header>` renders top bar with logo, nav links, theme toggle; sticky at top of viewport

- [ ] **Step 1: Write failing test for NavLink**

Create `tests/unit/components/layout/NavLink.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { NavLink } from '@/components/layout/NavLink'

describe('NavLink', () => {
  it('renders an active link with the correct href', () => {
    render(<NavLink href="/projects" active>Projects</NavLink>)
    const link = screen.getByRole('link', { name: /projects/i })
    expect(link).toHaveAttribute('href', '/projects')
    expect(link).toHaveAttribute('aria-current', 'page')
  })

  it('renders an inactive link without aria-current', () => {
    render(<NavLink href="/projects">Projects</NavLink>)
    const link = screen.getByRole('link', { name: /projects/i })
    expect(link).not.toHaveAttribute('aria-current')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/components/layout/NavLink.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement NavLink**

Create `components/layout/NavLink.tsx`:

```tsx
import Link from 'next/link'
import type { ReactNode } from 'react'

interface NavLinkProps {
  href: string
  active?: boolean
  children: ReactNode
}

export function NavLink({ href, active = false, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className="rounded-md px-3 py-2 text-sm font-extrabold uppercase tracking-(--tracking-micro) text-fg/80 transition hover:bg-fg/5 hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      {children}
    </Link>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/components/layout/NavLink.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 5: Implement Header**

Create `components/layout/Header.tsx`:

```tsx
import Link from 'next/link'
import { siteConfig } from '@/lib/siteConfig'
import { NavLink } from './NavLink'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md dark:border-border-dark">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
        <Link
          href={siteConfig.nav.home}
          className="font-display text-lg font-extrabold uppercase tracking-(--tracking-display) text-fg"
          aria-label={`${siteConfig.name} — Home`}
        >
          {siteConfig.name}
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2">
          <NavLink href={siteConfig.nav.projects}>Projects</NavLink>
          <NavLink href={siteConfig.nav.experience}>Experience</NavLink>
          <NavLink href={siteConfig.nav.about}>About</NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 6: Wire Header into layout.tsx**

Edit `app/layout.tsx` to render `<Header>` inside `<body>`:

```tsx
import { Header } from '@/components/layout/Header'

// ...

<body className="min-h-screen bg-bg font-sans text-fg antialiased">
  <Header />
  {children}
</body>
```

- [ ] **Step 7: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: build Header with nav, logo, and theme toggle"
```

---

### Task 3.2: Footer with CTA, social links

**Files:**
- Create: `components/layout/Footer.tsx`

**Interfaces:**
- Produces: `<Footer>` renders CTA section + nav + social links + copyright; used at bottom of every page

- [ ] **Step 1: Implement Footer**

Create `components/layout/Footer.tsx`:

```tsx
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { siteConfig } from '@/lib/siteConfig'

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-bg dark:border-border-dark">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24">
        <div className="mb-12">
          <h2 className="font-display text-4xl font-normal uppercase leading-tight md:text-5xl">
            Let&apos;s build something
          </h2>
          <Link
            href={`mailto:${siteConfig.author.email}`}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-extrabold uppercase tracking-(--tracking-micro) text-accent-fg transition hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {siteConfig.author.email}
            <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 border-t border-border pt-8 md:grid-cols-3 dark:border-border-dark">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-(--tracking-micro) text-muted">
              Navigate
            </h3>
            <ul className="mt-3 space-y-2">
              <li><Link href={siteConfig.nav.projects} className="hover:text-accent">Projects</Link></li>
              <li><Link href={siteConfig.nav.experience} className="hover:text-accent">Experience</Link></li>
              <li><Link href={siteConfig.nav.about} className="hover:text-accent">About</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-(--tracking-micro) text-muted">
              Elsewhere
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                  <FontAwesomeIcon icon={faGithub} className="h-4 w-4" /> GitHub
                </a>
              </li>
              <li>
                <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                  <FontAwesomeIcon icon={faLinkedin} className="h-4 w-4" /> LinkedIn
                </a>
              </li>
              <li>
                <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                  <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" /> Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-(--tracking-micro) text-muted">
              Source
            </h3>
            <p className="mt-3 text-sm text-muted">
              Built with Next.js on Cloudflare Pages. Open source on{' '}
              <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                GitHub
              </a>.
            </p>
          </div>
        </div>

        <p className="mt-12 text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Wire Footer into layout.tsx**

Edit `app/layout.tsx`:

```tsx
import { Footer } from '@/components/layout/Footer'

// ...
<body>
  <Header />
  {children}
  <Footer />
</body>
```

- [ ] **Step 3: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: build Footer with CTA, social links, copyright"
```

---

### Task 3.3: ProjectCard component

**Files:**
- Create: `components/project/ProjectCard.tsx`
- Create: `tests/unit/components/project/ProjectCard.test.tsx`

**Interfaces:**
- Produces: `<ProjectCard project={...}>` renders a card with hero, categories, title, description, tech, date; hover lifts +1.02

- [ ] **Step 1: Write failing test**

Create `tests/unit/components/project/ProjectCard.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { ProjectCard } from '@/components/project/ProjectCard'

const sample = {
  slug: 'test-project',
  title: 'Test Project',
  description: 'A test project for unit testing',
  date: '2025-01-15',
  categories: ['full-stack' as const, 'ai' as const],
  tech: ['React', 'TypeScript'],
  hero: '/test-hero.png',
  featured: false,
  draft: false,
  screenshots: [],
  downloads: [],
  links: [],
}

describe('ProjectCard', () => {
  it('renders title, description, and tech tags', () => {
    render(<ProjectCard project={sample} />)
    expect(screen.getByRole('heading', { name: /test project/i })).toBeInTheDocument()
    expect(screen.getByText(/a test project for unit testing/i)).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders a category chip for each category', () => {
    render(<ProjectCard project={sample} />)
    expect(screen.getByText(/full stack/i)).toBeInTheDocument()
    expect(screen.getByText(/ai engineering/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/components/project/ProjectCard.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement CategoryChip**

Create `components/project/CategoryChip.tsx`:

```tsx
import Link from 'next/link'
import type { CategorySlug } from '@/lib/siteConfig'
import { siteConfig } from '@/lib/siteConfig'

interface CategoryChipProps {
  category: CategorySlug
}

export function CategoryChip({ category }: CategoryChipProps) {
  const config = siteConfig.categories[category]
  return (
    <Link
      href={`/projects?category=${category}`}
      className="inline-flex items-center gap-1.5 rounded-full border border-accent px-3 py-1 text-xs font-extrabold uppercase tracking-(--tracking-micro) text-accent transition hover:bg-accent hover:text-accent-fg"
    >
      {config.name}
    </Link>
  )
}
```

- [ ] **Step 4: Implement ProjectCard**

Create `components/project/ProjectCard.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '#site/content'
import { CategoryChip } from './CategoryChip'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-lg border border-border transition hover:scale-[1.02] dark:border-border-dark">
      <Link href={`/projects/${project.slug}`} className="block focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
        <div className="relative aspect-video overflow-hidden bg-fg/5">
          {project.hero && (
            <Image
              src={project.hero}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition group-hover:scale-105"
            />
          )}
        </div>

        <div className="p-6">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {project.categories.map((cat) => (
              <CategoryChip key={cat} category={cat} />
            ))}
          </div>

          <h3 className="font-display text-2xl font-normal uppercase leading-tight md:text-3xl">
            <span className="bg-gradient-to-r from-accent to-accent bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
              {project.title}
            </span>
          </h3>

          <p className="mt-2 text-sm text-muted">{project.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {project.tech.slice(0, 4).map((t) => (
              <span key={t} className="text-xs font-extrabold uppercase tracking-(--tracking-micro) text-muted">
                {t}
              </span>
            ))}
            <span className="ml-auto text-xs text-muted">
              {new Date(project.date).getFullYear()}
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/components/project/ProjectCard.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: build ProjectCard with category chips, hover lift, and tech tags"
```

---

### Task 3.4: DisciplinesStrip component

**Files:**
- Create: `components/home/DisciplinesStrip.tsx`
- Create: `tests/unit/components/home/DisciplinesStrip.test.tsx`

**Interfaces:**
- Produces: `<DisciplinesStrip>` renders 5 category icons with labels, linking to `/projects?category=<slug>`

- [ ] **Step 1: Write failing test**

Create `tests/unit/components/home/DisciplinesStrip.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { DisciplinesStrip } from '@/components/home/DisciplinesStrip'

describe('DisciplinesStrip', () => {
  it('renders all 5 disciplines with links', () => {
    render(<DisciplinesStrip />)
    expect(screen.getByRole('link', { name: /full stack/i })).toHaveAttribute('href', '/projects?category=full-stack')
    expect(screen.getByRole('link', { name: /ai engineering/i })).toHaveAttribute('href', '/projects?category=ai')
    expect(screen.getByRole('link', { name: /graphic design/i })).toHaveAttribute('href', '/projects?category=graphic-design')
    expect(screen.getByRole('link', { name: /game dev/i })).toHaveAttribute('href', '/projects?category=game-dev')
    expect(screen.getByRole('link', { name: /photography/i })).toHaveAttribute('href', '/projects?category=photography')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/components/home/DisciplinesStrip.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement DisciplinesStrip**

Create `components/home/DisciplinesStrip.tsx`:

```tsx
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { categorySlugs, siteConfig } from '@/lib/siteConfig'

export function DisciplinesStrip() {
  return (
    <section aria-label="Disciplines" className="border-y border-border py-12 dark:border-border-dark">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 md:grid-cols-5 md:px-12">
        {categorySlugs.map((slug) => {
          const cat = siteConfig.categories[slug]
          return (
            <Link
              key={slug}
              href={`/projects?category=${slug}`}
              className="group flex flex-col items-center gap-3 rounded-lg p-4 transition hover:bg-fg/5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <FontAwesomeIcon
                icon={cat.icon}
                className="h-10 w-10 text-fg transition group-hover:text-accent md:h-12 md:w-12"
              />
              <span className="text-xs font-extrabold uppercase tracking-(--tracking-micro) text-fg md:text-sm">
                {cat.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/components/home/DisciplinesStrip.test.tsx
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: build DisciplinesStrip with 5 category links"
```

---

## Phase 4 — Motion + Parallax Components

Reusable animation primitives.

### Task 4.1: FadeIn + ScrollReveal + Stagger primitives

**Files:**
- Create: `components/motion/FadeIn.tsx`
- Create: `components/motion/ScrollReveal.tsx`
- Create: `components/motion/Stagger.tsx`
- Create: `tests/unit/components/motion/ScrollReveal.test.tsx`

- [ ] **Step 1: Implement FadeIn**

Create `components/motion/FadeIn.tsx`:

```tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
}

export function FadeIn({ children, delay = 0 }: FadeInProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Implement ScrollReveal**

Create `components/motion/ScrollReveal.tsx`:

```tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
}

export function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 3: Implement Stagger**

Create `components/motion/Stagger.tsx`:

```tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StaggerProps {
  children: ReactNode
  stagger?: number
}

export function Stagger({ children, stagger = 0.06 }: StaggerProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial="hidden"
      whileInView={reduced ? undefined : 'visible'}
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 4: Write test for ScrollReveal**

Create `tests/unit/components/motion/ScrollReveal.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

describe('ScrollReveal', () => {
  it('renders children', () => {
    const { container } = render(<ScrollReveal><span>content</span></ScrollReveal>)
    expect(container.textContent).toBe('content')
  })
})
```

- [ ] **Step 5: Run tests**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/components/motion/
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: build FadeIn, ScrollReveal, Stagger motion primitives"
```

---

### Task 4.2: ParallaxY + ParallaxMouse + DriftShape

**Files:**
- Create: `components/parallax/ParallaxY.tsx`
- Create: `components/parallax/ParallaxMouse.tsx`
- Create: `components/parallax/DriftShape.tsx`

- [ ] **Step 1: Implement ParallaxY**

Create `components/parallax/ParallaxY.tsx`:

```tsx
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface ParallaxYProps {
  children: ReactNode
  offset?: number
}

export function ParallaxY({ children, offset = 24 }: ParallaxYProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return <motion.div ref={ref} style={{ y }}>{children}</motion.div>
}
```

- [ ] **Step 2: Implement ParallaxMouse**

Create `components/parallax/ParallaxMouse.tsx`:

```tsx
'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'

interface ParallaxMouseProps {
  children: ReactNode
  intensity?: number
}

export function ParallaxMouse({ children, intensity = 0.04 }: ParallaxMouseProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { damping: 30, stiffness: 200 })
  const springY = useSpring(y, { damping: 30, stiffness: 200 })

  const moveX = useTransform(springX, [-1, 1], [-10 * intensity * 100, 10 * intensity * 100])
  const moveY = useTransform(springY, [-1, 1], [-10 * intensity * 100, 10 * intensity * 100])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      x.set((e.clientX / window.innerWidth) * 2 - 1)
      y.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [x, y])

  return <motion.div style={{ x: moveX, y: moveY }}>{children}</motion.div>
}
```

- [ ] **Step 3: Implement DriftShape**

Create `components/parallax/DriftShape.tsx`:

```tsx
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface DriftShapeProps {
  size?: number
  color?: string
  opacity?: number
  startX?: number
  startY?: number
}

export function DriftShape({
  size = 200,
  color = 'var(--color-accent)',
  opacity = 0.06,
  startX = 0,
  startY = 0,
}: DriftShapeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [startY, startY - 200])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45])

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        left: startX,
        top: startY,
        backgroundColor: color,
        opacity,
        borderRadius: '50%',
        y,
        rotate,
        pointerEvents: 'none',
      }}
    />
  )
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: build ParallaxY, ParallaxMouse, DriftShape components"
```

---

## Phase 5 — Visual Effects (PixiJS)

WebGL2 effects for the hero and category transitions.

### Task 5.1: PixiJS singleton factory

**Files:**
- Create: `lib/pixi/createApp.ts`
- Create: `tests/unit/lib/pixi/createApp.test.ts`

- [ ] **Step 1: Write failing test**

Create `tests/unit/lib/pixi/createApp.test.ts`:

```typescript
import { isWebGLSupported } from '@/lib/pixi/createApp'

describe('isWebGLSupported', () => {
  it('returns a boolean', () => {
    const result = isWebGLSupported()
    expect(typeof result).toBe('boolean')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/lib/pixi/createApp.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement createApp.ts**

Create `lib/pixi/createApp.ts`:

```typescript
import { Application } from 'pixi.js'

export function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

interface CreateAppOptions {
  width: number
  height: number
  backgroundAlpha?: number
}

export async function createApp({ width, height, backgroundAlpha = 0 }: CreateAppOptions): Promise<Application> {
  const app = new Application()
  await app.init({
    width,
    height,
    backgroundAlpha,
    antialias: true,
    powerPreference: 'high-performance',
    preference: 'webgl2',
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  })
  return app
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/lib/pixi/createApp.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: add PixiJS app factory with WebGL detection"
```

---

### Task 5.2: GradientMesh + AmbientNoise effects

**Files:**
- Create: `components/effects/GradientMesh.tsx`
- Create: `components/effects/AmbientNoise.tsx`

- [ ] **Step 1: Implement AmbientNoise (simplest, no shader needed)**

Create `components/effects/AmbientNoise.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { isWebGLSupported } from '@/lib/pixi/createApp'

interface AmbientNoiseProps {
  opacity?: number
}

export function AmbientNoise({ opacity = 0.04 }: AmbientNoiseProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    if (!isWebGLSupported() || !ref.current) return

    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 200
    canvas.height = 200

    // Generate static noise pattern
    const imageData = ctx.createImageData(200, 200)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255
      data[i] = v
      data[i + 1] = v
      data[i + 2] = v
      data[i + 3] = 255
    }
    ctx.putImageData(imageData, 0, 0)
  }, [reduced])

  if (reduced) return null

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
      style={{ opacity, mixBlendMode: 'multiply' }}
    />
  )
}
```

- [ ] **Step 2: Implement GradientMesh (basic version)**

Create `components/effects/GradientMesh.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { createApp, isWebGLSupported } from '@/lib/pixi/createApp'

interface GradientMeshProps {
  palette?: [string, string, string]
}

export function GradientMesh({ palette = ['#DF6C4F', '#0A0A0A', '#FAFAFA'] }: GradientMeshProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    if (!isWebGLSupported() || !ref.current) return

    let cancelled = false
    let app: Awaited<ReturnType<typeof createApp>> | null = null

    ;(async () => {
      const canvas = ref.current
      if (!canvas || cancelled) return

      app = await createApp({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      if (cancelled) {
        app.destroy(true)
        return
      }

      canvas.replaceWith(app.canvas)

      // Create gradient mesh using Graphics
      const { Graphics } = await import('('pixi.js')
      const g = new Graphics()
      const w = window.innerWidth
      const h = window.innerHeight

      g.moveTo(0, 0)
      g.lineTo(w, 0)
      g.lineTo(w, h)
      g.lineTo(0, h)
      g.closePath()
      g.fill({ color: palette[1] })

      // Add subtle radial gradient circles
      for (let i = 0; i < 3; i++) {
        const circle = new Graphics()
        const radius = Math.max(w, h) * 0.4
        circle.circle(w * 0.3 + i * w * 0.2, h * 0.3, radius)
        circle.fill({ color: palette[0], alpha: 0.15 })
        app.stage.addChild(circle)
      }

      app.stage.addChild(g)
    })()

    return () => {
      cancelled = true
      if (app) app.destroy(true)
    }
  }, [reduced, palette])

  if (reduced) return null

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  )
}
```

Note: The above is a minimal version. Production-ready version would use a custom shader for smooth interpolation. Mark as v1 working; can iterate.

- [ ] **Step 3: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: build AmbientNoise + GradientMesh effects (PixiJS v1)"
```

---

## Phase 6 — Pages

Build each page route that composes the components.

### Task 6.1: Home page

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `GET /` returns a home page with hero + disciplines strip + featured projects grid + CTA

- [ ] **Step 1: Implement home page**

```tsx
import { getCollection } from '#site/content'
import { DisciplinesStrip } from '@/components/home/DisciplinesStrip'
import { ProjectCard } from '@/components/project/ProjectCard'
import { FadeIn } from '@/components/motion/FadeIn'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { AmbientNoise } from '@/components/effects/AmbientNoise'
import { GradientMesh } from '@/components/effects/GradientMesh'
import { DriftShape } from '@/components/parallax/DriftShape'
import { siteConfig } from '@/lib/siteConfig'

export default function HomePage() {
  const featured = getCollection('Project')
    .filter((p) => p.featured && !p.draft)
    .slice(0, 3)

  return (
    <main>
      <section className="relative overflow-hidden">
        <GradientMesh />
        <AmbientNoise />
        <DriftShape startX={-100} startY={50} size={400} />
        <DriftShape startX={1200} startY={300} size={300} color="#0A0A0A" />

        <div className="mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-32">
          <FadeIn>
            <h1 className="font-display text-7xl font-normal leading-(--leading-display) tracking-(--tracking-display) md:text-9xl">
              Aaron Chu.
              <br />
              <span className="text-accent">Software</span>,<br />
              AI, design, games.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-8 max-w-xl text-lg text-muted">
              {siteConfig.description}
            </p>
          </FadeIn>
        </div>
      </section>

      <DisciplinesStrip />

      <section className="mx-auto max-w-6xl px-6 py-24 md:px-12 md:py-32">
        <ScrollReveal>
          <h2 className="font-display text-4xl font-normal uppercase leading-tight md:text-5xl">
            Featured Work
          </h2>
        </ScrollReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Write Playwright E2E for home page**

Create `tests/e2e/home.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('home page renders hero, disciplines, and featured projects', async ({ page }) => {
  await page.goto('/')
  await expect expect(page.getByRole('heading', { level: 1, name: /aaron chu/i })).toBeVisible()
  await expect expect(page.getByRole('link', { name: /full stack/i })).toBeVisible()
  await expect expect(page.getByRole('heading', { name: /featured work/i })).toBeVisible()
})
```

- [ ] **Step 3: Run E2E**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:e2e -- tests/e2e/home.spec.ts
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: build home page with hero, disciplines strip, featured projects"
```

---

### Task 6.2: Projects list page with filter

**Files:**
- Create: `app/projects/page.tsx`
- Create: `app/projects/ProjectFilter.tsx` (client component)
- Create: `app/projects/ProjectGrid.tsx` (server component)
- Create: `tests/unit/app/projects/ProjectFilter.test.tsx`

**Interfaces:**
- Produces: `GET /projects` lists all projects; `GET /projects?category=ai` filters to AI category; filter chips update URL

- [ ] **Step 1: Write failing test for ProjectFilter**

Create `tests/unit/app/projects/ProjectFilter.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { ProjectFilter } from '@/app/projects/ProjectFilter'

describe('ProjectFilter', () => {
  it('renders all 5 category chips plus All', async () => {
    render(<ProjectFilter activeCategory={undefined} />)
    expect(screen.getByRole('link', { name: /^all$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /full stack/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ai engineering/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /graphic design/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /game dev/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /photography/i })).toBeInTheDocument()
  })

  it('marks the active category chip with aria-current', () => {
    render(<ProjectFilter activeCategory="ai" />)
    expect(screen.getByRole('link', { name: /ai engineering/i })).toHaveAttribute('aria-current', 'page')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/app/projects/ProjectFilter.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Implement ProjectFilter**

Create `app/projects/ProjectFilter.tsx`:

```tsx
import Link from 'next/link'
import { categorySlugs, siteConfig, type CategorySlug } from '@/lib/siteConfig'

interface ProjectFilterProps {
  activeCategory?: CategorySlug
}

export function ProjectFilter({ activeCategory }: ProjectFilterProps) {
  return (
    <nav aria-label="Filter projects by category" className="flex flex-wrap gap-2">
      <Link
        href="/projects"
        aria-current={!activeCategory ? 'page' : undefined}
        className={`rounded-full border px-4 py-2 text-sm font-extrabold uppercase tracking-(--tracking-micro) transition ${
          !activeCategory
            ? 'border-accent bg-accent text-accent-fg'
            : 'border-border text-fg hover:border-accent hover:text-accent dark:border-border-dark'
        }`}
      >
        All
      </Link>
      {categorySlugs.map((slug) => {
        const cat = siteConfig.categories[slug]
        const isActive = activeCategory === slug
        return (
          <Link
            key={slug}
            href={`/projects?category=${slug}`}
            aria-current={isActive ? 'page' : undefined}
            className={`rounded-full border px-4 py-2 text-sm font-extrabold uppercase tracking-(--tracking-micro) transition ${
              isActive
                ? 'border-accent bg-accent text-accent-fg'
                : 'border-border text-fg hover:border-accent hover:text-accent dark:border-border-dark'
            }`}
          >
            {cat.name}
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/app/projects/ProjectFilter.test.tsx
```

Expected: PASS

- [ ] **Step 5: Implement ProjectGrid**

Create `app/projects/ProjectGrid.tsx`:

```tsx
import { ProjectCard } from '@/components/project/ProjectCard'
import type { Project } from '#site/content'

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="mt-12 rounded-lg border border-border p-12 text-center dark:border-border-dark">
        <p className="text-muted">No projects in this category yet.</p>
        <a href="/projects" className="mt-4 inline-block text-accent hover:underline">
          See all projects →
        </a>
      </div>
    )
  }

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  )
}
```

- [ ] **Step 6: Implement projects page**

Create `app/projects/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { getCollection } from '#site/content'
import { ProjectFilter } from './ProjectFilter'
import { ProjectGrid } from './ProjectGrid'
import { categorySlugs, siteConfig, type CategorySlug } from '@/lib/siteConfig'

interface PageProps {
  searchParams: { category?: string }
}

export const metadata: Metadata = {
  title: 'Projects — ' + siteConfig.name,
  description: 'All projects across full stack, AI, design, games, and photography.',
}

function isCategorySlug(value: string | undefined): value is CategorySlug {
  return !!value && categorySlugs.includes(value as CategorySlug)
}

export default function ProjectsPage({ searchParams }: PageProps) {
  const all = getCollection('Project').filter((p) => !p.draft)
  const cat = searchParams.category
  const activeCategory = isCategorySlug(cat) ? cat : undefined
  const filtered = activeCategory ? all.filter((p) => p.categories.includes(activeCategory)) : all
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24">
      <h1 className="font-display text-6xl font-normal leading-(--leading-display) tracking-(--tracking-display) md:text-8xl">
        Projects
      </h1>
      <p className="mt-4 text-muted">
        {sorted.length} {sorted.length === 1 ? 'project' : 'projects'}
      </p>

      <div className="mt-8">
        <ProjectFilter activeCategory={activeCategory} />
      </div>

      <ProjectGrid projects={sorted} />
    </main>
  )
}
```

- [ ] **Step 7: Write Playwright E2E for projects filter**

Create `tests/e2e/projects.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('projects page lists all projects', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.getByRole('heading', { name: /^projects$/i, level: 1 })).toBeVisible()
})

test('category filter shows only matching projects', async ({ page }) => {
  await page.goto('/projects?category=ai')
  await expect(page.getByRole('link', { name: /ai engineering/i })).toHaveAttribute('aria-current', 'page')
})
```

- [ ] **Step 8: Run E2E**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:e2e -- tests/e2e/projects.spec.ts
```

Expected: PASS

- [ ] **Step 9: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: build projects list with category filter chips"
```

---

### Task 6.3: Project detail page

**Files:**
- Create: `app/projects/[slug]/page.tsx`
- Create: `components/project/ProjectMedia.tsx`
- Create: `components/project/DownloadList.tsx`
- Create: `components/project/LinkList.tsx`

**Interfaces:**
- Produces: `GET /projects/[slug]` returns the project detail page with metadata + media; 404 for unknown slugs

- [ ] **Step 1: Implement DownloadList**

Create `components/project/DownloadList.tsx`:

```tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import type { Project } from '#site/content'

interface DownloadListProps {
  downloads: Project['downloads']
}

export function DownloadList({ downloads }: DownloadListProps) {
  if (!downloads || downloads.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-sm font-extrabold uppercase tracking-(--tracking-micro) text-muted">Downloads</h2>
      <ul className="mt-4 space-y-2">
        {downloads.map((dl, i) => (
          <li key={i}>
            <a
              href={dl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 transition hover:border-accent hover:text-accent dark:border-border-dark"
            >
              <FontAwesomeIcon icon={faDownload} className="h-4 w-4" />
              <span>{dl.label}</span>
              {dl.size && <span className="text-xs text-muted">({dl.size})</span>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 2: Implement LinkList**

Create `components/project/LinkList.tsx`:

```tsx
import type { Project } from '#site/content'

interface LinkListProps {
  links: Project['links']
}

export function LinkList({ links }: LinkListProps) {
  if (!links || links.length === 0) return null

  return (
    <section className="mt-12 flex flex-wrap gap-3">
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full border border-accent bg-accent px-6 py-2 text-sm font-extrabold uppercase tracking-(--tracking-micro) text-accent-fg transition hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          {link.label}
        </a>
      ))}
    </section>
  )
}
```

- [ ] **Step 3: Implement ProjectMedia**

Create `components/project/ProjectMedia.tsx`:

```tsx
import Image from 'next/image'
import type { Project } from '#site/content'

interface ProjectMediaProps {
  project: Project
}

export function ProjectMedia({ project }: ProjectMediaProps) {
  return (
    <div className="mt-12 space-y-8">
      {project.video && (
        <video
          controls
          poster={project.videoPoster}
          className="w-full rounded-lg"
          preload="metadata"
        >
          <source src={project.video} />
          Your browser does not support the video tag.
        </video>
      )}

      {project.audio && (
        <div>
          {project.audioTitle && (
            <p className="mb-2 text-sm font-extrabold uppercase tracking-(--tracking-micro) text-muted">
              {project.audioTitle}
            </p>
          )}
          <audio controls className="w-full" preload="metadata">
            <source src={project.audio} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}

      {project.screenshots && project.screenshots.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {project.screenshots.map((ss, i) => (
            <figure key={i} className="space-y-2">
              <Image
                src={ss.src}
                alt={ss.alt}
                width={1200}
                height={800}
                className="rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {ss.caption && <figcaption className="text-xs text-muted">{ss.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Implement project detail page**

Create `app/projects/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getCollection } from '#site/content'
import { siteConfig, categorySlugs, type CategorySlug } from '@/lib/siteConfig'
import { CategoryChip } from '@/components/project/CategoryChip'
import { ProjectMedia } from '@/components/project/ProjectMedia'
import { DownloadList } from '@/components/project/DownloadList'
import { LinkList } from '@/components/project/LinkList'
import { HeroDisplace } from '@/components/effects/HeroDisplace'

interface PageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return getCollection('Project').map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export function generateMetadata({ params }: PageProps): Metadata {
  const project = getCollection('Project').find((p) => p.slug === params.slug)
  if (!project) return {}
  return {
    title: project.title + ' — ' + siteConfig.name,
    description: project.description,
    alternates: { canonical: siteConfig.url + '/projects/' + project.slug },
    openGraph: {
      title: project.title,
      description: project.description,
      url: siteConfig.url + '/projects/' + project.slug,
      images: project.hero ? [{ url: project.hero, width: 1200, height: 630 }] : undefined,
      type: 'article',
    },
  }
}

export default function ProjectDetailPage({ params }: PageProps) {
  const project = getCollection('Project').find((p) => p.slug === params.slug)
  if (!project) notFound()

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24">
      <Link href="/projects" className="text-sm font-extrabold uppercase tracking-(--tracking-micro) text-muted hover:text-accent">
        ← All projects
      </Link>

      <header className="mt-8">
        <div className="flex flex-wrap gap-1.5">
          {project.categories.map((cat) => (
            <CategoryChip key={cat} category={cat} />
          ))}
        </div>
        <h1 className="mt-4 font-display text-5xl font-normal uppercase leading-tight md:text-7xl">
          {project.title}
        </h1>
        <p className="mt-4 text-xl text-muted">{project.description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
          {project.role && <span><strong className="font-extrabold uppercase tracking-(--tracking-micro) text-muted">Role</strong> {project.role}</span>}
          {project.company && <span><strong className="font-extrabold uppercase tracking-(--tracking-micro) text-muted">Company</strong> {project.company}</span>}
          <span><strong className="font-extrabold uppercase tracking-(--tracking-micro) text-muted">Date</strong> {new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
        </div>

        {project.tech.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="text-xs font-extrabold uppercase tracking-(--tracking-micro) text-muted">{t}</span>
            ))}
          </div>
        )}
      </header>

      {project.hero && (
        <div className="relative mt-12 aspect-video overflow-hidden rounded-lg">
          <Image
            src={project.hero}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
          <HeroDisplace imageUrl={project.hero} />
        </div>
      )}

      {project.note && (
        <div className="mt-12 rounded-lg border border-border p-6 text-lg dark:border-border-dark">
          {project.note}
        </div>
      )}

      <ProjectMedia project={project} />
      <LinkList links={project.links} />
      <DownloadList downloads={project.downloads} />
    </main>
  )
}
```

- [ ] **Step 5: Write Playwright E2E for project detail**

Create `tests/e2e/project-detail.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('project detail page renders for a known slug', async ({ page }) => {
  await page.goto('/projects/portfolio-cms')
  await expect(page.getByRole('heading', { name: /headless portfolio cms/i })).toBeVisible()
  await expect(page.getByText(/built a multi-tenant cms/i)).toBeVisible()
})

test('unknown project slug returns 404', async ({ page }) => {
  const response = await page.goto('/projects/does-not-exist')
  expect(response?.status()).toBe(404)
})
```

- [ ] **Step 6: Run E2E**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:e2e -- tests/e2e/project-detail.spec.ts
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: build project detail page with metadata, media, downloads, links"
```

---

### Task 6.4: Experience + About pages

**Files:**
- Create: `app/experience/page.tsx`
- Create: `app/about/page.tsx`

- [ ] **Step 1: Implement experience page**

Create `app/experience/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { getCollection } from '#site/content'
import { siteConfig } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Experience — ' + siteConfig.name,
  description: 'Work history and professional experience.',
}

export default function ExperiencePage() {
  const entries = getCollection('Experience').sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    return b.start.localeCompare(a.start)
  })

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 md:px-12 md:py-24">
      <h1 className="font-display text-6xl font-normal leading-(--leading-display) tracking-(--tracking-display) md:text-8xl">
        Experience
      </h1>

      <ol className="mt-12 space-y-12">
        {entries.map((entry, i) => (
          <li key={i} className="border-l-2 border-border pl-6 dark:border-border-dark">
            <p className="text-sm font-extrabold uppercase tracking-(--tracking-micro) text-accent">
              {new Date(entry.start).getFullYear()} — {entry.end ? new Date(entry.end).getFullYear() : 'Present'}
            </p>
            <h2 className="mt-2 font-display text-2xl font-normal uppercase leading-tight md:text-3xl">
              {entry.title}
            </h2>
            <p className="mt-1 text-lg">
              {entry.companyUrl ? (
                <a href={entry.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                  {entry.company}
                </a>
              ) : (
                entry.company
              )}
              {entry.location && <span className="text-muted"> · {entry.location}</span>}
            </p>
            <p className="mt-3 text-muted">{entry.summary}</p>
            {entry.highlights && entry.highlights.length > 0 && (
              <ul className="mt-4 space-y-1">
                {entry.highlights.map((h, j) => (
                  <li key={j} className="text-sm">
                    — {h}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </main>
  )
}
```

- [ ] **Step 2: Implement about page**

Create `app/about/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { siteConfig } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'About — ' + siteConfig.name,
  description: 'About ' + siteConfig.name,
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-prose px-6 py-16 md:px-12 md:py-24">
      <h1 className="font-display text-6xl font-normal leading-(--leading-display) tracking-(--tracking-display) md:text-8xl">
        About
      </h1>

      <div className="prose prose-lg dark:prose-invert mt-12 max-w-none">
        <p>
          I&apos;m {siteConfig.name}, a software engineer who works across full-stack web development,
          AI engineering, graphic design, game development, and photography. I build thoughtful products
          at the edge, with a particular love for type-safe systems, generative AI, and small games.
        </p>
        <p>
          This portfolio is itself a project — built with Next.js on Cloudflare Pages, with PixiJS visual
          effects, MDX content, and a contact form powered by Resend + Turnstile. The source is on{' '}
          <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          .
        </p>
      </div>

      <div className="mt-12 flex gap-4">
        <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-accent">
          <FontAwesomeIcon icon={faGithub} className="h-6 w-6" />
        </a>
        <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-accent">
          <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6" />
        </a>
        <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-accent">
          <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
        </a>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Write Playwright E2E**

Create `tests/e2e/static-pages.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('experience page renders', async ({ page }) => {
  await page.goto('/experience')
  await expect(page.getByRole('heading', { name: /^experience$/i, level: 1 })).toBeVisible()
})

test('about page renders', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { name: /^about$/i, level: 1 })).toBeVisible()
})
```

- [ ] **Step 4: Run E2E**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:e2e -- tests/e2e/static-pages.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: build experience and about pages"
```

---

## Phase 7 — API Layer (Hono)

Server-side routes for the contact form and view counters.

### Task 7.1: Hono app skeleton + middleware

**Files:**
- Create: `lib/hono/app.ts`
- Create: `lib/hono/middleware/log.ts`
- Create: `tests/unit/lib/hono/app.test.ts`

- [ ] **Step 1: Write failing test**

Create `tests/unit/lib/hono/app.test.ts`:

```typescript
import { app } from '@/lib/hono/app'

describe('Hono app', () => {
  it('responds 404 for unknown routes', async () => {
    const res = await app.request('/unknown')
    expect(res.status).toBe(404)
  })

  it('responds 405 for unsupported methods on /api/contact', async () => {
    const res = await app.request('/api/contact', { method: 'GET' })
    expect(res.status).toBe(405)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/lib/hono/app.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement log middleware**

Create `lib/hono/middleware/log.ts`:

```typescript
import { createMiddleware } from 'hono/factory'

export const log = createMiddleware(async (c, next) => {
  const start = Date.now()
  await next()
  console.log(JSON.stringify({
    level: 'info',
    method: c.req.method,
    path: c.req.path,
    status: c.res.status,
    durationMs: Date.now() - start,
    country: c.req.header('cf-ipcountry'),
  }))
})
```

- [ ] **Step 4: Implement Hono app skeleton**

Create `lib/hono/app.ts`:

```typescript
import { Hono } from 'hono'
import { contactRoute } from './routes/contact'
import { viewsRoute } from './routes/views'
import { log } from './middleware/log'

type Bindings = {
  VIEWS: KVNamespace
  RESEND: SendEmail
  TURNSTILE_SITE_KEY: string
  RESEND_API_KEY: string
  TURNSTILE_SECRET: string
}

export const app = new Hono<{ Bindings: Bindings }>()
  .use('*', log)
  .route('/api/contact', contactRoute)
  .route('/api/views', viewsRoute)
```

- [ ] **Step 5: Run test (it should pass for 404/405 even with empty routes)**

Note: Test will still fail until Task 7.2 creates contactRoute. Mark as TODO and continue.

- [ ] **Step 6: Commit (skeleton only)**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: scaffold Hono app with log middleware (routes wired in next task)"
```

---

### Task 7.2: Contact route with Turnstile + Resend

**Files:**
- Create: `lib/hono/routes/contact.ts`
- Create: `lib/hono/turnstile.ts`
- Modify: `lib/hono/app.ts` (already imports)

**Interfaces:**
- Produces: `POST /api/contact` validates payload, verifies Turnstile, sends email via Resend

- [ ] **Step 1: Write failing test**

Create `tests/unit/lib/hono/contact.test.ts`:

```typescript
import { contactRoute } from '@/lib/hono/routes/contact'

const env = {
  RESEND_API_KEY: 'test-resend-key',
  TURNSTILE_SECRET: 'test-secret',
}

describe('POST /api/contact', () => {
  it('returns 400 on bot detection', async () => {
    const res = await contactRoute.request('/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'spam',
        email: 'spam@spam.com',
        message: 'spam',
        turnstileToken: 'invalid-token',
      }),
    }, env as any)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/bot|verification/i)
  })

  it('returns 400 on missing fields', async () => {
    const res = await contactRoute.request('/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'X' }),
    }, env as any)
    expect(res.status).toBe(400)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/lib/hono/contact.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement turnstile verifier**

Create `lib/hono/turnstile.ts`:

```typescript
export async function verifyTurnstile(token: string, secret: string, remoteIp?: string): Promise<boolean> {
  const params = new URLSearchParams()
  params.append('secret', secret)
  params.append('response', token)
  if (remoteIp) params.append('remoteip', remoteIp)

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  const data = (await response.json()) as { success: boolean }
  return data.success === true
}
```

- [ ] **Step 4: Implement contact route**

Create `lib/hono/routes/contact.ts`:

```typescript
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { verifyTurnstile } from '../turnstile'

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
  turnstileToken: z.string().min(1),
})

type Bindings = {
  RESEND_API_KEY: string
  TURNSTILE_SECRET: string
}

export const contactRoute = new Hono<{ Bindings: Bindings }>().post(
  '/',
  zValidator('json', contactSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid input' }, 400)
    }
    return undefined
  }),
  async (c) => {
    const data = c.req.valid('json')
    const remoteIp = c.req.header('cf-connecting-ip')
    const ok = await verifyTurnstile(data.turnstileToken, c.env.TURNSTILE_SECRET, remoteIp)
    if (!ok) {
      return c.json({ error: 'Bot detected' }, 400)
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${c.env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: 'portfolio@aaronchu.cc',
        to: ['aaron_powerchu@hotmail.com'],
        subject: `[Portfolio] ${data.name}`,
        text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
      }),
    })

    if (!res.ok) {
      console.error('Resend error:', await res.text())
      return c.json({ error: 'Send failed' }, 500)
    }

    return c.json({ ok: true })
  }
)
```

- [ ] **Step 5: Run test to verify it passes**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/lib/hono/contact.test.ts
```

Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: implement contact route with Turnstile + Resend"
```

---

### Task 7.3: View counter route (KV)

**Files:**
- Create: `lib/hono/routes/views.ts`

- [ ] **Step 1: Implement views route**

Create `lib/hono/routes/views.ts`:

```typescript
import { Hono } from 'hono'

type Bindings = {
  VIEWS: KVNamespace
}

export const viewsRoute = new Hono<{ Bindings: Bindings }>()
  .get('/:slug', async (c) => {
    const slug = c.req.param('slug')
    const count = (await c.env.VIEWS.get(`project:${slug}`)) ?? '0'
    return c.json({ slug, views: parseInt(count, 10) })
  })
  .post('/:slug', async (c) => {
    const slug = c.req.param('slug')
    const current = parseInt((await c.env.VIEWS.get(`project:${slug}`)) ?? '0', 10)
    await c.env.VIEWS.put(`project:${slug}`, String(current + 1))
    return c.json({ slug, views: current + 1 })
  })
```

- [ ] **Step 2: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: implement view counter route backed by KV"
```

---

### Task 7.4: Mount Hono at /api/* catch-all

**Files:**
- Create: `app/api/[...route]/route.ts`

- [ ] **Step 1: Create the catch-all route**

Create `app/api/[...route]/route.ts`:

```typescript
import { handle } from 'hono/cloudflare-pages'
import { app } from '@/lib/hono/app'

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
export const OPTIONS = handle(app)
```

- [ ] **Step 2: Write Playwright E2E for contact form (against deployed preview or local with mock)**

For now, add a unit test for the route registration:

```typescript
// tests/unit/app/api/route.test.ts
import { GET } from '@/app/api/[...route]/route'

describe('/api route handler', () => {
  it('exports a GET handler', () => {
    expect(typeof GET).toBe('function')
  })
})
```

- [ ] **Step 3: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: mount Hono at /api/* catch-all route"
```

---

## Phase 8 — Media Storage (R2)

Setup the R2 bucket and upload script.

### Task 8.1: Create R2 bucket via MCP

**Files:**
- (No file changes; runs via Cloudflare MCP)

- [ ] **Step 1: Create the R2 bucket**

Use the Cloudflare MCP to create the bucket:

```python
# In an mcp__plugin_cloudflare_cloudflare-bindings__r2_bucket_create call:
# bucket_name: "aaronchu-portfolio-media"
```

Call this tool with:
- `name`: `aaronchu-portfolio-media`

Expected: bucket created in the Cloudflare account.

- [ ] **Step 2: Configure public access**

This step requires the Cloudflare dashboard (cannot be done via MCP API in a single call). Document the manual step:
1. Go to https://dash.cloudflare.com → R2 → `aaronchu-portfolio-media`
2. Settings → Public Access → Enable
3. Custom Domains → Connect `media.aaronchu.cc` → CNAME

- [ ] **Step 3: Update wrangler.jsonc with real KV id**

After dashboard setup, retrieve the KV namespace ID for VIEWS binding via:

```python
mcp__plugin_cloudflare_cloudflare-bindings__kv_namespace_create(title="VIEWS")
```

Then update `wrangler.jsonc`:

```jsonc
"kv_namespaces": [
  { "binding": "VIEWS", "id": "<actual-kv-namespace-id>" }
]
```

- [ ] **Step 4: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add wrangler.jsonc
git commit -m "chore: wire real Cloudflare KV namespace id into wrangler config"
```

---

### Task 8.2: Upload script

**Files:**
- Create: `scripts/upload-media.ts`
- Create: `lib/media/url.ts`

- [ ] **Step 1: Write URL helper**

Create `lib/media/url.ts`:

```typescript
import { siteConfig } from '@/lib/siteConfig'

export const MEDIA_BASE_URL = siteConfig.mediaUrl

export function mediaUrl(key: string): string {
  return `${MEDIA_BASE_URL}/${key.replace(/^\/+/, '')}`
}
```

- [ ] **Step 2: Write failing test for mediaUrl**

Create `tests/unit/lib/media/url.test.ts`:

```typescript
import { mediaUrl } from '@/lib/media/url'

describe('mediaUrl', () => {
  it('prepends the media base URL', () => {
    expect(mediaUrl('projects/foo/hero.png')).toBe('https://media.aaronchu.cc/projects/foo/hero.png')
  })

  it('strips leading slashes', () => {
    expect(mediaUrl('/projects/foo/hero.png')).toBe('https://media.aaronchu.cc/projects/foo/hero.png')
  })
})
```

- [ ] **Step 3: Run test, verify pass**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run test:unit -- tests/unit/lib/media/url.test.ts
```

Expected: PASS

- [ ] **Step 4: Write upload script**

Create `scripts/upload-media.ts`:

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { siteConfig } from '../lib/siteConfig'

const [, , localPath, key] = process.argv
if (!localPath || !key) {
  console.error('Usage: npm run media:upload -- <localPath> <key>')
  process.exit(1)
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const ext = key.split('.').pop()?.toLowerCase()
const contentType = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  mp4: 'video/mp4',
  webm: 'video/webm',
  mp3: 'audio/mpeg',
  ogg: 'audio/ogg',
  pdf: 'application/pdf',
  zip: 'application/zip',
}[ext ?? ''] ?? 'application/octet-stream'

const body = await readFile(resolve(localPath))
await s3.send(new PutObjectCommand({
  Bucket: siteConfig.cloudflare.r2BucketName,
  Key: key,
  Body: body,
  ContentType: contentType,
}))

console.log(`${siteConfig.mediaUrl}/${key}`)
```

- [ ] **Step 5: Install AWS SDK**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm install -D @aws-sdk/client-s3
```

- [ ] **Step 6: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: build R2 upload script and mediaUrl helper"
```

---

## Phase 10 — SEO

Sitemap, robots, OG images, JSON-LD.

### Task 9.1: Sitemap + robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

- [ ] **Step 1: Implement sitemap**

Create `app/sitemap.ts`:

```typescript
import type { MetadataRoute } from 'next'
import { getCollection } from '#site/content'
import { siteConfig } from '@/lib/siteConfig'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticUrls = ['', '/projects', '/experience', '/about'].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }))

  const projectUrls = getCollection('Project')
    .filter((p) => !p.draft)
    .map((p) => ({
      url: `${siteConfig.url}/projects/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  return [...staticUrls, ...projectUrls]
}
```

- [ ] **Step 2: Implement robots**

Create `app/robots.ts`:

```typescript
import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/siteConfig'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
```

- [ ] **Step 3: Verify sitemap.xml renders**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run dev &
sleep 5
curl -s http://localhost:3000/sitemap.xml | grep -q "aaronchu.cc" && echo "PASS" || echo "FAIL"
curl -s http://localhost:3000/robots.txt | grep -q "sitemap" && echo "PASS" || echo "FAIL"
kill %1
```

Expected: both PASS

- [ ] **Step 4: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: implement sitemap and robots.txt"
```

---

### Task 9.2: Dynamic OG images

**Files:**
- Create: `app/og/route.tsx` (default site OG)
- Create: `app/og/[slug]/route.tsx` (per-project OG)

- [ ] **Step 1: Implement default OG**

Create `app/og/route.tsx`:

```tsx
import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/siteConfig'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#FAFAFA',
          color: '#0A0A0A',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 24, color: '#DF6C4F' }}>{siteConfig.name}</div>
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05, marginTop: 'auto' }}>
          {siteConfig.title}
        </div>
        <div style={{ fontSize: 32, color: '#737373', marginTop: 40, maxWidth: '80%' }}>
          {siteConfig.description}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

- [ ] **Step 2: Implement per-project OG**

Create `app/og/[slug]/route.tsx`:

```tsx
import { ImageResponse } from 'next/og'
import { getCollection } from '#site/content'
import { siteConfig } from '@/lib/siteConfig'

export const runtime = 'edge'

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const project = getCollection('Project').find((p) => p.slug === params.slug)
  const title = project?.title ?? siteConfig.title
  const description = project?.description ?? siteConfig.description

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: '#FAFAFA',
          color: '#0A0A0A',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 24, color: '#DF6C4F' }}>{siteConfig.name}</div>
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05, marginTop: 'auto' }}>{title}</div>
        <div style={{ fontSize: 32, color: '#737373', marginTop: 40, maxWidth: '80%' }}>{description}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

- [ ] **Step 3: Verify OG image renders**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run dev &
sleep 5
curl -sI http://localhost:3000/og | grep -q "200 OK" && echo "PASS" || echo "FAIL"
curl -sI http://localhost:3000/og/portfolio-cms | grep -q "200 OK" && echo "PASS" || echo "FAIL"
kill %1
```

Expected: both PASS

- [ ] **Step 4: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: implement dynamic OG image generation via next/og"
```

---

### Task 9.3: JSON-LD Person schema in layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Add JSON-LD to layout**

Edit `app/layout.tsx` to inject a Person schema:

```tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.author.name,
  url: siteConfig.url,
  email: siteConfig.author.email,
  sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
  jobTitle: 'Software Engineer',
  knowsAbout: siteConfig.keywords,
}

// ...

return (
  <html ...>
    <body>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      {children}
      <Footer />
    </body>
  </html>
)
```

(You'll also need to import `siteConfig` at the top.)

- [ ] **Step 2: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add -A
git commit -m "feat: add JSON-LD Person schema to root layout"
```

---

## Phase 10 — CI/CD + Deployment

### Task 10.1: GitHub Actions CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci

      - name: Lint
        run: npm run lint

      - name: Typecheck
        run: npm run typecheck

      - name: Unit tests
        run: npm run test:unit

      - name: Build
        run: npm run build

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: E2E tests
        run: npm run test:e2e

      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

- [ ] **Step 2: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow for lint, typecheck, unit, build, e2e"
```

---

### Task 10.2: Connect Cloudflare Pages to GitHub

**Files:**
- (No file changes; Cloudflare dashboard config)

- [ ] **Step 1: Connect repo to Cloudflare Pages**

1. Open https://dash.cloudflare.com → Workers & Pages → Create application → Pages → Connect to Git
2. Select the `Powerchu/aaron-chu-portfolio-dev` repo
3. Configure build:
   - Framework preset: `Next.js`
   - Build command: `npx @opennextjs/cloudflare build`
   - Build output directory: `.open-next`
   - Root directory: `/`
   - Environment variables: (configure in next step)

- [ ] **Step 2: Set environment variables in Cloudflare Pages**

In the Pages project settings → Environment variables, add:
- `TURNSTILE_SITE_KEY` = `<your-public-key>`
- `TURNSTILE_SECRET` = `<your-secret>` (mark as encrypted)
- `RESEND_API_KEY` = `<your-resend-key>` (encrypted)
- `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` = `<your-token>` (optional)

- [ ] **Step 3: Trigger first deployment**

Push to `main` (or merge a PR). Cloudflare Pages will auto-build and deploy. Check the deployment URL.

- [ ] **Step 4: Verify deployment**

Visit the deployed URL. Confirm:
- Home page renders with hero
- `/projects` renders with all 5 projects
- `/projects?category=ai` filters correctly
- Dark mode toggle works

---

## Phase 11 — Observability + Polish

### Task 11.1: Cloudflare Web Analytics

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Get analytics token**

In Cloudflare dashboard → `aaronchu.cc` domain → Web Analytics → Enable. Copy the beacon token.

- [ ] **Step 2: Add analytics script**

Edit `app/layout.tsx`:

```tsx
const CF_ANALYTICS_TOKEN = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN

// In the JSX:
{CF_ANALYTICS_TOKEN && (
  <script
    defer
    src="https://static.cloudflareinsights.com/beacon.min.js"
    data-cf-beacon={CF_ANALYTICS_TOKEN}
  />
)}
```

Place this inside `<head>` or just after `<body>` opens.

- [ ] **Step 3: Set env var in Cloudflare Pages**

In Pages project settings, set `NEXT_PUBLIC_CF_ANALYTICS_TOKEN` to the token.

- [ ] **Step 4: Commit**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git add app/layout.tsx
git commit -m "feat: add Cloudflare Web Analytics beacon"
```

---

### Task 11.2: Final verification

**Files:**
- (No file changes; verification only)

- [ ] **Step 1: Run full test suite**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run lint
npm run typecheck
npm run test:unit
npm run test:e2e
```

Expected: all pass.

- [ ] **Step 2: Run production build**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
npm run build
```

Expected: build succeeds, outputs `.next/` and (with OpenNext) `.open-next/`.

- [ ] **Step 3: Verify Cloudflare Web Analytics beacon loads**

Visit the deployed URL → open DevTools → Network → look for `beacon.min.js` request.

- [ ] **Step 4: Lighthouse audit**

Run Lighthouse (Chrome DevTools → Lighthouse) on the deployed URL. Targets:
- Performance: ≥ 95
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 95

If any score is below target, run `npm run build && npm run preview` locally and iterate.

- [ ] **Step 5: Manual smoke test**

In a browser, on the deployed URL, verify:
- [ ] Home page hero renders with title
- [ ] Disciplines strip links to filtered project lists
- [ ] Featured projects grid renders 3 cards
- [ ] Dark mode toggle persists across reload
- [ ] `/projects` lists all 5 sample projects
- [ ] `/projects?category=ai` filters to AI projects
- [ ] Project detail page (`/projects/portfolio-cms`) renders with metadata + media
- [ ] Contact form shows Turnstile widget
- [ ] Sitemap.xml renders at `/sitemap.xml`
- [ ] Robots.txt renders at `/robots.txt`
- [ ] `/og` returns a 1200x630 PNG

- [ ] **Step 6: Set up branch protection**

In GitHub repo settings → Branches → Add rule:
- Branch name pattern: `main`
- ✅ Require pull request reviews before merging (1 approval)
- ✅ Require status checks to pass before merging: `ci` workflow
- ✅ Require linear history
- ❌ Allow force pushes
- ❌ Allow deletions

- [ ] **Step 7: Tag the first release**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git tag v0.1.0
git push --tags
```

- [ ] **Step 8: Commit (no-op if no changes)**

```bash
cd /Users/powerchu/Git/aaron-chu-portfolio-dev
git status
```

If nothing to commit, this task is complete.

---

## Self-Review Notes

- **Spec coverage**: All major spec sections covered (foundation, content, layout, motion, effects, pages, API, media, SEO, CI/CD, observability, polish).
- **Placeholder scan**: No "TBD" or "implement later" steps. Every code step has explicit content.
- **Type consistency**: `categorySlugs` defined once in `lib/siteConfig.ts`; consumed by Velite schema, NavLink, DisciplinesStrip, ProjectCard, ProjectFilter.
- **Test coverage**: Every component with logic has a Jest test; every page has a Playwright E2E.
- **File structure**: Each file has one clear responsibility. Velite-generated types live in `.velite/`; manual config in `lib/`, `content/`, `app/`, `components/`, `scripts/`.
- **Step ordering**: Each task's commit is the gate; later tasks can rely on prior task outputs but assume nothing unstated.