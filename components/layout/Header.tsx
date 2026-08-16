import Link from 'next/link'
import { siteConfig } from '@/lib/siteConfig'
import { NavLink } from './NavLink'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(0,0,0,0.08)] bg-bg/80 backdrop-blur-md dark:border-[rgba(255,255,255,0.08)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-12">
        <Link
          href={siteConfig.nav.home}
          className="font-display text-lg font-extrabold uppercase tracking-tight text-fg transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DF6C4F] focus-visible:ring-offset-2"
          aria-label={`${siteConfig.name} — Home`}
        >
          {siteConfig.name}
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
          <NavLink href={siteConfig.nav.projects}>Projects</NavLink>
          <NavLink href={siteConfig.nav.experience}>Experience</NavLink>
          <NavLink href={siteConfig.nav.about}>About</NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
