import { siteConfig } from '@/lib/siteConfig'

describe('siteConfig', () => {
  it('has the correct URL', () => {
    expect(siteConfig.url).toBe('https://aaronchu.cc')
  })

  it('has GitHub SSO-linked Cloudflare account', () => {
    expect(siteConfig.author.email).toBe('aaron_powerchu@hotmail.com')
    expect(siteConfig.cloudflare.accountId).toBe('65cbc69e461eb925f39d60fe6490f8d1')
  })

  it('has 5 project categories defined', () => {
    expect(Object.keys(siteConfig.categories)).toHaveLength(5)
    expect(siteConfig.categories).toHaveProperty('full-stack')
    expect(siteConfig.categories).toHaveProperty('ai')
    expect(siteConfig.categories).toHaveProperty('graphic-design')
    expect(siteConfig.categories).toHaveProperty('game-dev')
    expect(siteConfig.categories).toHaveProperty('photography')
  })
})
