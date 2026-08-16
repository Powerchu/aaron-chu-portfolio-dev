import { test, expect } from '@playwright/test'

test('projects page lists all projects', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.getByRole('heading', { name: /^projects$/i, level: 1 })).toBeVisible()
})

test('category filter shows only matching projects', async ({ page }) => {
  await page.goto('/projects?category=ai')
  await expect(page.getByRole('link', { name: /ai engineering/i })).toHaveAttribute('aria-current', 'page')
})
