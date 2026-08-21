'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const PAGE_CLASSES = [
  'is-home',
  'is-projects',
  'is-project-slug',
  'is-experience',
  'is-about',
] as const

/**
 * Returns the body class that matches a given pathname, or null if none applies.
 */
export function pathnameToBodyClass(pathname: string): string | null {
  if (pathname === '/') return 'is-home'
  if (pathname === '/projects') return 'is-projects'
  if (pathname.startsWith('/projects/')) return 'is-project-slug'
  if (pathname === '/experience') return 'is-experience'
  if (pathname === '/about') return 'is-about'
  return null
}

/**
 * Client component that adds a page-aware `is-*` modifier class to <body>
 * based on the current route. Mirrors Monopo's page-aware body classes
 * (e.g. `is-index`, `is-work`).
 *
 * Does NOT touch `dark` / `light` — those are managed by ThemeScript / ThemeToggle
 * on `document.documentElement`.
 */
export function PageBodyClass() {
  const pathname = usePathname()

  useEffect(() => {
    const nextClass = pathnameToBodyClass(pathname)
    const body = document.body

    // Remove any previously applied page classes
    for (const cls of PAGE_CLASSES) {
      body.classList.remove(cls)
    }

    // Apply the matching class
    if (nextClass) {
      body.classList.add(nextClass)
    }
  }, [pathname])

  // Cleanup: strip page classes when the component unmounts (e.g. full page unload)
  useEffect(() => {
    return () => {
      for (const cls of PAGE_CLASSES) {
        document.body.classList.remove(cls)
      }
    }
  }, [])

  return null
}
