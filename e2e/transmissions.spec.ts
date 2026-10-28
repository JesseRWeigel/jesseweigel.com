import { test, expect } from '@playwright/test'

test('transmissions page renders all sections', async ({ page }) => {
  await page.goto('/transmissions')
  await expect(page.getByRole('heading', { name: 'Talks that started with real work.' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'The story behind the systems.' })).toBeVisible()
  await expect(page.getByRole('heading', { name: /226 episodes/i })).toBeVisible()
})

test('talk cards have slide links', async ({ page }) => {
  await page.goto('/transmissions')
  await expect(page.getByText('How Live Coding Changed My Life')).toBeVisible()
  // Check at least one "Slides" link exists
  await expect(page.getByRole('link', { name: 'Slides ↗' }).first()).toBeVisible()
})
