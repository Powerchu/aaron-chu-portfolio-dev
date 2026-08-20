import type { Metadata } from 'next'
import { experience } from '#site/content'

export const metadata: Metadata = {
  title: 'Experience',
  description: 'Work history, leadership roles, and engineering milestones.',
}

export default function ExperiencePage() {
  const entries = [...experience].sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    return b.start.localeCompare(a.start)
  })

  return (
    <main id="main" className="mx-auto max-w-3xl px-6 py-16 md:px-12 md:py-24">
      <h1 className="font-display text-5xl font-normal leading-[0.95] tracking-tight md:text-7xl">
        Experience
      </h1>
      <p className="mt-4 text-lg text-muted">
        A timeline of software architecture, engineering leadership, and creative production.
      </p>

      <ol className="mt-14 space-y-12 border-l border-[rgba(0,0,0,0.08)] pl-6 md:pl-8 dark:border-[rgba(255,255,255,0.08)]">
        {entries.map((entry, i) => (
          <li key={i} className="relative">
            <div className="absolute -left-[31px] md:-left-[39px] top-1.5 h-3 w-3 rounded-full border-2 border-bg bg-[#DF6C4F]" />
            <p className="text-xs font-extrabold uppercase tracking-wider text-[#DF6C4F]">
              {new Date(entry.start).getFullYear()} — {entry.end ? new Date(entry.end).getFullYear() : 'Present'}
            </p>
            <h2 className="mt-2 font-display text-2xl font-normal uppercase leading-tight md:text-3xl">
              {entry.title}
            </h2>
            <p className="mt-1 text-base">
              {entry.companyUrl ? (
                <a
                  href={entry.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-[#DF6C4F] transition-colors"
                >
                  {entry.company}
                </a>
              ) : (
                <span className="font-medium">{entry.company}</span>
              )}
              {entry.location && <span className="text-muted text-sm"> · {entry.location}</span>}
            </p>
            <p className="mt-3 text-sm text-muted leading-relaxed">{entry.summary}</p>
            {entry.highlights && entry.highlights.length > 0 && (
              <ul className="mt-4 space-y-2">
                {entry.highlights.map((h, j) => (
                  <li key={j} className="text-sm text-fg/90 flex items-start gap-2">
                    <span className="text-[#DF6C4F]">—</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </main>
  )
}
