import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { verifyTurnstile } from '../turnstile'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required').max(5000),
  turnstileToken: z.string().min(1, 'Verification required'),
})

type Bindings = {
  RESEND_API_KEY: string
  TURNSTILE_SECRET: string
}

export const contactRoute = new Hono<{ Bindings: Bindings }>().post(
  '/',
  zValidator('json', contactSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid input', details: result.error.flatten() }, 400)
    }
    return undefined
  }),
  async (c) => {
    const data = c.req.valid('json')
    const remoteIp = c.req.header('cf-connecting-ip')
    const secret = c.env?.TURNSTILE_SECRET || process.env.TURNSTILE_SECRET || ''
    const apiKey = c.env?.RESEND_API_KEY || process.env.RESEND_API_KEY || ''

    const ok = await verifyTurnstile(data.turnstileToken, secret, remoteIp)
    if (!ok) {
      return c.json({ error: 'Bot detected or verification failed' }, 400)
    }

    if (!apiKey) {
      console.warn('RESEND_API_KEY is not configured')
      return c.json({ ok: true, mocked: true })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: 'portfolio@aaronchu.cc',
        to: ['aaron_powerchu@hotmail.com'],
        subject: `[Portfolio] Message from ${data.name}`,
        text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
      }),
    })

    if (!res.ok) {
      console.error('Resend error:', await res.text())
      return c.json({ error: 'Send failed' }, 500)
    }

    return c.json({ ok: true })
  }
)
