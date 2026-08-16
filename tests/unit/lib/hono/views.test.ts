import { viewsRoute } from '@/lib/hono/routes/views'

describe('GET & POST /api/views/:slug', () => {
  const store: Record<string, string> = {}
  const mockKV = {
    get: jest.fn(async (key: string) => store[key] ?? null),
    put: jest.fn(async (key: string, val: string) => {
      store[key] = val
    }),
  }

  const env = { VIEWS: mockKV as any }

  it('gets 0 views initially for a slug', async () => {
    const res = await viewsRoute.request('/test-slug', {}, env)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual({ slug: 'test-slug', views: 0 })
  })

  it('increments views on POST', async () => {
    const res = await viewsRoute.request('/test-slug', { method: 'POST' }, env)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toEqual({ slug: 'test-slug', views: 1 })
    expect(mockKV.put).toHaveBeenCalledWith('project:test-slug', '1')
  })
})
