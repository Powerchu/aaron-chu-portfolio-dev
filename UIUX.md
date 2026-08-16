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

These rules are enforced in code review and verified in CI. Every task that ships UI must satisfy them.

### Color contrast (WCAG 2.1 AA + AAA where noted)

| Pair | Ratio | Status |
|---|---|---|
| `#0A0A0A` on `#FAFAFA` (primary text on bg, light) | ~17:1 | AAA pass |
| `#FAFAFA` on `#0A0A0A` (primary text on bg, dark) | ~17:1 | AAA pass |
| `#737373` on `#FAFAFA` (muted text on bg, light) | ~4.6:1 | AA pass |
| `#A3A3A3` on `#0A0A0A` (muted text on bg, dark) | ~8:1 | AAA pass |
| `#DF6C4F` (terracotta) on `#FAFAFA` (light bg) | ~3.4:1 | **AA Large text + non-text UI only.** ❌ Never for body copy under 18pt. |
| `#DF6C4F` (terracotta) on `#0A0A0A` (dark bg) | ~3.5:1 | **AA Large text + non-text UI only.** ❌ Same restriction. |

**Where terracotta is allowed:**
- ✅ Display headings ≥18pt regular or ≥14pt bold
- ✅ Buttons, focus rings, link underlines
- ✅ Category chip borders, divider accents
- ✅ Icon strokes on hover

**Where terracotta is forbidden:**
- ❌ Body text smaller than 18pt
- ❌ Form labels
- ❌ Muted UI text (timestamps, captions)

### Touch targets (WCAG 2.2 AA — `web-target-size`)

- **All interactive elements ≥ 24×24 CSS px** (WCAG 2.2 minimum).
- **Buttons and primary actions ≥ 44×44 CSS px** (Apple HIG/Material baseline — what we hold ourselves to).
- **Touch spacing**: minimum 8px between adjacent tap targets.
- Implementation: every `<button>`, `<a>`, and clickable card in shadcn/ui gets `min-h-[44px]` or padded wrapper. `<ThemeToggle>` is the smallest icon-only button — wrap in `p-2` for a 36×36 hit area, or upgrade to `min-h-[44px] min-w-[44px]`.

### Focus appearance (WCAG 2.2 AAA)

- **Visible focus ring** on every focusable element: `focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg`.
- **Focus indicator area** ≥ 3:1 contrast against adjacent surface. The terracotta ring on `#FAFAFA` is ~3.4:1 — passes.
- **Focus indicator never removed** — `outline-none` is banned unless replaced by an explicit ring/underline.
- **Focus-not-obscured (WCAG 2.2 AA)**: sticky UI must not hide the focused element. Set `html { scroll-padding-top: 80px }` (header height + buffer) so programmatic focus scrolls into view, not under the sticky Header.

### Heading hierarchy

- **One `<h1>` per page** (the page title; not the site name).
- **Sequential nesting**: `<h2>` after `<h1>`, `<h3>` after `<h2>`. Never skip levels (`<h1>` → `<h3>` is a defect).
- Decorative section labels are `<p>` or `<span>` with uppercase + tracking, NOT headings.

### Skip-to-content

- `<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg">Skip to content</a>`
- First child of `<body>` in `app/layout.tsx`.
- `<main id="main">` wraps page content.

### Forms (WCAG 3.3.1)

- **Visible labels for every field** — never placeholder-only. `<label for="email">` associated to `<input id="email" name="email">`.
- **Inline error messages** tied to their field via `aria-describedby` AND `aria-invalid="true"` when validation fails.
- **Error summary** at the top of the form on submit failure (one focusable element listing all errors with links to each field).
- **Success state** uses an ARIA live region (`<div role="status" aria-live="polite">`) so screen readers announce it without moving focus.
- The Turnstile widget is invisible by default (no extra UI) — verify it doesn't introduce unlabeled controls.

### Reduced motion (WCAG 2.3.3)

