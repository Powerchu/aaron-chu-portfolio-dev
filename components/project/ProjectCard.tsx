import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '#site/content'
import { CategoryChip } from './CategoryChip'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] bg-transparent transition duration-300 hover:scale-[1.02] hover:border-[rgba(0,0,0,0.2)] dark:border-[rgba(255,255,255,0.08)] dark:hover:border-[rgba(255,255,255,0.2)]">
      <Link
        href={`/projects/${project.slug}`}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DF6C4F] focus-visible:ring-offset-2 rounded-xl"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-black/5 dark:bg-white/5">
          {project.hero ? (
            <Image
              src={project.hero}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-2xl font-light text-muted">
              {project.title}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {project.categories.map((cat) => (
              <CategoryChip key={cat} category={cat} clickable={false} />
            ))}
          </div>

          <h3 className="font-display text-2xl font-normal uppercase leading-tight md:text-3xl text-fg">
            <span className="bg-gradient-to-r from-[#DF6C4F] to-[#DF6C4F] bg-[length:0%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_2px]">
              {project.title}
            </span>
          </h3>

          <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-2">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[rgba(0,0,0,0.04)] pt-3 dark:border-[rgba(255,255,255,0.04)]">
            {project.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted"
              >
                {t}
              </span>
            ))}
            <span className="ml-auto text-xs text-muted">
              {new Date(project.date).getFullYear()}
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}
