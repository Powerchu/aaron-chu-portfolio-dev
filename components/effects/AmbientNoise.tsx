'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

interface AmbientNoiseProps {
  opacity?: number
}

export function AmbientNoise({ opacity = 0.03 }: AmbientNoiseProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    if (!ref.current || typeof window === 'undefined') return

    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 160
    canvas.height = 160

    const imageData = ctx.createImageData(160, 160)
    const data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.floor(Math.random() * 255)
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
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-30 mix-blend-overlay"
      style={{ opacity }}
    />
  )
}
