import { render, screen } from '@testing-library/react'
import { DisciplinesStrip } from '@/components/home/DisciplinesStrip'

describe('DisciplinesStrip', () => {
  it('renders all 5 disciplines with links', () => {
    render(<DisciplinesStrip />)
    expect(screen.getByRole('link', { name: /full stack/i })).toHaveAttribute('href', '/projects?category=full-stack')
    expect(screen.getByRole('link', { name: /ai engineering/i })).toHaveAttribute('href', '/projects?category=ai')
    expect(screen.getByRole('link', { name: /graphic design/i })).toHaveAttribute('href', '/projects?category=graphic-design')
    expect(screen.getByRole('link', { name: /game dev/i })).toHaveAttribute('href', '/projects?category=game-dev')
    expect(screen.getByRole('link', { name: /photography/i })).toHaveAttribute('href', '/projects?category=photography')
  })
})
