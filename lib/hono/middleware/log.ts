import { createMiddleware } from 'hono/factory'

export const log = createMiddleware(async (c, next) => {
  const start = Date.now()
  await next()
  if (process.env.NODE_ENV !== 'test') {
    console.log(JSON.stringify({
      level: 'info',
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      durationMs: Date.now() - start,
      country: c.req.header('cf-ipcountry'),
    }))
  }
})
