'use client'

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { useEffect, type ReactNode } from 'react'

interface ParallaxMouseProps {
  children: ReactNode
  intensity?: number
  className?: string
}

export function ParallaxMouse({ children, intensity = 0.04, className = '' }: ParallaxMouseProps) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { damping: 30, stiffness: 200 })
  const springY = useSpring(y, { damping: 30, stiffness: 200 })

  const moveX = useTransform(springX, [-1, 1], [-10 * intensity * 100, 10 * intensity * 100])
  const moveY = useTransform(springY, [-1, 1], [-10 * intensity * 100, 10 * intensity * 100])

  useEffect(() => {
    if (reduced) return
    const handler = (e: MouseEvent) => {
      x.set((e.clientX / window.innerWidth) * 2 - 1)
      y.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [x, y, reduced])

  return (
    <motion.div
      style={{ x: reduced ? 0 : moveX, y: reduced ? 0 : moveY }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
