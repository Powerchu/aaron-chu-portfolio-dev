import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import type { Project } from '#site/content'

interface DownloadListProps {
  downloads?: Project['downloads']
}

export function DownloadList({ downloads }: DownloadListProps) {
  if (!downloads || downloads.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted">Downloads</h2>
      <ul className="mt-4 space-y-2">
        {downloads.map((dl, i) => (
          <li key={i}>
            <a
              href={dl.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[rgba(0,0,0,0.12)] px-4 py-2.5 text-sm transition hover:border-[#DF6C4F] hover:text-[#DF6C4F] dark:border-[rgba(255,255,255,0.12)]"
            >
              <FontAwesomeIcon icon={faDownload} aria-hidden="true" className="h-4 w-4 text-[#DF6C4F]" />
              <span>{dl.label}</span>
              {dl.size && <span className="text-xs text-muted">({dl.size})</span>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
