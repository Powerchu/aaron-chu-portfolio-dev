import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

describe('ThemeToggle', () => {
  it('renders a button with accessible label', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('toggles dark class on documentElement when clicked', async () => {
    const user = userEvent.setup()
    document.documentElement.classList.remove('dark')
    render(<ThemeToggle />)
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