- **CSS-level kill switch** in `globals.css` (already present):
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- **JS-level** via framer-motion's `useReducedMotion()` — every motion primitive (`FadeIn`, `ScrollReveal`, `Stagger`, `ParallaxY`, `ParallaxMouse`, `DriftShape`) must call it and skip animation when true.
- **PixiJS effects** detect reduced motion in `components/effects/*` and render a single static frame instead of starting the ticker loop (already implemented).
- **Smooth scroll** (if added later via Lenis or `scroll-behavior: smooth`) must degrade to instant scroll on reduced motion.

### Keyboard navigation

- **Tab order matches visual order** — never reorder with `tabindex` positive values.
- **Modal/Sheet focus trap**: shadcn/ui's `<Sheet>` handles focus trapping automatically; verify ESC closes.
- **Theme toggle** is reachable by Tab and operable with Enter/Space (default `<button>` behavior).
- **Skip links** appear before navigation in the tab order (see Skip-to-content above).

### Screen reader / VoiceOver

- **Icon-only buttons have `aria-label`** (already implemented on `<ThemeToggle>` — apply to all icon controls including CategoryChip if it becomes icon-only).
- **Decorative icons** beside visible text are `aria-hidden="true"` (Font Awesome icons inherit this when the button has a text label).
- **Image alt text**: meaningful images use descriptive `alt`; decorative images use empty `alt=""`. Project hero gets `<Image alt={project.title} />` — already implemented.
- **Live regions** for form success/error (see Forms above).
- **PixiJS canvases** are decorative — `aria-hidden="true"` (already implemented).

### Color is never the only indicator

