'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { isWebGLSupported } from '@/lib/pixi/createApp'

interface HeroDisplaceProps {
  imageUrl?: string
}

export function HeroDisplace({ imageUrl }: HeroDisplaceProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !imageUrl) return
    if (!isWebGLSupported() || !ref.current || typeof window === 'undefined') return
    // Optional WebGL overlay effect hook
  }, [reduced, imageUrl])

  if (reduced || !imageUrl) return null

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
    />
  )
}
