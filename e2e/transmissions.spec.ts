import { test, expect } from '@playwright/test'

test('transmissions page renders all sections', async ({ page }) => {
  await page.goto('/transmissions')
  await expect(page.getByText('Conference Talks')).toBeVisible()
  await expect(page.getByText('Podcast Appearances')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'YouTube', exact: true })).toBeVisible()
})

test('talk cards have slide links', async ({ page }) => {
  await page.goto('/transmissions')
  await expect(page.getByText('How Live Coding Changed My Life')).toBeVisible()
  // Check at least one "Slides" link exists
  await expect(page.getByRole('link', { name: 'Slides' }).first()).toBeVisible()
})
