import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { siteConfig } from '@/lib/siteConfig'

export function Footer() {
  return (
    <footer className="mt-32 border-t border-[rgba(0,0,0,0.08)] bg-bg dark:border-[rgba(255,255,255,0.08)]">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24">
        <div className="mb-12">
          <h2 className="font-display text-4xl font-normal uppercase leading-tight md:text-5xl">
            Let&apos;s build something
          </h2>
          <Link
            href={`mailto:${siteConfig.author.email}`}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#DF6C4F] px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-[#DF6C4F]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DF6C4F] focus-visible:ring-offset-2"
          >
            {siteConfig.author.email}
            <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-8 border-t border-[rgba(0,0,0,0.08)] pt-8 md:grid-cols-3 dark:border-[rgba(255,255,255,0.08)]">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted">
              Navigate
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href={siteConfig.nav.projects} className="hover:text-[#DF6C4F] transition-colors">Projects</Link></li>
              <li><Link href={siteConfig.nav.experience} className="hover:text-[#DF6C4F] transition-colors">Experience</Link></li>
              <li><Link href={siteConfig.nav.about} className="hover:text-[#DF6C4F] transition-colors">About</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted">
              Elsewhere
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[#DF6C4F] transition-colors">
                  <FontAwesomeIcon icon={faGithub} className="h-4 w-4" /> GitHub
                </a>
              </li>
              <li>
                <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[#DF6C4F] transition-colors">
                  <FontAwesomeIcon icon={faLinkedin} className="h-4 w-4" /> LinkedIn
                </a>
              </li>
              <li>
                <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-[#DF6C4F] transition-colors">
                  <FontAwesomeIcon icon={faInstagram} className="h-4 w-4" /> Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted">
              Source
            </h3>
            <p className="mt-3 text-sm text-muted">
              Built with Next.js on Cloudflare Pages. Open source on{' '}
              <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="text-[#DF6C4F] hover:underline">
                GitHub
              </a>.
            </p>
          </div>
        </div>

        <p className="mt-12 text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
