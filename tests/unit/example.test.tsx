import { render, screen } from '@testing-library/react'

describe('Jest setup', () => {
  it('renders a basic element', () => {
    render(<button>Hello</button>)
    expect(screen.getByRole('button', { name: /hello/i })).toBeInTheDocument()
  })
})
