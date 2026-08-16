import type { Project } from '#site/content'

interface LinkListProps {
  links?: Project['links']
}

export function LinkList({ links }: LinkListProps) {
  if (!links || links.length === 0) return null

  return (
    <section className="mt-10 flex flex-wrap gap-3">
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full border border-[#DF6C4F] bg-[#DF6C4F] px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-[#DF6C4F]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DF6C4F] focus-visible:ring-offset-2"
        >
          {link.label} ↗
        </a>
      ))}
    </section>
  )
}
