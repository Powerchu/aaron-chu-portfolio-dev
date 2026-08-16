# AGENTS.md

Project memory for AI agents working on **Aaron Chu's Developer Portfolio**.

**Related references:**
- `UIUX.md` — visual system, design references, PixiJS + parallax + motion + a11y rules (read before any UI work)
- `docs/superpowers/specs/2026-08-16-portfolio-stack-design.md` — architecture + tech stack decisions

---

## Project Summary

A Cloudflare-hosted **developer portfolio website** for Aaron Chu, served from the edge for global low-latency. The site should showcase projects, experience, and contact information as a polished, animated single-page experience.

---

## Target Tech Stack

| Layer            | Choice                                    |
| ---------------- | ----------------------------------------- |
| Frontend router  | **Next.js** (App Router)                  |
| UI library       | **React**                                 |
| Bundler          | **Turbopack** (Vite was dropped)          |
| Unit / E2E tests | **Jest + RTL**, **Playwright**            |
| Styling          | **Tailwind CSS v4** (Oxide)               |
| Animation        | **Framer Motion** (entrance, hover, parallax) |
| Visual effects   | **PixiJS 7 + WebGL2** (gradient mesh, ambient noise, hero displacement) |
| Edge backend     | **Hono** (mounted at `/api/*`)            |
| Content layer    | **Velite** (typed MDX from `content/`)    |
| Language         | **TypeScript** (strict mode)              |
| Hosting          | **Cloudflare Pages** (via OpenNext)       |
| Media storage    | **Cloudflare R2** (10 GB free, no egress) |

## Multi-disciplinary categories

The portfolio serves **5 disciplines**, segregated via filter chips on `/projects` (URL-synced via `?category=<slug>`):

| Slug | Display name | Icon (Font Awesome 7 Free) |
|---|---|---|
| `full-stack` | Full Stack | `faCode` (solid) |
| `ai` | AI Engineering | `faMicrochip` (solid) |
| `graphic-design` | Graphic Design | `faPalette` (solid) |
| `game-dev` | Game Dev | `faGamepad` (solid) |
| `photography` | Photography | `faCamera` (solid) |

A project can belong to multiple categories. Velite schema enforces the enum.

**Icon library:** `@fortawesome/react-fontawesome` + `@fortawesome/free-solid-svg-icons` + `@fortawesome/free-brands-svg-icons` (for GitHub/LinkedIn/Instagram in footer). Tree-shakeable imports — never the whole library. See `UIUX.md` §7 for the full setup.

> Note: The checked-in template is currently a `react-vite-worker` template (Cloudflare Workers + React + Hono + Vite, no Next/Tailwind/Framer Motion). Next.js migration + Pages conversion + Tailwind/Framer Motion additions are part of the roadmap — see "Brainstorming" below.

---

## Repository Layout (current)

```
aaron-chu-portfolio-dev/
├── AGENTS.md                  ← this file
├── CLAUDE.md                  ← `@AGENTS.md` (Claude Code pointer)
├── README.md                  ← upstream template README
├── wrangler.json              ← Cloudflare config (currently Workers; target Pages)
├── package.json
├── vite.config.ts
├── tsconfig.{app,node,worker}.json
├── public/
└── src/
    ├── react-app/             ← React entry: App.tsx, main.tsx, index.css
    └── worker/                ← Hono Worker entry: index.ts
```

---

## CI/CD (GitHub Actions)

Two pipelines are planned:

1. **Unit / component tests** — run on every PR and push to `main`.
   - Tooling: **Jest + React Testing Library** (Vitest was dropped with Vite).
   - Must pass type-check (`tsc --noEmit`) and lint before merge.
   - Coverage threshold: **80% lines + branches, 80% functions + statements** — Jest fails the build if it drops.
2. **Playwright E2E tests** — run on every PR and push to `main`.
   - Smoke-test critical portfolio flows (home page, project index, project detail, contact form, dark mode toggle).
   - Tests run against the local `next dev` server in CI; preview deploys are also available per PR.
3. **Cloudflare Pages Git integration** — auto-build + deploy on every push to `main`. PRs get preview URLs. No `deploy.yml` needed for v1.

`.github/workflows/` is **not yet scaffolded** — workflow files are part of the CI/CD setup task.

---

## Cloudflare Account

- **Account ID**: `65cbc69e461eb925f39d60fe6490f8d1`
- **Auth user**: `aaron_powerchu@hotmail.com` (GitHub SSO)
- **MCP**: `cloudflare` MCP server is pre-authenticated; use `mcp__plugin_cloudflare_cloudflare-api__execute` for direct REST calls and `mcp__plugin_cloudflare_cloudflare-bindings__*` for KV/D1/R2/Hyperdrive provisioning.
- **Current Cloudflare resources**: none provisioned for this project yet (no Pages projects, no Workers, no D1, no KV, no R2).

When creating Cloudflare resources, prefer the Wrangler CLI or `wrangler.json`/`wrangler.jsonc` config over imperative API calls — Wrangler is the source of truth and the GitHub Actions deploy step will use it.

---

## Conventions for Contributors & Agents

- **TypeScript strict** — no `any` unless explicitly justified with a comment.
- **Prefer edge-native primitives** — when adding data/storage, default to Cloudflare products (D1, KV, R2, Vectorize) over external services.
- **No secrets in commits** — use `wrangler secret put` (or `.dev.vars` for local dev), never hardcode.
- **Branch protection** on `main` — keep CI green; squash-merge PRs.

---

## Open Questions (to resolve in brainstorming)

> All resolved. See `docs/superpowers/specs/2026-08-16-portfolio-stack-design.md` for the full design.

1. **Next.js ↔ Workers/Pages** — ✅ Next.js on Cloudflare Pages via OpenNext.
2. **Vite alongside Next** — ✅ Vite dropped entirely. Jest + RTL replaces Vitest; Turbopack handles build.
3. **Hono's role** — ✅ Mounted at `app/api/[...route]/route.ts`; Hono owns routing, validation, middleware, error formatting.
4. **Content source** — ✅ Hand-curated MDX via Velite (Zod-typed schemas). **Structured metadata** (no case study MDX narrative).
5. **Contact form backend** — ✅ Workers Email routing + Resend + Turnstile.
6. **Database + file storage** — ✅ Cloudflare only. R2 (10 GB free, no egress) for media; KV for view counters; D1 available for structured data. Supabase rejected (1 GB free, 7-day inactivity pause, wrong trade-off).
7. **Visual register** — ✅ Minimalist (research-driven), terracotta `#DF6C4F` accent.
8. **Visual effects** — ✅ PixiJS 7 + WebGL2 for subtle gradients, ambient noise, hero displacement. Minimal-but-strong parallax (24px Y-offset, mouse-follow at 0.04 intensity, slow drift shapes).
9. **Project structure** — ✅ Standard projects list (no case study MDX narrative). Detail page = metadata + media.
10. **Multi-discipline categorization** — ✅ 5 categories: full-stack / ai / graphic-design / game-dev / photography. Filter chips on `/projects`, URL-synced.
11. **Coverage gate** — ✅ 80% lines + branches.
12. **Domain** — ✅ `aaronchu.cc` (media subdomain `media.aaronchu.cc` → R2).

---

## Brainstorming

When the user signals the start of a new phase, invoke the `superpowers:brainstorming` skill before proposing any implementation. Do not write code against the open questions above until brainstorming lands the answers.
