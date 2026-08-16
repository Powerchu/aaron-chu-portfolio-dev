# Portfolio Stack Design — `aaron-chu-portfolio-dev`

**Date:** 2026-08-16
**Status:** Approved by user, transitioning to implementation planning
**Target domain:** `https://aaronchu.cc`

---

## Summary

A Cloudflare Pages-hosted developer portfolio for Aaron Chu. Built with Next.js on the open-next adapter, statically rendering case studies and experience entries from typed MDX, with a Hono-mounted API surface for the contact form and view counters. Design is research-driven minimalist: editorial typography, black/white palette with a single terracotta accent, asymmetric grid, subtle motion. No blog in v1 — case studies only.

---

## Locked Decisions

| Area | Decision |
|---|---|
| **Hosting** | Cloudflare Pages via OpenNext |
| **Render mode** | Hybrid (SSG for content pages + Worker runtime for `/api/*`, `/og/*`, sitemap, robots) |
| **Framework** | Next.js (App Router) + Turbopack |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4 (Oxide) + `@tailwindcss/typography` |
| **Components** | shadcn/ui (selected primitives only) |
| **Animation** | Framer Motion (entrance, hover, parallax) + **PixiJS 7 + WebGL2** (subtle gradients, ambient noise, hero displacement) |
| **API** | Hono mounted at `app/api/[...route]/route.ts` |
| **Icons** | **Font Awesome 7 Free** (solid + brands) via `@fortawesome/react-fontawesome` — tree-shaken per-icon imports |
| **Bundler** | Turbopack (Vite dropped — see "Dropped" below) |
| **Unit/component tests** | Jest + React Testing Library |
| **E2E tests** | Playwright |
| **Content** | Hand-curated MDX via Velite (Zod-typed schemas) |
| **Storage** | KV (view counters) + R2 (media: videos, screenshots, audio, game files, project files) + D1 (structured data if needed) |
| **Email** | Cloudflare Workers Email + Resend |
| **Spam protection** | Cloudflare Turnstile |
| **Domain** | `aaronchu.cc` |
| **CI/CD** | Cloudflare Pages built-in Git integration + GitHub Actions for CI |
| **Coverage gate** | 80% lines + branches, 80% functions + statements |
| **Analytics** | Cloudflare Web Analytics (cookie-free, GDPR-friendly) |
| **Error tracking** | None in v1 (console + `wrangler tail` only) |

### Dropped

- **Vite** — Vitest is built on Vite; Jest + RTL replaces it. Turbopack handles dev/build bundling.
- **Cloudflare Workers** (vs. Pages) — Pages is the right target for static-first content sites with a small API surface.
- **Supabase / external Postgres** — Cloudflare R2 (10 GB free, no egress) + D1 (5 GB free) + KV (1 GB free) cover everything a portfolio needs at the edge, with no inactivity pause. Supabase's free tier pauses after 7 days of inactivity and has 1 GB storage vs R2's 10 GB — wrong trade-off for a portfolio. Re-evaluate if Auth or Realtime become real requirements.
- **Custom cursor** — still out of minimalist scope; default system cursor + subtle CSS hover.
- **Long-form case study MDX** — replaced with structured project metadata. Detail pages render metadata + media, not narrative.
- **Blog / RSS feed** — no blog in v1.
- **Sentry / external error tracking** — YAGNI for portfolio-scale traffic.

---

## Architecture

### Render mode

Hybrid via OpenNext:

- Content pages (`/`, `/projects`, `/projects/[slug]`, `/experience`, `/about`) → **SSG** static HTML in the build output
- `/api/*` (Hono-mounted), `/og/[slug]` (dynamic OG image), `/sitemap.xml`, `/robots.txt` → **Worker runtime** on each request
- Pages serves the static output and routes `/api/*`, `/og/*`, `/sitemap.xml`, `/robots.txt` to the Worker entry

### File structure

