import { siteConfig } from '@/lib/siteConfig'
import type { CategorySlug } from '@/lib/siteConfig'

interface MetaLineProps {
  category: CategorySlug | CategorySlug[]
  tech: string[]
  year: string
  className?: string
}

export function MetaLine({ category, tech, year, className = '' }: MetaLineProps) {
  const categories = Array.isArray(category) ? category : [category]

  // .filter(Boolean) returns Array<string|undefined>; the explicit type
  // predicate below narrows the union to string without needing a ! assertion.
  const categoryNames = categories
    .map((slug) => siteConfig.categories[slug]?.name)
    .filter((name): name is string => typeof name === 'string')
    .map((name) => name.toUpperCase())

  const displayTech = tech.slice(0, 3).map((t) => t.toUpperCase())

  const segments = [...categoryNames, ...displayTech, year.toUpperCase()]

  return (
    <div
      className={`text-[11px] uppercase tracking-widest text-muted mb-2 font-mono ${className}`}
    >
      [ {segments.join(' · ')} ]
    </div>
  )
}
