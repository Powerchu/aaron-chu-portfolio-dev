import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faCode, faMicrochip, faPalette, faGamepad, faCamera } from '@fortawesome/free-solid-svg-icons'

export type CategorySlug = 'full-stack' | 'ai' | 'graphic-design' | 'game-dev' | 'photography'

export interface CategoryConfig {
  slug: CategorySlug
  name: string
  description: string
  icon: IconDefinition
}

export const siteConfig = {
  name: 'Aaron Chu',
  title: 'Aaron Chu — Developer Portfolio',
  description: 'Software engineer building thoughtful products at the edge.',
  url: 'https://aaronchu.cc',
  mediaUrl: 'https://media.aaronchu.cc',
  ogImage: '/og/default.png',
  locale: 'en-US',
  keywords: [
    'Software Engineer',
    'TypeScript',
    'Next.js',
    'Cloudflare',
    'AI Engineering',
    'Full Stack Developer',
    'Game Developer',
    'Graphic Designer',
    'Photographer',
  ],
  author: {
    name: 'Aaron Chu',
    email: 'aaron_powerchu@hotmail.com',
    github: 'Powerchu',
    linkedin: 'aaronchu',
  },
  social: {
    github: 'https://github.com/Powerchu',
    linkedin: 'https://www.linkedin.com/in/aaronchu',
    instagram: 'https://www.instagram.com/aaronchu',
  },
  cloudflare: {
    accountId: '65cbc69e461eb925f39d60fe6490f8d1',
    pagesProjectName: 'aaron-chu-portfolio',
    r2BucketName: 'aaronchu-portfolio-media',
  },
  categories: {
    'full-stack': {
      slug: 'full-stack',
      name: 'Full Stack',
      description: 'Web apps, SaaS, APIs, infrastructure',
      icon: faCode,
    },
    ai: {
      slug: 'ai',
      name: 'AI Engineering',
      description: 'AI agents, RAG, fine-tuning, MLOps',
      icon: faMicrochip,
    },
    'graphic-design': {
      slug: 'graphic-design',
      name: 'Graphic Design',
      description: 'Logos, brand identity, posters, print',
      icon: faPalette,
    },
    'game-dev': {
      slug: 'game-dev',
      name: 'Game Dev',
      description: 'Indie games, prototypes, jams',
      icon: faGamepad,
    },
    photography: {
      slug: 'photography',
      name: 'Photography',
      description: 'Photo series, exhibitions, prints',
      icon: faCamera,
    },
  } satisfies Record<CategorySlug, CategoryConfig>,
  nav: {
    home: '/',
    projects: '/projects',
    experience: '/experience',
    about: '/about',
  },
} as const

export const categorySlugs: CategorySlug[] = Object.keys(siteConfig.categories) as CategorySlug[]
