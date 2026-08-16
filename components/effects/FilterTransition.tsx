'use client'

/**
 * FilterTransition — gradient overlay during category filter changes on /projects.
 *
 * CSS-only cross-fade with a terracotta-tinted gradient sweep. This is the
 * safe baseline shipped in v1. A full PixiJS/WebGL upgrade path is noted below.
 *
 * TODO(upgrade): Replace the CSS gradient with a PixiJS Application rendering a
 *   displacement-filtered mesh that fades between category states. Keep this
 *   component signature stable so the upgrade is a drop-in.
 */
import { useEffect, useRef } from 'react'

const TRANSITION_MS = 320

interface FilterTransitionProps {
  /** Controls visibility; parent sets this on category change. */
  active: boolean
  className?: string
}

export function FilterTransition({ active, className }: FilterTransitionProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = overlayRef.current
    if (!el) return

    if (active) {
      el.style.opacity = '1'
      return
    }
    // Stay briefly after category change, then fade out
    const timer = setTimeout(() => {
      el.style.opacity = '0'
    }, TRANSITION_MS / 2)
    return () => clearTimeout(timer)
  }, [active])

  return (
    <div
      ref={overlayRef}
      className={className}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(223,108,79,0.12) 0%, transparent 70%)',
        opacity: 0,
        transition: `opacity ${TRANSITION_MS}ms ease-in-out`,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
