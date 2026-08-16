# UIUX.md

UI/UX reference for the Aaron Chu developer portfolio. Documents the chosen visual system, the design references that informed it, and the patterns we deliberately include or exclude.

> **Source-of-truth layering**
> - `AGENTS.md` — project memory for any AI agent
> - `CLAUDE.md` — `@AGENTS.md` (Claude Code pointer)
> - `docs/superpowers/specs/2026-08-16-portfolio-stack-design.md` — full architecture + tech decisions
> - **`UIUX.md` (this file)** — visual system, design references, what we borrow / skip / adapt

---

## 1. Visual North Star

A research-driven minimalist portfolio drawing from the same family as **Monopo London**, **Cassie Codes**, **Brittany Chiang**, and editorial design — but stripped to essentials: case studies + experience + contact, served instantly, no flourish.

**Three rules:**

1. **Content first.** Every visual decision serves the case studies. If a chrome element doesn't help a recruiter understand your work, cut it.
2. **Typography carries the hierarchy.** Two weights only (400 regular, 800 bold). Two colors only (#000, #FFF) plus one accent (`#DF6C4F`).
3. **Motion is felt, not seen.** Subtle entrance fades, soft hover lift, smooth scroll. No custom cursor, no WebGL overlays, no parallax theatrics.

---

## 2. Reference Site — Monopo London

Screenshots and source notes captured via Chrome DevTools on 2026-08-16. All screenshots saved to `.claude/monopo-screenshots/`.

### Tech stack detected

| Layer | What Monopo uses | What we use instead | Rationale |
|---|---|---|---|
| Framework | **Nuxt 3** (Vue, SSR) | **Next.js** + OpenNext | Already decided; both deliver SSR + SSG |
| CMS | **Prismic** (headless) | **Velite** (local MDX) | We chose type-safe local files over a managed CMS |
| Fonts | **Roobert** (custom geometric sans, 400/600/800) | **Inter Tight** + **Inter** (variable) | Free, self-hosted, similar feel |
| Smooth scroll | **Lenis** | **Lenis** (or `framer-motion` `useScroll`) | Pin the feel, swap the lib |
| Image transitions | **PixiJS 6.2.0 + WebGL2** (displacement maps `lense.png` / `displace.png`) | **None — static `<Image>`** | We deliberately skip WebGL (out of "minimalist" scope) |
| Custom cursor | **Stateful SVG cursor** (case / project / discover variants) | **Default cursor + subtle CSS hover** | We deliberately skip custom cursor (out of scope) |
| Layout engine | **24-column grid** (`.row` + `.col-Xof24` utilities) | **12-column Tailwind grid** + **`max-w-prose 68ch`** for long-form body | Slightly tighter than Monopo for single-author scale |
| Analytics | Google Analytics (with cookie consent) | **Cloudflare Web Analytics** (no cookies) | Privacy-first, GDPR-clean |

### Monopo's visual identity (what we can learn from)

#### Palette
**Monopo uses only two colors in the visible viewport: `#000` and `#FFF`.** That's it. No gray, no accent. The *severity* of the B/W contrast is the entire visual identity.

**Our adaptation:** we keep B/W as the foundation (`#0A0A0A` / `#FAFAFA` for dark/light mode) but add **one** accent — terracotta `#DF6C4F` — for actionable elements (CTAs, links, focus rings). This is one color more than Monopo but still inside the "extreme minimalism" envelope.

#### Typography
Monopo's type system is striking for its restraint:

| Element | Size | Weight | Transform | Notes |
|---|---|---|---|---|
| Hero H1 (intro) | 85.35 px (calc'd, scales with vw) | **400 regular** | none | "We are a brand / of collective / creativity" — broken into 3 lines |
| Project title H3 | 33.40 px | **400 regular** | UPPERCASE | "ONITSUKA TIGER ‣ FINISH LINE CAFE — POP-UP" |
| Footer CTA H4 | 44.53 px | **400 regular** | UPPERCASE | "WE WOULD LOVE TO HEAR FROM YOU." |
| Micro-label H5 | 12 px | **800 bold** | UPPERCASE | "OUR ADDRESS", "FOLLOW US", category tags |
| Nav link | 12 px | **800 bold** | UPPERCASE | HOME / WORK / SERVICES |
| Body subtitle | 17 px | **400 regular** | none | "Based in London / Born in Tokyo" |
| Font family | **Roobert** (400/600/800) | | | Geometric, custom. |

**The pattern:** display = regular weight only. UI labels = bold only. No medium weights. No italic in hero or titles. Line-height tightens as size grows: 17px → 1.15, 33px → ~1.0, 85px → 0.93.

**Our adaptation:** translate the *system* (display/UI two-weight split) onto our font choice:

| Element | Monopo | Ours |
|---|---|---|
| Display font | Roobert | **Inter Tight** (variable, `8–12vw` hero) |
| Body font | Roobert | **Inter** (variable, 16 px) |
| Mono font | (none used on home) | **JetBrains Mono** (tech tags, code) |
| Hero weight | 400 regular | **400 regular** (Inter Tight) |
| UI label weight | 800 bold | **800 bold** (Inter) |
| Project title | 33 px uppercase | **32–40 px** (clamp from 32 to 40), weight 400, uppercase via Tailwind `uppercase`, tracking `0.02em` for legibility at small sizes |
| Footer CTA | 44 px uppercase | **`text-4xl md:text-5xl`** weight 400 |
| Line-height ratio | hero: 0.93, body: 1.15 | **hero `leading-[0.95]`, body `leading-relaxed` (1.6)**, project `leading-tight` (1.1) |

#### Layout

Monopo uses **24-column** grid with `col-Xof24` and `col-sm-Xof12`. Padding is **`0 56.16px`** on container (no max-width — full bleed).

**Our adaptation:** Tailwind's default 12-column grid for project card rows; **`max-w-prose 68ch (~920px)`** for single-column long-form body (About page). Horizontal page padding `px-6 md:px-12 lg:px-16`.

#### Information density per scroll

Each project occupies a **full viewport height** (`100vh`) — Monopo doesn't use a card grid. The scroll becomes a narrative, one project at a time, with smooth scroll via Lenis.

**Our adaptation:** we use a card grid on `/projects` (most discoverable for recruiters scanning a list) and a focused layout on the individual `/projects/[slug]` page (the detail view). This gives recruiters the *scan view* first and the *deep view* second — different intents, different layouts.

---

## 3. What we deliberately skip from Monopo's playbook

| Pattern | Monopo does | We skip | Why |
|---|---|---|---|
| **PixiJS WebGL image transitions** | Yes (canvas overlay, displacement masks) | **Adapted** — keep PixiJS but with subtler effects (gradient mesh, ambient noise, hero displacement). See §11 below. |
| **Custom cursor** | Yes (case / project / discover variants) | No | Recruiters use system cursors; mobile has no cursor. Custom cursors date a site instantly. |
| **Stateful "scroll-narrative" with sticky-stacking projects** | Yes (each project = 100vh) | Partial — list page is grid; detail page is full-bleed | Linear scroll narratives optimize for designers browsing art; recruiters scan a list. We optimize for scan-then-deep. |
| **Cookie consent banner** | Yes (uses GA) | **No** (Cloudflare Web Analytics is cookie-free) | GDPR is a cleaner default. |
| **Multi-timezone clocks in nav** | Yes (Tokyo / London / NYC) | No (single-user portfolio) | Solo portfolio doesn't need global presence signaling. |
| **Footer column with company / VAT info** | Yes | **No** | Not relevant for a personal portfolio. |
| **Numeric "Vite" CSS framework** | Uses Webflow-style utility classes (c-/t-/js-) | **Tailwind v4** | Tailwind is the modern default and pairs with shadcn/ui. |
| **Full-bleed case-study narrative per project** | Yes (sticky-scroll narrative per project) | **No** — standard list view with filter chips | A multi-disciplinary portfolio needs breadth, not depth-per-project. A list shows volume; a case study shows deep thinking. We choose list. |

---

## 4. What we keep and adapt

| Monopo pattern | Our adaptation |
|---|---|
| Hero as typographic sculpture (3 lines, oversized) | **Yes, adapted** — a 2- or 3-line hero, oversized (`text-7xl md:text-8xl`, weight 400, Inter Tight). For a personal portfolio: "Hi, I'm Aaron Chu. / I build software / at the edge." |
| Two-color discipline + one optional accent | **Yes, adapted** — `#0A0A0A` / `#FAFAFA` base + `#DF6C4F` terracotta accent (CTAs, links, focus). |
| Two-weight typography (regular display, bold UI) | **Yes, kept** — Inter Tight weight 400 for display, Inter weight 800 (or 600) for nav/micro-labels. Never mix. |
| UPPERCASE micro-labels (12 px bold) | **Yes, kept** — for nav, category tags ("BRAND DESIGN", "SPATIAL"), footer column headings. |
| Tight line-height on display, loose on body | **Yes, kept** — hero `leading-[0.95]`, project titles `leading-tight` (1.1), body `leading-relaxed` (1.6). |
| Smooth scroll via Lenis | **Adapted** — framer-motion `useScroll` + `ScrollReveal` for section reveals. Could add Lenis later if we want monolith-scroll feel. |
| Oversized display typography hierarchy | **Yes, kept** — display at `8–12vw`, project titles at 32–40 px, micro at 12 px. Spread is the hierarchy. |
| Footer as a strong CTA section | **Yes, kept** — "Let's build something" CTA above footer, terracotta button. |
| PixiJS WebGL effects (subtle) | **Yes, adapted** — Monopo's PixiJS is image-transition theatrics. Ours is gradational restraint: animated gradient mesh backgrounds, ambient film-grain noise, soft displacement on hero images. Same library, lower volume. See §11. |
| Lenis smooth scroll | **Adapted** — framer-motion `useScroll` + `useTransform` for parallax. Could swap to Lenis later if scroll feel matters more than bundle size. |
| **Parallax** | **Yes, adapted** — Monopo doesn't really use parallax (they use scroll-driven sticky instead). We add it minimally: 24px Y-offset on hero text, mouse-follow at 0.04 intensity on hero gradient, slow drift shapes in background. |

---

## 5. Concrete palette (locked)

| Token | Light mode | Dark mode |
|---|---|---|
| `bg` | `#FAFAFA` | `#0A0A0A` |
| `fg` | `#0A0A0A` | `#FAFAFA` |
| `muted` | `#737373` | `#A3A3A3` |
| `accent` | `#DF6C4F` | `#DF6C4F` |
| `accent-fg` | `#FFFFFF` | `#FFFFFF` |
| `border` | `rgba(0,0,0,0.08)` | `rgba(255,255,255,0.08)` |

**Rules:**
- Two background colors max per mode. Avoid gray backgrounds.
- Accent is *only* on actionable elements: CTAs, focus rings, active nav, hover underlines.
- Never use accent for body text or large titles.

---

## 6. Page templates (locked)

### Home `/`
- **Hero** — 2-3 line typographic statement (`text-7xl md:text-9xl`, Inter Tight, weight 400). Full viewport height on desktop, auto on mobile. PixiJS `GradientMesh` animates the background subtly; ambient noise overlays at 0.04 opacity.
- **Featured projects** — 2-3 projects, **deliberately one per discipline** to showcase breadth. Hover lifts card `1 → 1.02`. Each card shows category chip(s), title, date, tech tags.
- **Disciplines strip** — a horizontal row of 5 icons/labels (Full Stack / AI / Design / Game / Photo) with `ParallaxMouse` hover effect. Links to `/projects?category=...`.
- **About teaser** — 1-paragraph bio + "Read more →" link.
- **CTA** — "Want to work together? [Contact →]" with terracotta button.

### Projects index `/projects`
- **Page header** — title "Projects", subtitle count, optional filter chips.
- **Category filter** — chip row at the top, URL-synced via `?category=<slug>`. Chips: **All / Full Stack / AI / Design / Game Dev / Photography**. Each chip shows count. Active chip has terracotta underline; inactive chips are muted gray. Changing category transitions via `FilterTransition` (PixiJS) → CSS-only fade fallback.
- **Grid** — 1 col mobile, 2 col md, 2 col lg. Each card:
  - Hero image (or video poster if `video` set)
  - Category chip(s) — pill style, terracotta border
  - Title (large, weight 400)
  - Description (1-2 lines, muted)
  - Tech tags (small, weight 800 uppercase)
  - Date (small, muted)
- **Hover** — card lifts `scale(1 → 1.02)`, hero zooms `scale(1 → 1.04)`, terracotta underline appears on title.
- **Empty state** — "No projects in this category yet" with link back to "All".

### Project detail `/projects/[slug]`
- **Hero** — full-bleed hero image with `HeroDisplace` (PixiJS shader) applying subtle distortion that responds to scroll. Title overlay or below, category chip(s), project meta (role, company, dates, tech tags).
- **Description** — single paragraph, max-width `68ch`.
- **Optional note** — if `note` set in frontmatter, render as a callout block (single paragraph max). Not a full case study.
- **Media block** — if `video` set, render `<video>` with `poster` from `videoPoster`; if `audio` set, render `<audio>` with controls and caption; if `screenshots[]` set, render as image grid with lightbox-on-click.
- **Downloads** — if `downloads[]` set, render as a list at the bottom.
- **Links** — if `links[]` set, render as a button row (terracotta outline, rounded).
- **Footer** — "Next project →" link to the chronologically next project, "All projects" link.

### Experience `/experience`
- **Timeline** — chronological descending, role + company + dates + summary. Highlight bullets in a list. Strict baseline rhythm, minimal separators.

### About `/about`
- **Single column**, `max-w-prose 68ch`. Bio paragraph, photo (optional), contact links, social.

### Contact (via Hono `/api/contact`)
- **Form** — name, email, message, Turnstile widget (invisible). Submit shows success/error toast.
- **CTA fallback** — `mailto:aaron_powerchu@hotmail.com` link for users without JS.

---

## 7. Categories (multi-disciplinary segregation)

The portfolio needs to show **5 disciplines**: Full Stack Software Development, AI Engineering, Graphic Design, Game Development, Photography. A project can belong to one or more categories.

### Category taxonomy

| Slug | Display name | Use for | Icon (Font Awesome 7 Free) |
|---|---|---|---|
| `full-stack` | Full Stack | Web apps, SaaS, APIs, infra | `faCode` (solid) |
| `ai` | AI Engineering | AI agents, RAG, fine-tuning, MLOps | `faMicrochip` (solid) |
| `graphic-design` | Graphic Design | Logos, brand identity, posters, print | `faPalette` (solid) |
| `game-dev` | Game Dev | Indie games, prototypes, jams | `faGamepad` (solid) |
| `photography` | Photography | Photo series, exhibitions, prints | `faCamera` (solid) |

### Icon library setup

- **Packages** (only the ones we actually use — keeps the bundle tight):
  - `@fortawesome/react-fontawesome` (React component bindings)
  - `@fortawesome/fontawesome-svg-core` (core SVG engine)
  - `@fortawesome/free-solid-svg-icons` (the 5 icons above + a few others for nav/CTAs)
  - `@fortawesome/free-brands-svg-icons` (for GitHub/LinkedIn/Instagram in footer/about)
- **Skip**: `@fortawesome/free-regular-svg-icons` (not used in v1) and the Pro packages
- **Tree-shakeable imports**: always import the specific icon (`faCode`), never the whole library
- **Standard rendering**:
  ```tsx
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
  import { faCode } from '@fortawesome/free-solid-svg-icons'

  <FontAwesomeIcon icon={faCode} className="h-5 w-5" />
  ```
- **Default size**: 20px (`h-5 w-5`). 16px for inline, 24px for category chips, 32px+ for hero/discipline strip.

### Filter behavior

- URL: `/projects?category=ai` (or `?category=full-stack` etc.)
- Multiple categories in URL: `?category=ai,game-dev` (filter by any match — OR logic)
- Default: `?category=all` (no filter)
- Filter is applied server-side via searchParams; projects are SSG'd, filter is read at request time
- Empty state when category has no projects: "No projects in this category yet — see all projects →"

### Card display

- Each project card shows 1+ category chips (pill style with terracotta left border)
- Chips link to the filtered URL: `<CategoryChip category="ai" />` → `/projects?category=ai`
- Hover on a chip: terracotta solid background, white text (200ms transition)

### Home disciplines strip

- 5 segments, each with icon + label, link to filtered project list
- Hover: `ParallaxMouse` (icon drifts 4px toward cursor)
- Mobile: stack vertically as a 2-column grid

---

## 8. Motion system (Framer Motion)

We follow three rules:

1. **Every animation respects `prefers-reduced-motion`.** `useReducedMotion()` everywhere.
2. **No animation on critical content above the fold.** Hero text is visible on first paint; it doesn't fade in.
3. **No animation that exceeds 500ms.** Anything slower is annoying on a slow network.

### Primitives (`components/motion/`)

```ts
// FadeIn.tsx — entrance opacity + 12px Y
initial: { opacity: 0, y: 12 },
animate: { opacity: 1, y: 0 },
transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }

// ScrollReveal.tsx — animate once on scroll into view
initial: { opacity: 0, y: 24 },
whileInView: { opacity: 1, y: 0 },
viewport: { once: true, margin: '-80px' },
transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }

// Stagger.tsx — children with stagger delay
visible: { transition: { staggerChildren: 0.06 } }
```

### Hover patterns

- **Project cards:** scale `1 → 1.02`, `transition: transform 200ms ease-out`.
- **Links:** underline grows from left `transform: scaleX(0 → 1)`, terracotta, `200ms`.
- **Buttons:** background shifts to slightly darker accent, `150ms`.

---

## 9. Visual Effects (PixiJS + Parallax)

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

### Performance discipline

- **Lazy-load PixiJS** only when an effect component mounts (dynamic import — never in the critical path)
- **Single shared `Application` instance** per page; effects are layers, not apps
- **Cleanup on unmount**: `.destroy(true)` + remove canvas from DOM
- **Detect `prefers-reduced-motion`**: render a static frame (single `renderer.render(app.stage)` after init, never enter the ticker loop)
- **WebGL2 preferred**, WebGL1 acceptable, no-WebGL → render the static fallback (CSS gradient or image)
- **Pause on tab hidden** (`document.visibilitychange`) — saves battery
- **Cap pixel ratio** at `Math.min(window.devicePixelRatio, 2)`

### Bundle size budget

- `pixi.js` v7: ~280 KB minified+gzip (only loaded when an effect mounts)
- framer-motion: ~50 KB (already in the bundle)
- Initial page load: **zero PixiJS bytes** (effects are lazy-mounted)
- Heaviest page (home with GradientMesh + AmbientNoise + DriftShape): ~330 KB JS for effects

### Parallax defaults (locked)

| Effect | Default | Off when |
|---|---|---|
| GradientMesh hero background | enabled | `prefers-reduced-motion`, mobile viewport (<768px), no-WebGL |
| AmbientNoise overlay | enabled | `prefers-reduced-motion` |
| HeroDisplace on project detail | enabled | `prefers-reduced-motion`, mobile |
| ParallaxY | `offset: 24px`, top of viewport only | mobile (saves scroll perf), `prefers-reduced-motion` |
| ParallaxMouse | `intensity: 0.04` | mobile (no cursor), `prefers-reduced-motion` |
| DriftShape | `count: 2-3` SVG circles, slow drift | `prefers-reduced-motion` |
| FilterTransition | enabled | `prefers-reduced-motion`, no-WebGL → CSS-only fade |

### Parallax component snippets

```tsx
// components/parallax/ParallaxY.tsx — scroll-driven Y offset
const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])
return <motion.div ref={ref} style={{ y }}>{children}</motion.div>
```

```tsx
// components/parallax/ParallaxMouse.tsx — mouse-follow at low intensity
const x = useMotionValue(0)
const y = useMotionValue(0)
const springX = useSpring(x, { damping: 30, stiffness: 200 })
const moveX = useTransform(springX, [-1, 1], [-10, 10])
// mousemove handler sets x.set((e.clientX / window.innerWidth) * 2 - 1)
return <motion.div style={{ x: moveX, y: moveY }}>{children}</motion.div>
```

Reduced-motion is respected automatically by framer-motion.

---

## 10. Accessibility (non-negotiable)

---

## 11. Tools & references used

- **Monopo London** (live, https://monopo.london/) — primary reference, screenshots in `.claude/monopo-screenshots/`
- **Research reports** (already in `~/Downloads/inbox/`):
  - `Research_report_Minimalist_Developer_Portfolio_UIUX_Design__.md`
  - `Research_report_Elite_Portfolio_Design_Examples_and_Inspirat.md`
- **Inspiration galleries** (per the research): Minimal Gallery, Dead Simple Sites, Gallereee, Awwwards, CSS Design Awards
- **Component libraries**: shadcn/ui (selected primitives)
- **Motion**: framer-motion
- **Typography**: Inter Tight + Inter (variable, self-hosted via `next/font`)

---

## 12. Open questions (visual scope)

- [ ] Custom underline-on-link animation? (Default yes; terracotta, 200ms)
- [ ] Theme toggle position — header icon only, or also a footer reset?
- [ ] Project hero — image-only or image + title overlay?
- [ ] Mobile nav — Sheet (slide-in) or full-screen overlay?
- [ ] PixiJS — same gradient mesh across all pages, or page-specific palettes?
- [ ] Parallax on category strip — drift on hover, or on scroll?
- [ ] Photography projects — separate `/photography` page or share `/projects`?

These are small enough to settle during implementation. Nothing here blocks writing the spec.

---

## 13. Workflow: adding a project

```
1. Create content/projects/<slug>.mdx with frontmatter (title, slug, description, date, categories, tech, hero, links, ...)
2. Upload hero + screenshots + videos + audio + downloads to R2 bucket via `npm run media:upload -- ...`
3. Verify the metadata: categories[] has at least one entry, links[] are valid URLs, note is <500 chars if present
4. `git commit -m "feat(projects): add <slug>" && git push`
5. Cloudflare Pages auto-builds and deploys a preview URL
6. Review the preview on phone + desktop
7. Mark PR ready → merge to `main` → production deploy
```

No admin UI, no CMS, no DB. The repo *is* the content system.
