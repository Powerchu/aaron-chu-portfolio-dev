import { Hono } from 'hono'
import { contactRoute } from './routes/contact'
import { viewsRoute } from './routes/views'
import { log } from './middleware/log'

type Bindings = {
  VIEWS: KVNamespace
  RESEND: SendEmail
  TURNSTILE_SITE_KEY: string
  RESEND_API_KEY: string
  TURNSTILE_SECRET: string
}

export const app = new Hono<{ Bindings: Bindings }>()
  .use('*', log)
  .route('/api/contact', contactRoute)
  .route('/api/views', viewsRoute)
