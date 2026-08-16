import { siteConfig } from '@/lib/siteConfig'

export const MEDIA_BASE_URL = siteConfig.mediaUrl

export function mediaUrl(key: string): string {
  return `${MEDIA_BASE_URL}/${key.replace(/^\/+/, '')}`
}
