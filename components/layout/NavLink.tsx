'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

interface NavLinkProps {
  href: string
  active?: boolean
  children: ReactNode
  className?: string
}

export function NavLink({ href, active, children, className = '' }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = active !== undefined ? active : (pathname === href || (href !== '/' && pathname?.startsWith(href)))

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={`c-Header-nav-link rounded-md px-3 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors border-b-2 ${
        isActive
          ? 'border-accent text-fg'
          : 'border-transparent text-fg/80 hover:bg-black/5 hover:text-fg dark:hover:bg-white/5'
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DF6C4F] focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </Link>
  )
}
