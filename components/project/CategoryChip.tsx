import Link from 'next/link'
import type { CategorySlug } from '@/lib/siteConfig'
import { siteConfig } from '@/lib/siteConfig'

interface CategoryChipProps {
  category: CategorySlug
  clickable?: boolean
  className?: string
}

export function CategoryChip({ category, clickable = true, className = '' }: CategoryChipProps) {
  const config = siteConfig.categories[category]
  if (!config) return null

  const chipClasses = `inline-flex items-center gap-1.5 rounded-full border border-[#DF6C4F] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#DF6C4F] transition ${
    clickable ? 'hover:bg-[#DF6C4F] hover:text-white' : ''
  } ${className}`

  if (!clickable) {
    return <span className={chipClasses}>{config.name}</span>
  }

  return (
    <Link href={`/projects?category=${category}`} className={chipClasses}>
      {config.name}
    </Link>
  )
}