```
aaron-chu-portfolio-dev/
├── app/
│   ├── layout.tsx                  # HTML shell, fonts, theme, JSON-LD Person schema
│   ├── page.tsx                    # Home (SSG)
│   ├── projects/
│   │   ├── page.tsx                # Projects index (SSG, MDX-driven)
│   │   └── [slug]/page.tsx         # Project detail (SSG, generateStaticParams)
│   ├── experience/page.tsx         # Experience timeline (SSG)
│   ├── about/page.tsx              # About page (SSG)
│   ├── api/
│   │   └── [...route]/route.ts     # Hono catch-all mount
│   ├── og/
│   │   ├── route.tsx               # Default site OG image
│   │   └── [slug]/route.tsx        # Per-project OG image
│   ├── sitemap.ts                  # Auto-generated sitemap
│   ├── robots.ts                   # robots.txt
│   ├── icon.tsx                    # Programmatic favicon
│   └── apple-icon.tsx              # Apple touch icon
├── components/
│   ├── ui/                         # shadcn/ui primitives (Button, Card, Badge, etc.)
│   ├── home/                       # Home sections (Hero, FeaturedProjects)
│   ├── project/                    # ProjectCard, ProjectHeader, TechTag, CategoryChip
│   ├── motion/                     # FadeIn, Stagger, ScrollReveal (all with useReducedMotion)
│   ├── effects/                    # PixiJS + WebGL — GradientMesh, AmbientNoise, HeroDisplace
│   ├── parallax/                   # ParallaxY, ParallaxMouse, DriftShape
│   ├── nav/                        # Navigation, mobile Sheet, ThemeToggle
│   └── layout/                     # Header, Footer
├── content/
│   ├── projects/*.mdx              # Case studies
│   ├── experience/*.mdx            # Work history entries
│   └── about.mdx                   # Optional about body (header is in default export)
├── lib/
│   ├── hono/
│   │   ├── app.ts                  # Hono app entrypoint
│   │   ├── routes/
│   │   │   ├── contact.ts          # POST /api/contact
│   │   │   └── views.ts            # GET/POST /api/views/[slug]
│   │   └── middleware/
│   │       └── log.ts              # Structured JSON request logging
│   ├── content/                    # Velite-generated helpers
│   ├── media/
│   │   └── url.ts                  # R2 base URL + helpers (mediaUrl(key))
│   ├── seo/
│   │   └── metadata.ts             # Page-level metadata helpers
│   ├── siteConfig.ts               # Site-wide constants
│   └── utils/                      # Generic helpers
├── tests/
│   ├── unit/                       # Jest specs
│   └── e2e/                        # Playwright specs
├── scripts/
│   └── upload-media.ts             # CLI: upload a file to R2 media bucket, print public URL
├── .github/workflows/
│   ├── ci.yml                      # Lint + typecheck + unit + E2E on PR
│   └── (deploy.yml optional — Pages Git integration preferred)
├── open-next.config.ts             # OpenNext adapter config
├── wrangler.jsonc                  # Cloudflare config (replaces wrangler.json)
├── velite.config.ts                # Velite content schema config
├── next.config.ts
├── tailwind.config.ts (or v4 CSS @theme)
├── tsconfig.json
├── jest.config.ts
├── playwright.config.ts
├── package.json
├── AGENTS.md
├── CLAUDE.md
└── docs/superpowers/specs/
    └── 2026-08-16-portfolio-stack-design.md
```

### Wrangler configuration

`wrangler.jsonc` (replaces current `wrangler.json`):

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "aaron-chu-portfolio-dev",
  "main": ".open-next/worker.js",
  "compatibility_date": "2026-08-01",
  "compatibility_flags": ["nodejs_compat"],
  "observability": { "enabled": true },
  "upload_source_maps": true,
  "assets": {
    "directory": ".open-next/assets",
    "not_found_handling": "single-page-application"
  },
  "kv_namespaces": [
    { "binding": "VIEWS", "id": "<auto-created-on-deploy>" }
  ],
  "r2_buckets": [
    { "binding": "MEDIA", "bucket_name": "aaronchu-portfolio-media" }
  ],
  "send_email": [
    { "name": "RESEND", "destination_address": "aaron_powerchu@hotmail.com" }
  ],
  "vars": {
    "TURNSTILE_SITE_KEY": "<public site key>",
    "NEXT_PUBLIC_CF_ANALYTICS_TOKEN": "<from Cloudflare dashboard>"
  }
}
```

Secrets (via `wrangler secret put`, never committed):
- `RESEND_API_KEY`
- `TURNSTILE_SECRET`
- `CLOUDFLARE_API_TOKEN` (for CI deploys and the `pages-action` step)

---

## Content Model

### Velite schemas (`velite.config.ts`)

```ts
import { defineCollection, defineConfig, s } from 'velite'

