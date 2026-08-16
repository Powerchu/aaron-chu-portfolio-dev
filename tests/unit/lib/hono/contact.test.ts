import { contactRoute } from '@/lib/hono/routes/contact'

const env = {
  RESEND_API_KEY: 'test-resend-key',
  TURNSTILE_SECRET: 'test-secret',
}

describe('POST /api/contact', () => {
  it('returns 400 on bot detection', async () => {
    const res = await contactRoute.request('/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'spam',
        email: 'spam@spam.com',
        message: 'spam',
        turnstileToken: 'invalid-token',
      }),
    }, env as any)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/bot|verification/i)
  })

  it('returns 400 on missing fields', async () => {
    const res = await contactRoute.request('/', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'X' }),
    }, env as any)
    expect(res.status).toBe(400)
  })
})
