import { test, expect } from '@playwright/test'

test('experience page renders', async ({ page }) => {
  await page.goto('/experience')
  await expect(page.getByRole('heading', { name: /^experience$/i, level: 1 })).toBeVisible()
})

test('about page renders', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { name: /^about$/i, level: 1 })).toBeVisible()
})
