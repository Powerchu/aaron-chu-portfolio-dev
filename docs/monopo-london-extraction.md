# Monopo.london — Technical Extraction

Source: Live DOM/CSS/JS inspection on 2026-08-20 via Chrome DevTools MCP.
Framework: Nuxt 3, PixiJS 7, Lenis, Prismic CMS, Roobert font.

---

## 1. Navigation HTML

The site has **two `<header>` elements** (one absolute over the hero, one relative for the navigation/scrolled state). Switched via `is-index` / `is-navigation` modifiers.

```html
<!-- HEADER 1: absolute, fades in over hero -->
<header class="c-Header">
  <div class="c-Header-container container is-page-ready">
    <div class="c-Header-content row">
      <div class="col-6of24 col-sm-6of12">
        <a href="/" class="c-Header-logo t-link" aria-current="page">
          <svg xmlns="http://www.w3.org/2000/svg" width="158" height="27.81" viewBox="0 0 926.2 163" class="c-Header-logo-svg">
            <!-- "monopo" wordmark -->
            <path d="M3 51.3h10.8c1.7 0 3 1.3 3 3v5.5c3.2-5.5 9-9.5..."></path>
            <!-- "london" wordmark (Roobert rendered as SVG paths) -->
            <path d="M642.1 50.3h7v62.4h-7V50.3zM662.9 90.6..."></path>
            <!-- vertical separator bar -->
            <path d="M559.3 0h2v163h-2z"></path>
          </svg>
        </a>
      </div>

      <div class="c-Header-inner col-16of24 col-sm-12of12">
        <div class="row">
          <div class="c-Header-menu col-10of16 col-sm-12of12">
            <div class="row">
              <!-- Column 1: Home / Work / Services -->
              <div class="col-4of10 col-sm-12of12">
                <ul class="c-Header-nav t-list t-h6">
                  <li><a href="/" class="c-Header-nav-link c-Header-nav-link--main t-link" aria-current="page">Home</a></li>
                  <li><a href="/work" class="c-Header-nav-link c-Header-nav-link--main t-link">Work</a></li>
                  <li><a href="/services" class="c-Header-nav-link c-Header-nav-link--main t-link">Services</a></li>
                </ul>
              </div>
              <!-- Column 2: team / contact / PRESS & NEWS -->
              <div class="col-4of10 offset-2of10 col-sm-12of12 offset-sm-0">
                <ul class="c-Header-nav c-Header-nav--alt t-list t-h6">
                  <li><a href="/team" class="c-Header-nav-link c-Header-nav-link--main t-link">team</a></li>
                  <li><a href="/contact" class="c-Header-nav-link c-Header-nav-link--main t-link">contact</a></li>
                  <li><a href="/press" class="c-Header-nav-link c-Header-nav-link--main t-link"><span>PRESS &amp; NEWS</span></a></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Live clocks for global offices -->
          <div class="c-Header-clocks col-4of16 offset-2of16 col-sm-12of12 offset-sm-0">
            <img src="/footer-circles.svg" alt="" width="36" height="18" class="c-Header-clocks-img">
            <ul class="c-Header-nav t-list t-h6">
              <li><a href="/" class="c-Header-nav-link t-link is-active">07:28 AM</a></li>
              <li><a href="https://monopo.co.jp/" target="_blank" class="c-Header-nav-link t-link">03:28 PM</a></li>
              <li><a href="https://monopo.nyc/" target="_blank" class="c-Header-nav-link t-link">02:28 AM</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="col-2of24 col-sm-6of12">
        <button type="button" class="c-Header-burger t-btn t-h6 t-h6--spacing">
          <span class="c-Header-burger-label">Menu</span>
          <span class="c-Header-burger-icon">
            <span class="c-Header-burger-icon-line"></span>
            <span class="c-Header-burger-icon-line"></span>
            <span class="c-Header-burger-icon-line"></span>
          </span>
        </button>
      </div>
    </div>
  </div>
</header>

<!-- HEADER 2: relative, white background, black text — for inner pages -->
<header class="c-Header is-navigation">
  ...
</header>
```

### Structural notes
- **Grid system**: 24 columns desktop, 12 columns small (`col-sm-*`)
- **Logo**: inline SVG, 3 paths (monopo wordmark + london wordmark + `|` separator at `x=559.3`)
- **Nav is split into 2 columns** with offset 2/10 — 6 items total, 3 in each column
- **Live clocks**: a Ruby/JS computed text, each link targets the sister office site
- **Bullet markers** (▶) are NOT in HTML — they are CSS `::before` triangles that fade in on hover
- **Burger button**: 3 `<span>` lines that animate to an X on `is-active` state

