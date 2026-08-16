import { projects } from '#site/content'
import { DisciplinesStrip } from '@/components/home/DisciplinesStrip'
import { ProjectCard } from '@/components/project/ProjectCard'
import { FadeIn } from '@/components/motion/FadeIn'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { AmbientNoise } from '@/components/effects/AmbientNoise'
import { GradientMesh } from '@/components/effects/GradientMesh'
import { DriftShape } from '@/components/parallax/DriftShape'
import { siteConfig } from '@/lib/siteConfig'

export default function HomePage() {
  const featured = projects
    .filter((p) => p.featured && !p.draft)
    .slice(0, 3)

  return (
    <main>
      <section className="relative overflow-hidden min-h-[70vh] flex flex-col justify-center">
        <GradientMesh />
        <AmbientNoise />
        <DriftShape startX={-100} startY={50} size={400} />
        <DriftShape startX="70%" startY={200} size={300} color="#DF6C4F" opacity={0.03} />

        <div className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28 w-full">
          <FadeIn>
            <h1 className="font-display text-5xl font-normal leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
              Aaron Chu.
              <br />
              <span className="text-[#DF6C4F]">Software</span>,<br />
              AI, design, games.
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-8 max-w-xl text-lg text-muted leading-relaxed">
              {siteConfig.description}
            </p>
          </FadeIn>
        </div>
      </section>

      <DisciplinesStrip />

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-12 md:py-28">
        <ScrollReveal>
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-display text-3xl font-normal uppercase leading-tight md:text-4xl">
              Featured Work
            </h2>
            <a
              href="/projects"
              className="text-xs font-extrabold uppercase tracking-wider text-[#DF6C4F] hover:underline"
            >
              View all ({projects.length}) →
            </a>
          </div>
        </ScrollReveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
    </main>
  )
}
