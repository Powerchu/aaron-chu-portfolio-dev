'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

interface DriftShapeProps {
  size?: number
  color?: string
  opacity?: number
  startX?: number | string
  startY?: number | string
  className?: string
}

export function DriftShape({
  size = 200,
  color = '#DF6C4F',
  opacity = 0.04,
  startX = 0,
  startY = 0,
  className = '',
}: DriftShapeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 45])

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        left: startX,
        top: startY,
        backgroundColor: color,
        opacity,
        borderRadius: '50%',
        filter: 'blur(40px)',
        y: reduced ? 0 : y,
        rotate: reduced ? 0 : rotate,
        pointerEvents: 'none',
      }}
    />
  )
}