- Category chips use **border + text label + icon**, never color alone.
- Featured projects should add a non-color marker (a `FEATURED` badge or a star icon) — currently relies on positioning only.
- Hover states change multiple properties (color + scale OR color + underline), not color alone.
- Error states use icon + text + color (the field's red border AND the error message AND a warning icon).

### Dynamic text size (WCAG 1.4.4)

- **Body type in rem units** (already `text-base` → 1rem). Avoid fixed `px` for body copy.
- **Layout must not break at 200% zoom** — verify by zooming browser to 200% and confirming nothing overflows or hides.
- **`overflow-wrap: anywhere`** on URLs and long tokens in MDX content.

### Loading & async feedback

- **Form submission shows a loading state** — button disabled with spinner while `/api/contact` is in flight.
- **No loading spinners for SSG-rendered pages** — instant load is the goal.
- **PixiJS effect loads are progressive**: page renders without effects first, then effects mount and animate in. No spinners needed (effects mount in <100ms).

### Sticky UI and overlays

- **Header doesn't hide focused elements** — see focus-not-obscured above.
- **Mobile Sheet nav** traps focus and returns focus to the trigger on close.
- **Footer CTA** is reachable by keyboard.

### Authentication (N/A for portfolio, but listed for completeness)

- No login/auth in v1. If added later: paste-friendly, password-manager-friendly, no cognitive-only challenge.

---

## 11. Design tokens

Concrete, locked values for spacing, animation timing, icon sizing, borders, and shadows. Every component derives its values from these — no per-component magic numbers.

### Spacing rhythm (8px base)

| Token | px | Use for |
|---|---|---|
| `space-1` | 4 | Hairline gaps |
| `space-2` | 8 | Inline icon-to-text gap |
| `space-3` | 12 | Card internal padding (compact) |
| `space-4` | 16 | Card internal padding (default) |
| `space-6` | 24 | Section gaps within a page |
| `space-8` | 32 | Section gaps between sections |
| `space-12` | 48 | Page-level vertical rhythm |
| `space-16` | 64 | Hero top/bottom padding |
| `space-24` | 96 | Major page divisions (hero → content) |

Tailwind defaults already cover this (`p-4`, `gap-6`, `py-24`, etc.) — this section just names the intent.

### Animation timing

| Token | Duration | Use for |
|---|---|---|
| `motion-fast` | 150ms | Hover state, theme toggle, button press |
| `motion-base` | 250ms | Color transitions, dropdown menus |
| `motion-slow` | 400ms | Page entrance, modal open |
| `motion-slower` | 500ms | **Max** — anything longer feels sluggish |
| `motion-ease-out` | `[0.22, 1, 0.36, 1]` | Entrance / arrival (decelerate) |
| `motion-ease-in` | `[0.64, 0, 0.78, 0]` | Exit (accelerate away) |
| `motion-spring` | damping 30, stiffness 200 | Mouse-follow, drag |

### Icon sizes

| Token | Class | Use for |
|---|---|---|
| `icon-xs` | `h-4 w-4` | Inline with body text (16px) |
| `icon-sm` | `h-5 w-5` | Buttons, badges (20px) |
| `icon-md` | `h-6 w-6` | Nav, social links (24px) |
| `icon-lg` | `h-10 w-10` | Category strip (40px) |
| `icon-xl` | `h-12 w-12` | Hero disciplines, feature blocks (48px) |

Use Font Awesome's `className="h-X w-X"` consistently. Never mix `h-[18px]` and `h-5`.

### Border radius

| Token | Value | Use for |
|---|---|---|
| `radius-sm` | 4px | Tags, badges, small UI |
| `radius-md` | 8px | Buttons, inputs |
| `radius-lg` | 12px | Cards, large containers |
| `radius-full` | 9999px | Pills, circular icons, avatars |

### Borders

| Token | Value | Use for |
|---|---|---|
| `border-hairline` | 1px solid `border` | Default dividers |
| `border-prominent` | 2px solid `accent` | Focus rings, hover outlines |
| `border-card` | 1px solid `border` | Card containers |

### Shadows

Minimalist palette uses **no shadows** by default. Elevation is communicated by borders + background contrast. Exception:
- **Modal/Sheet scrim**: `bg-black/40 backdrop-blur-sm`
- **Sticky header**: `bg-bg/80 backdrop-blur-md` + 1px border-bottom

### Hover patterns (canonical)

| Element | Hover | Active |
|---|---|---|
| Card | `scale(1 → 1.02)` + hero zoom | `scale(0.99)` |
| Link | underline grows from left `scaleX(0 → 1)`, terracotta | same |
| Button | `bg-accent/90` | `bg-accent/80` |
| Icon button | `bg-fg/5` ring | `bg-fg/10` |
| Nav link | `bg-fg/5` + `text-fg` (from `text-fg/80`) | same |

All hover transitions: `150ms ease-out`. Active state: `100ms`.

---

## 12. Tools & references used

- **Monopo London** (live, https://monopo.london/) — primary reference, screenshots in `.claude/monopo-screenshots/`
- **Research reports** (already in `~/Downloads/inbox/`):
  - `Research_report_Minimalist_Developer_Portfolio_UIUX_Design__.md`
  - `Research_report_Elite_Portfolio_Design_Examples_and_Inspirat.md`
- **Inspiration galleries** (per the research): Minimal Gallery, Dead Simple Sites, Gallereee, Awwwards, CSS Design Awards
- **Component libraries**: shadcn/ui (selected primitives)
- **Motion**: framer-motion
- **Typography**: Inter Tight + Inter (variable, self-hosted via `next/font`)

---

## 13. Open questions (visual scope)

- [ ] Custom underline-on-link animation? (Default yes; terracotta, 200ms)
- [ ] Theme toggle position — header icon only, or also a footer reset?
- [ ] Project hero — image-only or image + title overlay?
- [ ] Mobile nav — Sheet (slide-in) or full-screen overlay?
- [ ] PixiJS — same gradient mesh across all pages, or page-specific palettes?
- [ ] Parallax on category strip — drift on hover, or on scroll?
- [ ] Photography projects — separate `/photography` page or share `/projects`?

These are small enough to settle during implementation. Nothing here blocks writing the spec.

---

## 14. Workflow: adding a project

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
