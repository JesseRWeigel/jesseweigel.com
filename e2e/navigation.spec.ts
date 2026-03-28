import { test, expect } from '@playwright/test'

test('nav links work', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation').getByText('Workshop').click()
  await expect(page).toHaveURL('/workshop')
})

test('404 page shows for invalid routes', async ({ page }) => {
  await page.goto('/nonexistent-page')
  await expect(page.getByText('404')).toBeVisible()
  await expect(page.getByText('Return to The Observatory')).toBeVisible()
})