const projects = defineCollection({
  name: 'Project',
  pattern: 'projects/*.mdx',
  schema: s.object({
    title: s.string(),
    slug: s.path(),
    description: s.string().max(280),
    date: s.isodate(),
    // Disciplines — one or more of the 5 categories. Drives filter chips on /projects.
    categories: s.array(s.union([
      s.literal('full-stack'),
      s.literal('ai'),
      s.literal('graphic-design'),
      s.literal('game-dev'),
      s.literal('photography'),
    ])).min(1),
    tech: s.array(s.string()),
    role: s.string().optional(),
    company: s.string().optional(),
    hero: s.image(),
    video: s.string().url().optional(),                              // R2 URL (mp4/webm)
    videoPoster: s.string().optional(),                             // image URL or R2 path
    audio: s.string().url().optional(),                             // R2 URL (mp3/ogg)
    audioTitle: s.string().optional(),
    screenshots: s.array(s.object({                                 // additional screenshots beyond hero
      src: s.string(),
      alt: s.string(),
      caption: s.string().optional(),
    })).default([]),
    downloads: s.array(s.object({                                   // downloadable project files (game zips, source bundles)
      url: s.string(),
      label: s.string(),
      size: s.string().optional(),                                  // e.g., "12.4 MB"
      type: s.string().optional(),                                  // e.g., "game", "source", "design"
    })).default([]),
    links: s.array(s.object({                                       // general-purpose external links (repo, demo, writeup, etc.)
      label: s.string(),
      url: s.string().url(),
    })).default([]),
    featured: s.boolean().default(false),
    draft: s.boolean().default(false),
    // Optional short note — single paragraph max, kept thin. Not a full case study.
    note: s.string().max(500).optional(),
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
    body: s.mdx(),
  }),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: { name: '[name]-[hash:6].[ext]', output: 'public/static' },
  },
  collections: { projects, experience },
})
```

### Page consumption pattern

```ts
// app/projects/page.tsx — list view with category filter (URL-synced)
import { getCollection } from '#site/content'
import { ProjectFilter } from '@/components/project/ProjectFilter'
import { ProjectGrid } from '@/components/project/ProjectGrid'

type SearchParams = { category?: string }

export default function ProjectsIndex({ searchParams }: { searchParams: SearchParams }) {
  const projects = getCollection('Project')
    .filter(p => !p.draft || process.env.NODE_ENV === 'development')

  const filtered = searchParams.category
    ? projects.filter(p => p.categories.includes(searchParams.category as ProjectCategory))
    : projects

  const sorted = filtered.sort((a, b) => b.date.localeCompare(a.date))

  return (
    <main>
      <h1>Projects</h1>
      <ProjectFilter />                                 {/* client component reading/writing URL */}
      <ProjectGrid projects={sorted} />                 {/* server component */}
    </main>
  )
}

