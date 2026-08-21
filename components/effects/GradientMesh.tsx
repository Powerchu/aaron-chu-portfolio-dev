'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { isWebGLSupported } from '@/lib/pixi/createApp'
import type { Application, Sprite } from 'pixi.js'

interface GradientMeshProps {
  palette?: [string, string, string]
}

/** Number of gradient sprites (4 is the Monopo sweet-spot). */
const SPRITE_COUNT = 4

/** Sprite anchor positions as viewport-fraction pairs. */
const SPRITE_POSITIONS: readonly [number, number][] = [
  [0.25, 0.35],
  [0.75, 0.35],
  [0.25, 0.65],
  [0.75, 0.65],
]

/** Per-sprite drift: [xAmplitude, yAmplitude, xPhase, yPhase, xFreq, yFreq]. */
const DRIFT_PARAMS: readonly [number, number, number, number, number, number][] = [
  [40, 25, 0, 0, 0.8, 0.6],
  [35, 30, 1.5, 0.5, 0.7, 0.9],
  [30, 35, 3.0, 1.0, 0.9, 0.7],
  [45, 20, 4.5, 1.5, 0.6, 0.8],
]

/** Crossfade duration in milliseconds. */
const CROSSFADE_DURATION = 500

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------

type Rgb = [number, number, number]

function hexToRgb(hex: string): Rgb {
  const cleaned = hex.replace('#', '')
  const num = parseInt(cleaned, 16)
  return [(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff]
}

function rgbToHex(r: number, g: number, b: number): number {
  return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b)
}

