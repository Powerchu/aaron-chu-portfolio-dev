import type { Metadata } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { siteConfig } from '@/lib/siteConfig'
import { about } from '#site/content'

export const metadata: Metadata = {
  title: 'About',
  description: `About ${siteConfig.name} — software engineer, AI builder, designer, and photographer.`,
}

export default function AboutPage() {
  const aboutContent = about[0]
  if (!aboutContent) return null

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 md:px-12 md:py-24">
      <h1 className="font-display text-5xl font-normal leading-[0.95] tracking-tight md:text-7xl">
        About
      </h1>

      <div className="prose prose-neutral dark:prose-invert mt-12 max-w-none space-y-6 text-base text-fg/90 leading-relaxed">
        {aboutContent.content}
      </div>

      <div className="mt-12 pt-8 border-t border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)]">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-muted mb-4">
          Connect
        </h2>
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(0,0,0,0.12)] text-fg transition hover:border-[#DF6C4F] hover:text-[#DF6C4F] dark:border-[rgba(255,255,255,0.12)]"
          >
            <FontAwesomeIcon icon={faGithub} className="h-4 w-4" />
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(0,0,0,0.12)] text-fg transition hover:border-[#DF6C4F] hover:text-[#DF6C4F] dark:border-[rgba(255,255,255,0.12)]"
          >
            <FontAwesomeIcon icon={faLinkedin} className="h-4 w-4" />
          </a>
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[rgba(0,0,0,0.12)] text-fg transition hover:border-[#DF6C4F] hover:text-[#DF6C4F] dark:border-[rgba(255,255,255,0.12)]"
          >
            <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" />
          </a>
        </div>
      </div>
    </main>
  )
}
