import { render, screen } from '@testing-library/react'
import { NavLink } from '@/components/layout/NavLink'

describe('NavLink', () => {
  it('renders an active link with the correct href', () => {
    render(<NavLink href="/projects" active>Projects</NavLink>)
    const link = screen.getByRole('link', { name: /projects/i })
    expect(link).toHaveAttribute('href', '/projects')
    expect(link).toHaveAttribute('aria-current', 'page')
  })

  it('renders an inactive link without aria-current', () => {
    render(<NavLink href="/projects">Projects</NavLink>)
    const link = screen.getByRole('link', { name: /projects/i })
    expect(link).not.toHaveAttribute('aria-current')
  })
})
