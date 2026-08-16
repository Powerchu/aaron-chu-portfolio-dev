'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { isWebGLSupported } from '@/lib/pixi/createApp'

interface GradientMeshProps {
  palette?: [string, string, string]
}

export function GradientMesh({ palette = ['#DF6C4F', '#0A0A0A', '#FAFAFA'] }: GradientMeshProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    if (!isWebGLSupported() || !ref.current || typeof window === 'undefined') return

    let cancelled = false
    let appInstance: any = null

    ;(async () => {
      try {
        const { createApp } = await import('@/lib/pixi/createApp')
        const { Graphics } = await import('pixi.js')

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

        const bg = new Graphics()
        bg.rect(0, 0, w, h)
        bg.fill({ color: 0x000000, alpha: 0 })
        app.stage.addChild(bg)

        // Subtle gradient ambient circles
        const circle1 = new Graphics()
        circle1.circle(w * 0.25, h * 0.35, Math.min(w, h) * 0.35)
        circle1.fill({ color: 0xDF6C4F, alpha: 0.05 })
        app.stage.addChild(circle1)

        const circle2 = new Graphics()
        circle2.circle(w * 0.75, h * 0.65, Math.min(w, h) * 0.4)
        circle2.fill({ color: 0xDF6C4F, alpha: 0.03 })
        app.stage.addChild(circle2)

        let time = 0
        app.ticker.add((ticker) => {
          time += ticker.deltaTime * 0.01
          circle1.x = Math.sin(time) * 30
          circle1.y = Math.cos(time * 0.8) * 20
          circle2.x = Math.cos(time * 0.7) * 25
          circle2.y = Math.sin(time * 0.9) * 25
        })
      } catch (err) {
        console.warn('PixiJS WebGL initialization fallback:', err)
      }
    })()

    return () => {
      cancelled = true
      if (appInstance) {
        try {
          appInstance.destroy(true)
        } catch (_) {}
      }
    }
  }, [reduced, palette])

  if (reduced) return null

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20 h-full w-full opacity-60"
    />
  )
}
