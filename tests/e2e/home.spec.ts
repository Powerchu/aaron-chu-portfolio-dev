import { test, expect } from '@playwright/test'

test('home page renders hero, disciplines, and featured projects', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: /aaron chu/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /full stack/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /featured work/i })).toBeVisible()
})
