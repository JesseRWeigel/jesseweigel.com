import { test, expect } from '@playwright/test'

test('log page shows blog posts', async ({ page }) => {
  await page.goto('/log')
  await expect(page.getByText('Hello, Observatory')).toBeVisible()
})

test('blog post detail page loads', async ({ page }) => {
  await page.goto('/log/2026-03-28-hello-observatory')
  await expect(page.getByRole('heading', { name: 'Hello, Observatory' })).toBeVisible()
  await expect(page.getByText('Welcome to The Observatory')).toBeVisible()
})
