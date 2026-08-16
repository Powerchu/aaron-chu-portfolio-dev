import { defineConfig, defineCollection, s } from 'velite'

const projects = defineCollection({
  name: 'Project',
  pattern: 'projects/*.mdx',
  schema: s.object({
    title: s.string(),
    slug: s.path().transform((p) => p.replace(/^projects\//, '')),
    description: s.string().max(280),
    date: s.isodate(),
    categories: s
      .array(s.enum(['full-stack', 'ai', 'graphic-design', 'game-dev', 'photography']))
      .min(1),
    tech: s.array(s.string()),
    role: s.string().optional(),
    company: s.string().optional(),
    hero: s.string(),
    video: s.string().url().optional(),
    videoPoster: s.string().optional(),
    audio: s.string().url().optional(),
    audioTitle: s.string().optional(),
    screenshots: s
      .array(
        s.object({
          src: s.string(),
          alt: s.string(),
          caption: s.string().optional(),
        })
      )
      .default([]),
    downloads: s
      .array(
        s.object({
          url: s.string(),
          label: s.string(),
          size: s.string().optional(),
          type: s.string().optional(),
        })
      )
      .default([]),
    links: s
      .array(
        s.object({
          label: s.string(),
          url: s.string().url(),
        })
      )
      .default([]),
    featured: s.boolean().default(false),
    draft: s.boolean().default(false),
    note: s.string().max(500).optional(),
    metadata: s.metadata(),
    content: s.mdx(),
  }),
})

const experience = defineCollection({
  name: 'Experience',
  pattern: 'experience/*.mdx',
  schema: s.object({
    title: s.string(),
    company: s.string(),
    companyUrl: s.string().optional(),
    location: s.string().optional(),
    start: s.isodate(),
    end: s.isodate().optional(),
    summary: s.string().max(400),
    highlights: s.array(s.string()).optional(),
    order: s.number().default(0),
    metadata: s.metadata(),
    content: s.mdx(),
  }),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { projects, experience },
  mdx: {
    gfm: true,
  },
})
