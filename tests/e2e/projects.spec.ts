import { test, expect } from '@playwright/test'

test('projects page lists all projects', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.getByRole('heading', { level: 1, name: /projects/i })).toBeVisible()
})

test('category filter shows only matching projects', async ({ page }) => {
  await page.goto('/projects?category=ai')
  await expect(
    page.getByRole('navigation', { name: /filter projects/i }).getByRole('link', { name: 'AI Engineering', exact: true })
  ).toHaveAttribute('aria-current', 'page')
})
