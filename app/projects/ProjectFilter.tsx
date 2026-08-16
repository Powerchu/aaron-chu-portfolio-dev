import Link from 'next/link'
import { categorySlugs, siteConfig, type CategorySlug } from '@/lib/siteConfig'

interface ProjectFilterProps {
  activeCategory?: CategorySlug
}

export function ProjectFilter({ activeCategory }: ProjectFilterProps) {
  return (
    <nav aria-label="Filter projects by category" className="flex flex-wrap gap-2">
      <Link
        href="/projects"
        aria-current={!activeCategory ? 'page' : undefined}
        className={`rounded-full border px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
          !activeCategory
            ? 'border-[#DF6C4F] bg-[#DF6C4F] text-white'
            : 'border-[rgba(0,0,0,0.12)] text-fg hover:border-[#DF6C4F] hover:text-[#DF6C4F] dark:border-[rgba(255,255,255,0.12)]'
        }`}
      >
        All
      </Link>
      {categorySlugs.map((slug) => {
        const cat = siteConfig.categories[slug]
        const isActive = activeCategory === slug
        return (
          <Link
            key={slug}
            href={`/projects?category=${slug}`}
            aria-current={isActive ? 'page' : undefined}
            className={`rounded-full border px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
              isActive
                ? 'border-[#DF6C4F] bg-[#DF6C4F] text-white'
                : 'border-[rgba(0,0,0,0.12)] text-fg hover:border-[#DF6C4F] hover:text-[#DF6C4F] dark:border-[rgba(255,255,255,0.12)]'
            }`}
          >
            {cat.name}
          </Link>
        )
      })}
    </nav>
  )
}