---

## 2. Navigation CSS

### Custom easing curve (used everywhere)
```css
transition: transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.4s;
```
Custom Bezier — starts fast, hard stop. Snappy, not bouncy.

### PixiJS canvas
```css
.c-PixiApp-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  pointer-events: none;  /* clicks pass through to HTML */
}
.is-touch .c-PixiApp-canvas { display: none; }  /* disabled on touch */
```

### Header positioning
```css
.c-Header { position: absolute; top: 0; left: 0; width: 100%; }
.c-Header.is-navigation { position: relative; }
.c-Header-container { padding-top: 35px; }
.is-navigation .c-Header-container {
  background: white;
  color: black;
  padding-top: 50px;
  padding-bottom: 100px;
}
.is-index .c-Header-container { transform: translateY(-100%); }
.is-index .c-Header-container.is-page-ready {
  transform: translateZ(0);
  transition: transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) 0.4s;
}
```

### Nav link with bullet triangle
```css
.c-Header-nav li { margin-top: 16px; }
.c-Header-nav li:first-child { margin-top: 0; }
.c-Header-nav-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  transform: translateZ(0);
  transition: opacity 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.c-Header-nav-link::before {
  content: "";
  display: inline-block;
  height: 0;
  width: 0;
  border-top: 3px solid transparent;
  border-bottom: 3px solid transparent;
  border-left: 5px solid;  /* CSS triangle bullet */
  margin-right: 7px;
  opacity: 0;
  transform: translateZ(0);
  transition: opacity 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.c-Header-nav-link.is-active,
.c-Header-nav-link.is-active::before,
.c-Header-nav-link.nuxt-link-exact-active,
.c-Header-nav-link.nuxt-link-exact-active::before,
.c-Header-nav-link:hover,
.c-Header-nav-link:hover::before {
  opacity: 1;  /* bullet fades in on hover/active */
}
```

### Burger animation (3 lines → X)
```css
.c-Header-burger-icon-line {
  position: absolute;
  top: 0;
  height: 100%;
  width: 1px;  /* tall thin vertical line */
  background: currentcolor;
  transform: translateZ(0);
  transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.c-Header-burger-icon-line:first-child { left: 0; }
.c-Header-burger-icon-line:nth-child(2) { right: 0; }
.c-Header-burger-icon-line:nth-child(3) { right: 7px; }

.c-Header.is-active .c-Header-burger-icon-line:first-child {
  transform: translateX(18px) rotate(45deg);
}
.c-Header.is-active .c-Header-burger-icon-line:nth-child(2) {
  transform: translateX(-19px) rotate(-45deg);
}
.c-Header.is-active .c-Header-burger-icon-line:nth-child(3) {
  opacity: 0;
}
```

### Typography scale (fluid with floor)
```css
.t-h1, .t-wysiwyg h1 {
  font-size: max(5.98958vw, 47px);     /* huge hero */
  font-family: Roobert, Helvetica, Roboto, Arial, sans-serif;
  line-height: 0.934;                   /* very tight leading */
  font-weight: 400;
}
.t-h2, .t-wysiwyg h2 {
  font-size: max(3.125vw, 25px);
  font-weight: 400;
  line-height: 1.087;
}
.t-h3 {
  font-size: max(2.34375vw, 24px);
  font-weight: 400;
  line-height: 1.2;
}
.t-h4, .t-wysiwyg h3 {
  font-size: max(1.82292vw, 23px);
  font-weight: 400;
  line-height: 1.114;
  text-transform: uppercase;
}
.t-h5, .t-wysiwyg h4 {
  font-size: max(1.5625vw, 18px);
  font-weight: 400;
  line-height: 1.16;
}
.t-h6, .t-link-tertiary {              /* nav links */
  font-size: max(0.677083vw, 12px);
  font-weight: 800;                     /* extra bold for nav */
  line-height: 1.23;
  text-transform: uppercase;
}
.t-h6--spacing { letter-spacing: 0.15em; }
.t-h1--jp { font-family: "Noto Sans CJK JP", ...; }
```

### Link variants
```css
.t-link, .t-link-default, .t-link-primary, .t-link-secondary, .t-link-tertiary {
  color: inherit; cursor: pointer; text-decoration: none; outline: 0;
}
.t-link-primary {
  position: relative;
  text-transform: uppercase;
  font-size: max(0.677083vw, 12px);
}
.t-link-secondary {
  font-weight: 800;
  position: relative;
  display: inline-block;
}
.t-link-secondary[target="_blank"]::after {
  content: "↗";   /* arrow indicator for external links */
  margin-left: 5px;
  display: inline-block;
}
```

