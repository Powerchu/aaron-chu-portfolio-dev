import Image from 'next/image'
import type { Project } from '#site/content'

interface ProjectMediaProps {
  project: Project
}

export function ProjectMedia({ project }: ProjectMediaProps) {
  return (
    <div className="mt-12 space-y-10">
      {project.video && (
        <div className="overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-black">
          <video
            controls
            poster={project.videoPoster}
            className="w-full aspect-video"
            preload="metadata"
          >
            <source src={project.video} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {project.audio && (
        <div className="rounded-xl border border-[rgba(0,0,0,0.08)] p-6 dark:border-[rgba(255,255,255,0.08)]">
          {project.audioTitle && (
            <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-muted">
              {project.audioTitle}
            </p>
          )}
          <audio controls className="w-full" preload="metadata">
            <source src={project.audio} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}

      {project.screenshots && project.screenshots.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2">
          {project.screenshots.map((ss, i) => (
            <figure key={i} className="space-y-2">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[rgba(0,0,0,0.08)] dark:border-[rgba(255,255,255,0.08)] bg-black/5 dark:bg-white/5">
                <Image
                  src={ss.src}
                  alt={ss.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              {ss.caption && (
                <figcaption className="text-xs text-muted italic">{ss.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}
