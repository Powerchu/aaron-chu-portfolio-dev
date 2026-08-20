import { render } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { PageBodyClass, pathnameToBodyClass } from '@/components/layout/PageBodyClass'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

const mockedUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe('pathnameToBodyClass', () => {
  it('returns "is-home" for "/"', () => {
    expect(pathnameToBodyClass('/')).toBe('is-home')
  })

  it('returns "is-projects" for "/projects"', () => {
    expect(pathnameToBodyClass('/projects')).toBe('is-projects')
  })

  it('returns "is-project-slug" for "/projects/my-project"', () => {
    expect(pathnameToBodyClass('/projects/my-project')).toBe('is-project-slug')
  })

  it('returns "is-project-slug" for nested project slugs', () => {
    expect(pathnameToBodyClass('/projects/a/b/c')).toBe('is-project-slug')
  })

  it('returns "is-experience" for "/experience"', () => {
    expect(pathnameToBodyClass('/experience')).toBe('is-experience')
  })

  it('returns "is-about" for "/about"', () => {
    expect(pathnameToBodyClass('/about')).toBe('is-about')
  })

  it('returns null for unmatched routes', () => {
    expect(pathnameToBodyClass('/not-found')).toBeNull()
    expect(pathnameToBodyClass('/blog/post-1')).toBeNull()
    expect(pathnameToBodyClass('/projects')).not.toBeNull()
  })
})

describe('PageBodyClass component', () => {
  beforeEach(() => {
    document.body.className = ''
  })

  it('adds is-home class to body when pathname is "/"', () => {
    mockedUsePathname.mockReturnValue('/')
    render(<PageBodyClass />)
    expect(document.body.classList.contains('is-home')).toBe(true)
  })

  it('adds is-projects class to body when pathname is "/projects"', () => {
    mockedUsePathname.mockReturnValue('/projects')
    render(<PageBodyClass />)
    expect(document.body.classList.contains('is-projects')).toBe(true)
  })

  it('preserves existing body classes (e.g. dark mode)', () => {
    document.body.className = 'dark'
    mockedUsePathname.mockReturnValue('/')
    render(<PageBodyClass />)
    expect(document.body.classList.contains('dark')).toBe(true)
    expect(document.body.classList.contains('is-home')).toBe(true)
  })

  it('cleans up page classes on unmount', () => {
    mockedUsePathname.mockReturnValue('/about')
    const { unmount } = render(<PageBodyClass />)
    expect(document.body.classList.contains('is-about')).toBe(true)
    unmount()
    expect(document.body.classList.contains('is-about')).toBe(false)
  })
})