// app/projects/[slug]/page.tsx — detail view (structured metadata, no MDX narrative)
export function generateStaticParams() {
  return getCollection('Project').map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getCollection('Project').find(p => p.slug === params.slug)
  if (!project) return {}
  return {
    title: `${project.title} — ${siteConfig.name}`,
    description: project.description,
    alternates: { canonical: `${siteConfig.url}/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      url: `${siteConfig.url}/projects/${project.slug}`,
      images: [{ url: project.hero, width: 1200, height: 630 }],
      type: 'article',
    },
  }
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = getCollection('Project').find(p => p.slug === params.slug)
  if (!project) notFound()

  return (
    <main>
      <HeroDisplace image={project.hero} />             {/* PixiJS effect on hero image */}
      <h1>{project.title}</h1>
      <p>{project.description}</p>

      <CategoryChips categories={project.categories} />
      <TechTagList tech={project.tech} />
      {project.note && <p>{project.note}</p>}

      <ProjectMedia project={project} />                {/* videos, audio, screenshots */}
      <DownloadList downloads={project.downloads} />
      <LinkList links={project.links} />

      <NextProject currentSlug={project.slug} />
    </main>
  )
}
```

**Pages:**
- `app/projects/page.tsx` — category-filtered list (URL-synced, no client-side navigation overhead)
- `app/projects/[slug]/page.tsx` — `generateStaticParams` enumerates all projects; `dynamicParams = false` so unknown slugs return 404. No MDX body — only structured metadata + media.
- `app/experience/page.tsx` — work history, sort by `start` desc, `order` asc as tiebreaker
- `app/about/page.tsx` — single-column bio

### Category system

Projects are tagged with one or more categories from a fixed set:

| Slug | Display name | Use for |
|---|---|---|
| `full-stack` | Full Stack | Web apps, SaaS, APIs, infrastructure work |
| `ai` | AI Engineering | AI agents, RAG pipelines, fine-tuned models, MLOps |
| `graphic-design` | Graphic Design | Logos, brand identity, posters, print, illustration |
| `game-dev` | Game Dev | Indie games, prototypes, jams, game art |
| `photography` | Photography | Photo series, exhibitions, prints |

A single project may belong to multiple categories (e.g., a game with full-stack tooling + game-dev art + photography for marketing assets).

**Filter UI:** chip row at top of `/projects`, URL-synced via `?category=ai`. Chips: All / Full Stack / AI / Design / Game Dev / Photography. Count of projects per category shown on each chip.

**Home featured:** top of home shows 2-3 featured projects, deliberately one per category to showcase breadth.

---

## Styling & Animation

### Palette

| Token | Light | Dark |
|---|---|---|
| `bg` | `#FAFAFA` | `#0A0A0A` |
| `fg` | `#0A0A0A` | `#FAFAFA` |
| `muted` | `#737373` | `#737373` |
| `accent` | `#DF6C4F` | `#DF6C4F` |
| `accent-fg` | `#FFFFFF` | `#FFFFFF` |

### Typography

- **Display**: `Inter Tight` (variable), `8–12vw` for H1, descending to standard scale
- **Body**: `Inter` (variable), 16px, line-height 1.6
- **Mono**: `JetBrains Mono` (variable), for code blocks and tech tags
- **Tracking**: display `-0.04em`, body default, micro-caps `+0.04em`
- **Fonts**: self-hosted via `next/font` (no FOUT, no CLS)

### Grid

- Single-column prose at `max-width: 68ch` (≈ 920px)
- 12-column grid for project cards at `max-width: 1280px`
- Asymmetric content placement intentional (headings break the rigid baseline)
- Breakpoints: `sm/md/lg/xl/2xl = 640/768/1024/1280/1536`

### Motion primitives (`components/motion/`)

- `FadeIn` — opacity + 12px Y, 400ms, ease `[0.22, 1, 0.36, 1]`
- `Stagger` — children with `staggerChildren: 0.06`
- `ScrollReveal` — 24px Y, `viewport.once: true`, `margin: -80px`
- Subtle hover scale (`1 → 1.02`) on project cards
- **Every** primitive wrapped in `useReducedMotion()` → disable motion entirely
- No custom cursor, no WebGL, no parallax

### shadcn/ui primitives

Selected only: `Button`, `Card`, `Badge`, `Separator`, `DropdownMenu`, `Sheet`. Skip the catalog's `Accordion`, `Calendar`, `Carousel`, `Combobox`, `DataTable`.

### Dark mode

- `class` strategy (`<html class="dark">`)
- `localStorage` persistence
- No FOUC (initial script runs before paint)
- Theme toggle in nav

### Accessibility

- Semantic HTML (`<main>`, `<article>`, `<nav>`, `<section>`)
- Skip-to-content link in root layout
- Focus rings preserved (`focus-visible:ring-2 focus-visible:ring-accent`)
- Color contrast ≥ WCAG AA (4.5:1 body, 3:1 large)
- `prefers-reduced-motion` respected throughout

---

## Visual Effects (PixiJS + Parallax)

For a multi-disciplinary portfolio, the visual system needs to *showcase design taste* without overwhelming the work. We use **PixiJS 7 + WebGL2** for subtle, artful effects and **framer-motion** `useScroll` for minimal-but-strong parallax. Neither should compete with the content.

### When to use what

| Effect | Library | Where it lives | When used |
|---|---|---|---|
| Animated gradient mesh on hero background | PixiJS | `components/effects/GradientMesh.tsx` | Home, project detail (background) |
| Ambient film-grain noise overlay | PixiJS | `components/effects/AmbientNoise.tsx` | Page-level (1px tile, opacity ~0.04) |
| Hero image soft displacement | PixiJS | `components/effects/HeroDisplace.tsx` | Project detail hero (subtle parallax-like effect via shader) |
| Category filter gradient transition | PixiJS | `components/effects/FilterTransition.tsx` | `/projects` when category changes |
| Y-axis parallax (hero text, sections) | framer-motion | `components/parallax/ParallaxY.tsx` | Home hero, section headings |
| Mouse-follow parallax (hero gradient) | framer-motion + custom hook | `components/parallax/ParallaxMouse.tsx` | Home hero, project cards hover |
| Background drift shapes | framer-motion | `components/parallax/DriftShape.tsx` | Home — background SVG shapes drift slowly opposite to scroll |

### PixiJS architecture

```ts
// lib/pixi/createApp.ts — singleton factory so we share GL contexts
import { Application } from 'pixi.js'

let app: Application | null = null

export async function getPixiApp(canvas: HTMLCanvasElement) {
  if (app) return app
  app = new Application()
  await app.init({
    canvas,
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundAlpha: 0,
    antialias: true,
    powerPreference: 'high-performance',
    preference: 'webgl2', // falls back to webgl, then null
  })
  return app
}
```

**Performance discipline:**
- Lazy-load PixiJS only when an effect component mounts (dynamic import — never in the critical path)
- Single shared `Application` instance per page; effects are layers, not apps
- Cleanup on unmount: `.destroy(true)` + remove canvas from DOM
- Detect `prefers-reduced-motion`: render a static frame (single `renderer.render(app.stage)` after init, never enter the ticker loop)
- WebGL2 preferred, WebGL1 acceptable, no-WebGL → render the static fallback (CSS gradient or image)
- Pause on tab hidden (`document.visibilitychange`) — saves battery
- Cap pixel ratio at `Math.min(window.devicePixelRatio, 2)`

### Component pattern

```tsx
// components/effects/GradientMesh.tsx
'use client'
import { useEffect, useRef } from 'react'
import { getPixiApp } from '@/lib/pixi/createApp'

export function GradientMesh({ palette }: { palette: [string, string, string] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return // static fallback only
    const canvas = ref.current
    if (!canvas) return
    let cleanup: (() => void) | undefined

    ;(async () => {
      const app = await getPixiApp(canvas)
      // Build a Container with Mesh + custom shader that interpolates
      // between palette stops based on uniform uShift driven by scroll.
      // ... setup ...
      cleanup = () => app.stage.removeChildren()
    })()

    return () => cleanup?.()
  }, [reduced])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  )
}
```

### Parallax patterns

```tsx
// components/parallax/ParallaxY.tsx
'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function ParallaxY({ children, offset = 24 }: { children: React.ReactNode; offset?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])
  // Respect reduced-motion: motion respects it automatically via framer-motion
  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  )
}
```

```tsx
// components/parallax/ParallaxMouse.tsx
'use client'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

export function ParallaxMouse({ intensity = 0.04, children }: { intensity?: number; children: React.ReactNode }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { damping: 30, stiffness: 200 })
  const springY = useSpring(y, { damping: 30, stiffness: 200 })

  // Map raw mouse position [-1, 1] to a small motion range
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

### Defaults (locked)

| Effect | Default | Off when |
|---|---|---|
| GradientMesh hero background | enabled | `prefers-reduced-motion`, mobile viewport (<768px), no-WebGL |
| AmbientNoise overlay | enabled | `prefers-reduced-motion` |
| HeroDisplace on project detail | enabled | `prefers-reduced-motion`, mobile |
| ParallaxY | `offset: 24px`, top of viewport only | mobile (saves scroll perf), `prefers-reduced-motion` |
| ParallaxMouse | `intensity: 0.04` | mobile (no cursor), `prefers-reduced-motion` |
| DriftShape | `count: 2-3` SVG circles, slow drift | `prefers-reduced-motion` |
| FilterTransition | enabled | `prefers-reduced-motion`, no-WebGL → CSS-only fade |

### Bundle size note

- `pixi.js` v7: ~280 KB minified+gzip (only loaded when an effect mounts)
- framer-motion: ~50 KB (already in the bundle for React animations)
- Initial page load: zero PixiJS bytes (effects are lazy-mounted)
- Heaviest page (home with GradientMesh + AmbientNoise + DriftShape): ~330 KB JS for effects

If bundle size becomes a concern, the first thing to lazy-load more aggressively is GradientMesh.

---

## API Layer (Hono)

### Mount

```ts
// app/api/[...route]/route.ts
import { handle } from 'hono/cloudflare-pages'
import { app } from '@/lib/hono/app'

export const GET = handle(app)
export const POST = handle(app)
// handle() wraps all HTTP methods
```

### Route surface

| Method | Path | Purpose | Validation | Backing |
|---|---|---|---|---|
| POST | `/api/contact` | Contact form submission | Zod | Resend + Turnstile |
| GET | `/api/views/[slug]` | View counter read | none | KV |
| POST | `/api/views/[slug]` | View counter increment | Zod (slug) | KV |

### Contact form contract

- **Request**: `{ name: string (1–120), email: string (email), message: string (1–5000), turnstileToken: string }`
- **200**: `{ ok: true }`
- **400**: `{ error: 'Bot detected' | 'Invalid input' }`
- **500**: `{ error: 'Send failed' }`
- **Pipeline**: validate → verify Turnstile → send via Resend `from: hello@aaronchu.cc, to: aaron_powerchu@hotmail.com`

### Structured logging middleware

```ts
// lib/hono/middleware/log.ts
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

---

## Media Storage (R2)

Projects may include rich media: demo videos, screenshots, audio clips, downloadable game files, source bundles. Hosting all of this in git would balloon the repo and slow CI, so we use **Cloudflare R2** for media storage — 10 GB free, zero egress fees, edge-cached.

### Bucket

- **Bucket name**: `aaronchu-portfolio-media`
- **Binding**: `MEDIA` (in `wrangler.jsonc`)
- **Public access**: enabled via custom domain `media.aaronchu.cc` (DNS CNAME → R2 public hostname)
- **Path convention**: `projects/<slug>/<filename>` so each project's assets are namespaced

### Custom domain

- `media.aaronchu.cc` → R2 public bucket (configured via Cloudflare dashboard → R2 → bucket → Settings → Public Access → Custom Domains)
- Result: `https://media.aaronchu.cc/projects/my-game/demo.mp4` is a stable public URL

### URL helper

```ts
// lib/media/url.ts
export const MEDIA_BASE_URL = 'https://media.aaronchu.cc'

export function mediaUrl(key: string): string {
  // key like "projects/my-game/demo.mp4"
  return `${MEDIA_BASE_URL}/${key}`
}
```

Project MDX frontmatter references media via these absolute URLs (no build-time processing — R2 is the source of truth):

```mdx
---
title: My Awesome Game
hero: ./hero.png
video: https://media.aaronchu.cc/projects/my-game/demo.mp4
videoPoster: https://media.aaronchu.cc/projects/my-game/demo-poster.jpg
audio: https://media.aaronchu.cc/projects/my-game/theme.mp3
audioTitle: Original Theme
screenshots:
  - src: https://media.aaronchu.cc/projects/my-game/level-1.png
    alt: Level 1 — The Forest
  - src: https://media.aaronchu.cc/projects/my-game/level-2.png
    alt: Level 2 — The Caves
    caption: First boss encounter
downloads:
  - url: https://media.aaronchu.cc/projects/my-game/build.zip
    label: Game build (WebGL)
    size: 24.6 MB
    type: game
  - url: https://media.aaronchu.cc/projects/my-game/source.zip
    label: Source code (Unity)
    size: 1.2 MB
    type: source
---
```

### Upload workflow

Manual via Wrangler CLI:

```bash
npx wrangler r2 object put aaronchu-portfolio-media/projects/my-game/demo.mp4 \
  --file ./demo.mp4 \
  --content-type video/mp4
```

Or via the wrapper script (recommended):

```bash
npm run media:upload -- ./demo.mp4 projects/my-game/demo.mp4
# → uploads, prints: https://media.aaronchu.cc/projects/my-game/demo.mp4
```

```ts
// scripts/upload-media.ts (Node + Wrangler's S3-compatible API)
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { readFile } from 'node:fs/promises'

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const [,, localPath, key] = process.argv
const body = await readFile(localPath)
await s3.send(new PutObjectCommand({
  Bucket: 'aaronchu-portfolio-media',
  Key: key,
  Body: body,
  ContentType: detectContentType(key),
}))
console.log(`https://media.aaronchu.cc/${key}`)
```

### Quota management (free tier limits)

- 10 GB total storage (free)
- 10 million Class A operations/month (PUT, POST, LIST) — uploads
- 10 million Class B operations/month (GET, HEAD) — downloads
- **Egress is free** (R2's defining feature vs S3)

For a portfolio with ~10 projects × ~5 assets each × ~5 MB average = ~250 MB total — comfortably within quota. Monitor via R2 dashboard → bucket → Metrics.

### Testing media

- **Unit**: `mediaUrl(key)` returns correctly formatted URL
- **E2E (Playwright)**: project detail page with `video:` renders a `<video>` element with the expected `src`; page screenshot test for the media section
- **Visual regression**: full-page screenshots of media-heavy project detail pages

---

## SEO & Metadata

### Site config

```ts
// lib/siteConfig.ts
export const siteConfig = {
  name: 'Aaron Chu',
  title: 'Aaron Chu — Developer Portfolio',
  description: 'Software engineer building thoughtful products at the edge.',
  url: 'https://aaronchu.cc',
  ogImage: '/og/default.png',
  author: {
    name: 'Aaron Chu',
    email: 'aaron_powerchu@hotmail.com',
    github: 'Powerchu',
    linkedin: 'aaronchu',
  },
  keywords: ['Software Engineer', 'TypeScript', 'Next.js', 'Cloudflare', 'Edge'],
  locale: 'en-US',
} as const
```

### Per-page metadata

Every page exports `generateMetadata`. Project pages read Velite frontmatter for title/description/OG. Experience pages use a summary field. About page uses siteConfig + per-page override.

### Sitemap

`app/sitemap.ts` enumerates static URLs + every Velite project. Includes `lastModified`, `changeFrequency`, `priority`.

### robots.txt

`app/robots.ts` allows all, points to `https://aaronchu.cc/sitemap.xml`.

### JSON-LD

- **Person schema** in `app/layout.tsx` (rendered once per page)
- **CreativeWork schema** in project detail pages (title, author, dateCreated, keywords)

### Favicons

- `app/icon.tsx` — programmatic favicon (a `</>` mark in terracotta)
- `app/apple-icon.tsx` — Apple touch icon
- `app/og/route.tsx` — default OG fallback

### Dynamic OG images

`app/og/[slug]/route.tsx` generates per-project OG cards at the edge using `next/og`. Default at `app/og/route.tsx`. Both render terracotta accent + oversized display heading + grey descriptor.

---

## Testing & CI/CD

### Layers

| Layer | Tool | Scope |
|---|---|---|
| Unit | Jest + RTL + jsdom | Hono route handlers, Velite helpers, utility functions |
| Component | Jest + RTL | `ProjectCard`, `Navigation`, `ThemeToggle`, form validation |
| E2E | Playwright | Home → projects → project detail → contact form → dark mode toggle |
| Visual | Playwright `toHaveScreenshot()` | Homepage, project detail, mobile nav (optional) |

### Coverage thresholds

```ts
// jest.config.ts
coverageThreshold: {
  global: { branches: 80, functions: 80, lines: 80, statements: 80 },
}
```

### GitHub Actions — `ci.yml`

Runs on every PR and push to `main`:
1. `npm ci`
2. `npm run lint`
3. `npm run typecheck` (`tsc --noEmit`)
4. `npm run test:unit` (Jest, with coverage check)
5. `npm run test:e2e` (Playwright against local `next dev`)

### Cloudflare Pages Git integration

- Connect the GitHub repo to Cloudflare Pages via the dashboard
- Pages reads `wrangler.jsonc` for build command + output directory
- Every push to `main` triggers a production build + deploy
- Every PR gets a unique preview URL (`pr-123.aaron-chu.pages.dev`)
- **No `deploy.yml` needed** in v1 — Pages handles deploys

### Secrets in CI

- `CLOUDFLARE_API_TOKEN` — for any direct `wrangler` operations in CI (only if we add `deploy.yml`)
- For Pages Git integration, no CI secrets are required for deploy; secrets stored on the Cloudflare dashboard side

---

## Observability

| Signal | Where it goes | Cost |
|---|---|---|
| Worker request metrics | Cloudflare Workers Analytics Engine | Free |
| Structured request logs | `wrangler tail` + Cloudflare dashboard Logs | Free |
| Page-view analytics | Cloudflare Web Analytics (browser beacon) | Free, no cookies |
| Core Web Vitals | Cloudflare Web Analytics auto-collects | Free |
| Error tracking | Console logs only (v1) | Free |
| Uptime | Cloudflare Synthetic Monitoring (optional) | Free tier |

### Web Analytics setup

`app/layout.tsx` injects the script tag with `data-cf-beacon` from `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`. Missing token = no analytics (clean dev experience).

### Operational runbook

| Symptom | Where to look | Likely fix |
|---|---|---|
| 5xx on `/api/contact` | `wrangler tail --status error` | Resend key or Turnstile secret |
| Slow TTFB on `/projects/[slug]` | Workers Logs → cache status | Cache miss; warm up after deploy |
| Spam contact submissions | Turnstile dashboard | Verify `TURNSTILE_SECRET` matches site key |
| `next/og` errors | Workers Logs → `/og/[slug]` | Velite slug mismatch |
| Video/audio not loading on project page | Browser DevTools → Network | Check `media.aaronchu.cc` DNS + R2 bucket public access |
| Broken download link | R2 dashboard → bucket → objects | Re-upload the file, update MDX URL |
| R2 quota warning | Cloudflare dashboard → R2 → Metrics | Delete unused assets; consider per-asset compression |

### Rollback

- Cloudflare Pages dashboard → Deployments → previous deploy → "Rollback to this deploy"
- Tag releases on `main` (`git tag v0.1.0`) for clean history

---

## Out of Scope (v1)

- Blog / RSS feed
- Custom cursor (out of minimalist scope)
- Sentry / external error tracking
- Logpush to external SIEM
- A/B testing tools
- Custom RUM / performance beacons (Cloudflare Web Analytics already covers)
- Search across projects (defer until you have ≥10 projects)
- i18n / multilingual support
- Authenticated areas (no admin UI in v1)

---

## Open Questions → Resolved

| Question | Resolution |
|---|---|
| Next.js vs Workers/Pages | Next.js on Cloudflare Pages via OpenNext |
| Vite alongside Next | Dropped Vite entirely; Jest+RTL replaces Vitest |
| Hono's role | Mounted at `/api/*` catch-all; Hono owns routing/validation/middleware |
| Content source | Hand-curated MDX via Velite (Zod-typed) — structured metadata (no case study narrative) |
| Contact form backend | Workers Email + Resend + Turnstile |
| Domain | `aaronchu.cc` (media subdomain: `media.aaronchu.cc` → R2) |
| Visual register | Minimalist (research-driven), terracotta accent |
| Visual effects | **PixiJS 7 + WebGL2** for subtle gradients, ambient noise, hero displacement — minimal-but-artful |
| Parallax | Minimal-but-strong: 24px Y-offset on hero, mouse-follow at 0.04 intensity, slow drift shapes |
| Project structure | **Standard projects list** (no case study MDX). Detail page = metadata + media |
| Multi-discipline categorization | 5 categories: full-stack / ai / graphic-design / game-dev / photography. Filter chips on `/projects`, URL-synced |
| Test coverage | 80% lines + branches, 80% functions + statements |
| Database + file storage | Cloudflare only: D1 / KV for data, R2 (10GB free, no egress) for media. Supabase rejected (1GB free, 7-day inactivity pause, wrong trade-off for portfolio). |
