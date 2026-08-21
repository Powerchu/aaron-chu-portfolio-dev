import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { projects } from '#site/content'
import { siteConfig } from '@/lib/siteConfig'
import { MetaLine } from '@/components/project/MetaLine'
import { ProjectMedia } from '@/components/project/ProjectMedia'
import { DownloadList } from '@/components/project/DownloadList'
import { LinkList } from '@/components/project/LinkList'
import { HeroDisplace } from '@/components/effects/HeroDisplace'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `${siteConfig.url}/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.description,
      url: `${siteConfig.url}/projects/${project.slug}`,
      images: project.hero ? [{ url: project.hero, width: 1200, height: 630 }] : undefined,
      type: 'article',
    },
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  return (
    <main id="main" className="mx-auto max-w-5xl px-6 py-16 md:px-12 md:py-24">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted hover:text-[#DF6C4F] transition-colors"
      >
        ← All projects
      </Link>

      <header className="mt-8">
        <MetaLine
          category={project.categories}
          tech={project.tech}
          year={new Date(project.date).getFullYear().toString()}
        />
        <h1 className="font-display text-4xl font-normal uppercase leading-tight sm:text-6xl md:text-7xl">
          {project.title}
        </h1>
        <p className="mt-6 text-xl text-muted leading-relaxed max-w-3xl">
          {project.description}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-6 border-y border-[rgba(0,0,0,0.08)] py-4 text-sm dark:border-[rgba(255,255,255,0.08)]">
          {project.role && (
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted mr-2">Role:</span>
              <span className="font-medium">{project.role}</span>
            </div>
          )}
          {project.company && (
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-muted mr-2">Company:</span>
              <span className="font-medium">{project.company}</span>
            </div>
          )}
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-muted mr-2">Date:</span>
            <span className="font-medium">
              {new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>

        {project.tech.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="font-mono text-xs font-semibold uppercase tracking-wider rounded-md bg-black/5 px-2.5 py-1 text-muted dark:bg-white/5"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      {project.hero && (
        <div className="relative mt-12 aspect-video overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-black/5 dark:bg-white/5">
          <Image
            src={project.hero}
            alt={project.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
          <HeroDisplace imageUrl={project.hero} />
        </div>
      )}

      {project.note && (
        <div className="mt-12 rounded-xl border border-[#DF6C4F]/20 bg-[#DF6C4F]/5 p-6 text-base text-fg leading-relaxed">
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#DF6C4F] mb-2">Note</p>
          <p>{project.note}</p>
        </div>
      )}

      <ProjectMedia project={project} />
      <LinkList links={project.links} />
      <DownloadList downloads={project.downloads} />
    </main>
  )
}
