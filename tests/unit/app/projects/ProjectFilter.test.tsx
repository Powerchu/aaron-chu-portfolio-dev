import { render, screen } from '@testing-library/react'
import { ProjectFilter } from '@/app/projects/ProjectFilter'

describe('ProjectFilter', () => {
  it('renders all 5 category chips plus All', () => {
    render(<ProjectFilter activeCategory={undefined} />)
    expect(screen.getByRole('link', { name: /^all$/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /full stack/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ai engineering/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /graphic design/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /game dev/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /photography/i })).toBeInTheDocument()
  })

  it('marks the active category chip with aria-current', () => {
    render(<ProjectFilter activeCategory="ai" />)
    expect(screen.getByRole('link', { name: /ai engineering/i })).toHaveAttribute('aria-current', 'page')
  })
})
