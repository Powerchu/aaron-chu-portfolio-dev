'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface ParallaxYProps {
  children: ReactNode
  offset?: number
  className?: string
}

export function ParallaxY({ children, offset = 24, className = '' }: ParallaxYProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return (
    <motion.div
      ref={ref}
      style={{ y: reduced ? 0 : y }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
