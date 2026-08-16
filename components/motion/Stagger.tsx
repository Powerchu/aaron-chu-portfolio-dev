'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StaggerProps {
  children: ReactNode
  stagger?: number
  className?: string
}

export function Stagger({ children, stagger = 0.06, className = '' }: StaggerProps) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial="hidden"
      whileInView={reduced ? undefined : 'visible'}
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
