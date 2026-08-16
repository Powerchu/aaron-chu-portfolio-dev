import type { Metadata } from 'next'
import { projects } from '#site/content'
import { ProjectFilter } from './ProjectFilter'
import { ProjectGrid } from './ProjectGrid'
import { categorySlugs, type CategorySlug } from '@/lib/siteConfig'

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export const metadata: Metadata = {
  title: 'Projects',
  description: 'All projects across full stack development, AI engineering, graphic design, game development, and photography.',
}

function isCategorySlug(value: string | undefined): value is CategorySlug {
  return !!value && categorySlugs.includes(value as CategorySlug)
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const cat = resolvedSearchParams.category
  const activeCategory = isCategorySlug(cat) ? cat : undefined
  
  const all = projects.filter((p) => !p.draft)
  const filtered = activeCategory ? all.filter((p) => p.categories.includes(activeCategory)) : all
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24">
      <h1 className="font-display text-5xl font-normal leading-[0.95] tracking-tight md:text-7xl">
        Projects
      </h1>
      <p className="mt-4 text-muted text-lg">
        {sorted.length} {sorted.length === 1 ? 'project' : 'projects'}
      </p>

      <div className="mt-8">
        <ProjectFilter activeCategory={activeCategory} />
      </div>

      <ProjectGrid projects={sorted} />
    </main>
  )
}
