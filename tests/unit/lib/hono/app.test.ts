import { app } from '@/lib/hono/app'

describe('Hono app', () => {
  it('responds 404 for unknown routes', async () => {
    const res = await app.request('/unknown')
    expect(res.status).toBe(404)
  })

  it('responds 404 or 405 for unsupported method on /api/contact', async () => {
    const res = await app.request('/api/contact', { method: 'GET' })
    expect([404, 405]).toContain(res.status)
  })
})