function lerpRgb(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

/** Smooth ease-in-out for crossfade. */
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function GradientMesh({ palette = ['#DF6C4F', '#0A0A0A', '#FAFAFA'] }: GradientMeshProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const paletteRef = useRef(palette)
  // CSS-only fallback state: true when WebGL is unavailable OR PixiJS init
  // throws. UIUX.md section 9 requires a static fallback in that path
  // (no console output, no blank canvas).
  const [useFallback, setUseFallback] = useState(false)

  // Keep paletteRef in sync with the prop so the ticker can read the latest value.
  useEffect(() => {
    paletteRef.current = palette
  }, [palette])

  useEffect(() => {
    if (reduced) return
    if (typeof window === 'undefined') return
    // UIUX.md: WebGL2 preferred, WebGL1 acceptable, no-WebGL → static
    // fallback. We detect support up front and flip to the CSS fallback
    // rather than rendering an empty canvas.
    if (!isWebGLSupported() || !ref.current) {
      setUseFallback(true)
      return
    }

    let cancelled = false
    let appInstance: Application | null = null

    void (async () => {
      try {
        const { createApp } = await import('@/lib/pixi/createApp')
        const { Sprite, Texture } = await import('pixi.js')

        if (cancelled || !ref.current) return

        const canvas = ref.current
        const w = window.innerWidth
        const h = window.innerHeight

        const app = await createApp({
          width: w,
          height: h,
          backgroundAlpha: 0,
          canvas,
        })
        appInstance = app

        if (cancelled) {
          app.destroy(true)
          return
        }

        // Shared white texture - tinted at runtime for gradient colours.
        // Texture.WHITE is a 1x1 white pixel; scaling it huge is the
        // cheapest way to get a coloured gradient overlay (Monopo pattern).
        const texture = Texture.WHITE

        // -- Create sprites ------------------------------------------------
        const sprites: Sprite[] = []
        const basePositions: { x: number; y: number }[] = []

        for (let i = 0; i < SPRITE_COUNT; i++) {
          const sprite = new Sprite({ texture })
          const pos = SPRITE_POSITIONS[i]!

          sprite.anchor.set(0.5)
          sprite.x = w * pos[0]
          sprite.y = h * pos[1]
          // Each sprite covers ~150 % of the viewport so edges never show.
          sprite.width = w * 1.5
          sprite.height = h * 1.5
          sprite.alpha = 0.55
          sprite.blendMode = 'add'

          basePositions.push({ x: w * pos[0], y: h * pos[1] })
          app.stage.addChild(sprite)
          sprites.push(sprite)
        }

        // -- Palette crossfade state ----------------------------------------
        let crossfadeStart = 0
        let prevPaletteRgb: Rgb[] = paletteRef.current.map(hexToRgb)
        let targetPaletteRgb: Rgb[] = paletteRef.current.map(hexToRgb)
        let currentPaletteRgb: Rgb[] = paletteRef.current.map(hexToRgb)

        // Apply initial tints.
        for (let i = 0; i < SPRITE_COUNT; i++) {
          const c = currentPaletteRgb[i % 3]!
          sprites[i]!.tint = rgbToHex(c[0], c[1], c[2])
        }

        let lastPaletteKey = paletteRef.current.join(',')

        // -- Animation loop -------------------------------------------------
        let time = 0
        app.ticker.add((ticker) => {
          time += ticker.deltaTime * 0.01

          // Detect palette change and start crossfade.
          const currentKey = paletteRef.current.join(',')
          if (currentKey !== lastPaletteKey) {
            prevPaletteRgb = currentPaletteRgb.map((c) => [...c])
            targetPaletteRgb = paletteRef.current.map(hexToRgb)
            crossfadeStart = performance.now()
            lastPaletteKey = currentKey
          }

          // Interpolate palette colours during crossfade.
          const elapsed = performance.now() - crossfadeStart
          if (elapsed < CROSSFADE_DURATION) {
            const t = Math.min(elapsed / CROSSFADE_DURATION, 1)
            const ease = easeInOutQuad(t)
            for (let c = 0; c < 3; c++) {
              currentPaletteRgb[c] = lerpRgb(prevPaletteRgb[c]!, targetPaletteRgb[c]!, ease)
            }
          } else if (lastPaletteKey !== paletteRef.current.join(',')) {
            // Crossfade finished - snap to target.
            currentPaletteRgb = targetPaletteRgb.map((c) => [...c])
          }

          // Apply tints and sinusoidal drift.
          for (let i = 0; i < SPRITE_COUNT; i++) {
            const c = currentPaletteRgb[i % 3]!
            sprites[i]!.tint = rgbToHex(c[0], c[1], c[2])

            const d = DRIFT_PARAMS[i]!
            sprites[i]!.x = basePositions[i]!.x + Math.sin(time * d[4] + d[2]) * d[0]
            sprites[i]!.y = basePositions[i]!.y + Math.cos(time * d[5] + d[3]) * d[1]
          }
        })
      } catch {
        // PixiJS init failed (context lost, GPU blocked, etc.). Fall back
        // to the CSS gradient below. Per UIUX.md, no console output here.
        setUseFallback(true)
        // Clean up the half-initialised app if it exists.
        if (appInstance) {
          try { appInstance.destroy(true) } catch { /* ignore */ }
          appInstance = null
        }
      }
    })()

    return () => {
      cancelled = true
      if (appInstance) {
        try {
          appInstance.destroy(true)
        } catch {
          // Ignore cleanup errors
        }
      }
    }
    // palette changes are handled via paletteRef + ticker, no re-init needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  if (reduced) return null

  // CSS-only fallback: 3 radial gradients positioned in the same quadrants
  // as the Pixi sprites, blended with 'screen' mix-blend-mode to mimic the
  // additive composition of the WebGL effect.
  if (useFallback) {
    const [c0, c1, c2] = palette
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 h-full w-full opacity-60"
        style={{
          background: `
            radial-gradient(60% 50% at 25% 35%, ${c0} 0%, transparent 60%),
            radial-gradient(60% 50% at 75% 35%, ${c1} 0%, transparent 60%),
            radial-gradient(60% 50% at 25% 65%, ${c2} 0%, transparent 60%),
            radial-gradient(60% 50% at 75% 65%, ${c0} 0%, transparent 60%)
          `,
          mixBlendMode: 'screen',
        }}
      />
    )
  }

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20 h-full w-full opacity-60"
    />
  )
}
