import { render, screen } from '@testing-library/react'
import { ProjectCard } from '@/components/project/ProjectCard'

const sample = {
  slug: 'test-project',
  title: 'Test Project',
  description: 'A test project for unit testing',
  date: '2025-01-15',
  categories: ['full-stack' as const, 'ai' as const],
  tech: ['React', 'TypeScript'],
  hero: '/test-hero.png',
  featured: false,
  draft: false,
  screenshots: [],
  downloads: [],
  links: [],
  metadata: { readingTime: 1, wordCount: 10 },
  content: '',
}

describe('ProjectCard', () => {
  it('renders title, description, and tech tags', () => {
    render(<ProjectCard project={sample} />)
    expect(screen.getByRole('heading', { name: /test project/i })).toBeInTheDocument()
    expect(screen.getByText(/a test project for unit testing/i)).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders a category chip for each category', () => {
    render(<ProjectCard project={sample} />)
    expect(screen.getByText(/full stack/i)).toBeInTheDocument()
    expect(screen.getByText(/ai engineering/i)).toBeInTheDocument()
  })
})
