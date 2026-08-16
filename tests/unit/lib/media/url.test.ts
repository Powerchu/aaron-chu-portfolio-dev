import { mediaUrl } from '@/lib/media/url'

describe('mediaUrl', () => {
  it('prepends the media base URL', () => {
    expect(mediaUrl('projects/foo/hero.png')).toBe('https://media.aaronchu.cc/projects/foo/hero.png')
  })

  it('strips leading slashes', () => {
    expect(mediaUrl('/projects/foo/hero.png')).toBe('https://media.aaronchu.cc/projects/foo/hero.png')
  })
})
