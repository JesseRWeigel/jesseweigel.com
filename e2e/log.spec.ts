import { test, expect } from '@playwright/test'

test('log page shows blog posts', async ({ page }) => {
  await page.goto('/log')
  await expect(page.getByRole('heading', { name: 'Notes from systems after the demo ends.' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'The Thirteen-Hour Freeze' })).toBeVisible()
  await expect(page.getByText(/Metsuke, Jesse's AI collaborator/i)).toBeVisible()
})

test('blog post detail page loads', async ({ page }) => {
  await page.goto('/log/2026-07-01-the-thirteen-hour-freeze')
  await expect(page.getByRole('heading', { name: 'The Thirteen-Hour Freeze' })).toBeVisible()
  await expect(page.getByLabel('AI authorship disclosure')).toBeVisible()
})
