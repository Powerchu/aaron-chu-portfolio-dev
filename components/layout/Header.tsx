'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { siteConfig } from '@/lib/siteConfig'
import { NavLink } from './NavLink'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function Header() {
  const [isActive, setIsActive] = useState(false)
  const pathname = usePathname()
  // isHome is derived directly from the pathname. Reading it via usePathname
  // (rather than sniffing document.body.classList in a useEffect) avoids
  // the flash-of-wrong-header-state where Header would render c-Header--inner
  // for one frame before PageBodyClass's effect catches up.
  const isHome = pathname === siteConfig.nav.home

  // Close the mobile menu on every route change so the burger resets to its
  // 3-line state after tapping a nav link (Header persists across soft nav).
  useEffect(() => {
    setIsActive(false)
  }, [pathname])

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
          aria-label={`${siteConfig.name} — Home`}
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
          aria-controls="mobile-nav"
        >
          <span className="c-Header-burger-icon">
            <span className="c-Header-burger-icon-line" />
            <span className="c-Header-burger-icon-line" />
            <span className="c-Header-burger-icon-line" />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className="c-Header-mobile-nav"
        aria-hidden={!isActive}
      >
        <NavLink href={siteConfig.nav.projects}>Projects</NavLink>
        <NavLink href={siteConfig.nav.experience}>Experience</NavLink>
        <NavLink href={siteConfig.nav.about}>About</NavLink>
        <ThemeToggle />
      </div>
    </header>
  )
}
