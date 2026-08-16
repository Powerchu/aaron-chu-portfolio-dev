import { test, expect } from '@playwright/test'

test('project detail page renders for a known slug', async ({ page }) => {
  await page.goto('/projects/portfolio-cms')
  await expect(page.getByRole('heading', { name: /headless portfolio cms/i })).toBeVisible()
  await expect(page.getByText(/built a multi-tenant cms/i)).toBeVisible()
})

test('unknown project slug returns 404', async ({ page }) => {
  const response = await page.goto('/projects/does-not-exist')
  expect(response?.status()).toBe(404)
})
