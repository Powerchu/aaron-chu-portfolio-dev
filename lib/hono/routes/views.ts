import { Hono } from 'hono'
import type { KVNamespace } from '@cloudflare/workers-types'

type Bindings = {
  VIEWS?: KVNamespace
}

export const viewsRoute = new Hono<{ Bindings: Bindings }>()
  .get('/:slug', async (c) => {
    const slug = c.req.param('slug')
    if (!c.env?.VIEWS) {
      return c.json({ slug, views: 0 })
    }
    const count = (await c.env.VIEWS.get(`project:${slug}`)) ?? '0'
    return c.json({ slug, views: parseInt(count, 10) || 0 })
  })
  .post('/:slug', async (c) => {
    const slug = c.req.param('slug')
    if (!c.env?.VIEWS) {
      return c.json({ slug, views: 1 })
    }
    const current = parseInt((await c.env.VIEWS.get(`project:${slug}`)) ?? '0', 10) || 0
    const next = current + 1
    await c.env.VIEWS.put(`project:${slug}`, String(next))
    return c.json({ slug, views: next })
  })
