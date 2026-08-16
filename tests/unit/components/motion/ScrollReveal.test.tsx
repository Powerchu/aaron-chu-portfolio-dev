import { render } from '@testing-library/react'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

describe('ScrollReveal', () => {
  it('renders children', () => {
    const { container } = render(<ScrollReveal><span>content</span></ScrollReveal>)
    expect(container.textContent).toBe('content')
  })
})
