import { GET, POST } from '@/app/api/[...route]/route'

describe('/api route handler', () => {
  it('exports valid HTTP handlers', () => {
    expect(typeof GET).toBe('function')
    expect(typeof POST).toBe('function')
  })
})