---

## 3. PixiJS Shader — Bulge / Pinch Filter

```glsl
// Vertex
precision highp float;
#define SHADER_NAME pixi-shader-3
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;
uniform mat3 projectionMatrix;
varying vec2 vTextureCoord;

void main(void) {
  gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
  vTextureCoord = aTextureCoord;
}
```

```glsl
// Fragment
precision mediump float;
#define SHADER_NAME pixi-shader-3
uniform float radius;        // bulge radius in pixels
uniform float strength;      // positive=bulge out, negative=pinch in
uniform vec2 center;         // proportional (0.5 = viewport center)
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

uniform vec4 filterArea;     // viewport size (xy) + clamping (zw)
uniform vec4 filterClamp;    // texture bounds
uniform vec2 dimensions;     // viewport px

void main() {
  vec2 coord = vTextureCoord * filterArea.xy;
  coord -= center * dimensions.xy;
  float distance = length(coord);
  if (distance < radius) {
    float percent = distance / radius;
    if (strength > 0.0) {
      coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);
    } else {
      coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);
    }
  }
  coord += center * dimensions.xy;
  coord /= filterArea.xy;
  vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);
  vec4 color = texture2D(uSampler, clampedCoord);
  if (coord != clampedCoord) {
    color *= max(0.0, 1.0 - length(coord - clampedCoord));
  }
  gl_FragColor = color;
}
```

### Live uniform values (at rest)
```js
{
  dimensions: <Float32Array>,  // viewport dimensions
  center: [0.5, 0.5],          // center of viewport
  radius: 960,                 // pixels — large radius
  strength: 0,                 // 0 at rest — disabled (no displacement)
  uSampler: <pixi texture>,
  filterGlobals: <pixi scope>,
  globals: <pixi scope>
}
```

`strength: 0` means **the filter is dormant at rest** — only kicks in when scroll/mouse adds a positive or negative value. This is the secret of the "calm" default state.

---

## 4. PixiJS Scene Tree

```
canvas.c-PixiApp-canvas (2880×1800 actual, 1440×900 css, 2× DPR)
└── div.c-PixiApp
    ├── containerBg (Container, full-screen)
    │   └── child[0] Sprite (1440×900, white tint) ← base black backdrop
    └── container (Container, 6 children)
        ├── [0] Graphics (500×844, alpha=0, has shader)   ← overlay
        ├── [1] Sprite (4×3 white texture, scaled huge)   ← blob 1
        ├── [2] Sprite (4×3 white texture, scaled huge)   ← blob 2
        ├── [3] Sprite (4×3 white texture, scaled huge)   ← blob 3
        ├── [4] Sprite (4×3 white texture, scaled huge)   ← blob 4
        └── [5] Container (704×1760 at y=1046)            ← recent work content
            └── 5 child Containers, each 704×440        ← 5 project rows
```

### How the gradient effect is built (no custom shader on the gradient itself!)
1. **4 small sprites** share a single 4×3 white texture (a tiny white square)
2. Each sprite is **scaled huge** (cover the viewport) and **tinted a different color** at runtime
3. The 4 tinted sprites move slowly each frame (drift animation)
4. The result is composited through the **bulgePinchFilter** (with strength=0 by default — only warps when scroll/mouse activates)
5. The result is rendered into the fixed full-viewport canvas behind the HTML

This is the **cheapest way to get an animated gradient mesh** — no shaders, just 4 huge tinted sprites with smooth movement.

---

## 5. CSS Architecture Style

- **BEM naming**: `.c-Header-nav-link`, `.c-Header-nav-link--main`, `.t-h6`, `.t-link-secondary`
- **No CSS variables** (`:root` and `body` have no `--*` custom properties) — all values hardcoded
- **All CSS is inline** in `<style>` tags (Nuxt SSR + component-scoped styles), no external stylesheets
- **1,118 rules** in the main stylesheet alone
- **Fluid typography** with `max(viewport-units, minimum-px)` for floor
- **Transition easing** is consistently `cubic-bezier(0.165, 0.84, 0.44, 1)` — custom curve
- **Page-aware classes** on `<body>`: `is-index`, `is-work`, `is-team`, `is-services`, `is-press`, `is-policy`, `is-work-slug` — used to scope styles per page type
