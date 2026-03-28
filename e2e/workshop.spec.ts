import { test, expect } from '@playwright/test'

test('workshop page renders projects', async ({ page }) => {
  await page.goto('/workshop')
  await expect(page.getByRole('heading', { name: 'Workshop' })).toBeVisible()
  await expect(page.getByText('Toryo').first()).toBeVisible()
  await expect(page.getByRole('link', { name: 'HunterPath', exact: true })).toBeVisible()
})

test('category filters work', async ({ page }) => {
  await page.goto('/workshop')
  await page.getByRole('button', { name: 'Games' }).click()
  await expect(page.getByRole('link', { name: 'HunterPath', exact: true })).toBeVisible()
  // Toryo is agent-orchestration, should be filtered out
  await expect(page.getByText('Toryo').first()).not.toBeVisible()
})

test('project detail page loads', async ({ page }) => {
  await page.goto('/workshop/toryo')
  await expect(page.getByRole('heading', { name: 'Toryo' })).toBeVisible()
  await expect(page.getByRole('main').getByRole('link', { name: 'GitHub' })).toBeVisible()
})
