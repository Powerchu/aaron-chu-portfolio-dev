'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      try {
        localStorage.setItem('theme', 'dark')
      } catch (_) {}
    } else {
      document.documentElement.classList.remove('dark')
      try {
        localStorage.setItem('theme', 'light')
      } catch (_) {}
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DF6C4F] focus-visible:ring-offset-2 transition-colors cursor-pointer"
    >
      <FontAwesomeIcon icon={mounted && isDark ? faSun : faMoon} className="h-4 w-4" />
    </button>
  )
}
