import { ProjectCard } from '@/components/project/ProjectCard'
import type { Project } from '#site/content'
import Link from 'next/link'

interface ProjectGridProps {
  projects: Project[]
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="mt-12 rounded-xl border border-[rgba(0,0,0,0.08)] p-12 text-center dark:border-[rgba(255,255,255,0.08)]">
        <p className="text-muted text-base">No projects in this category yet.</p>
        <Link href="/projects" className="mt-4 inline-block text-xs font-extrabold uppercase tracking-wider text-[#DF6C4F] hover:underline">
          See all projects →
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  )
}
