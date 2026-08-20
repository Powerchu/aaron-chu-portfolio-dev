'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { siteConfig } from '@/lib/siteConfig'
import { NavLink } from './NavLink'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function Header() {
  const [isActive, setIsActive] = useState(false)
  const [isHome, setIsHome] = useState(false)

  useEffect(() => {
    // Check initial body class
    setIsHome(document.body.classList.contains('is-home'))

    // Watch for class changes on <body>
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          setIsHome(document.body.classList.contains('is-home'))
        }
      }
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const toggleMenu = useCallback(() => {
    setIsActive((prev) => !prev)
  }, [])

  const headerClasses = [
    'c-Header',
    isHome ? 'c-Header--home' : 'c-Header--inner',
    isActive ? 'is-active' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <header className={headerClasses}>
      <div className="c-Header-container">
        <Link
          href={siteConfig.nav.home}
          className="c-Header-logo"
          aria-label={`${siteConfig.name} -- Home`}
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary" className="c-Header-nav-group">
          <NavLink href={siteConfig.nav.projects}>Projects</NavLink>
          <NavLink href={siteConfig.nav.experience}>Experience</NavLink>
          <NavLink href={siteConfig.nav.about}>About</NavLink>
          <ThemeToggle />
        </nav>

        <button
          type="button"
          className="c-Header-burger"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isActive}
        >
          <span className="c-Header-burger-icon">
            <span className="c-Header-burger-icon-line" />
            <span className="c-Header-burger-icon-line" />
            <span className="c-Header-burger-icon-line" />
          </span>
        </button>
      </div>
    </header>
  )
}
