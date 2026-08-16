import { isWebGLSupported } from '@/lib/pixi/createApp'

describe('isWebGLSupported', () => {
  it('returns a boolean', () => {
    const result = isWebGLSupported()
    expect(typeof result).toBe('boolean')
  })
})
