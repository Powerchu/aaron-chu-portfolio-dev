import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { categorySlugs, siteConfig } from '@/lib/siteConfig'

export function DisciplinesStrip() {
  return (
    <section aria-label="Disciplines" className="border-y border-[rgba(0,0,0,0.08)] py-12 dark:border-[rgba(255,255,255,0.08)]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 sm:grid-cols-3 md:grid-cols-5 md:px-12">
        {categorySlugs.map((slug) => {
          const cat = siteConfig.categories[slug]
          return (
            <Link
              key={slug}
              href={`/projects?category=${slug}`}
              className="group flex flex-col items-center justify-center gap-3 rounded-xl p-6 transition duration-200 hover:bg-black/5 dark:hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DF6C4F] focus-visible:ring-offset-2 border border-transparent hover:border-[rgba(0,0,0,0.08)] dark:hover:border-[rgba(255,255,255,0.08)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black/5 text-fg transition duration-200 group-hover:bg-[#DF6C4F]/10 group-hover:text-[#DF6C4F] dark:bg-white/5">
                <FontAwesomeIcon
                  icon={cat.icon}
                  aria-hidden="true"
                  className="h-5 w-5 transition"
                />
              </div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-fg transition group-hover:text-[#DF6C4F]">
                {cat.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
