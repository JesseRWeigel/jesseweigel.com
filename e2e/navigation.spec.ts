import { test, expect } from '@playwright/test'

test('nav links work', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation').getByText('Work', { exact: true }).click()
  await expect(page).toHaveURL('/workshop')
})

test('404 page shows for invalid routes', async ({ page }) => {
  await page.goto('/nonexistent-page')
  await expect(page.getByText('404')).toBeVisible()
  await expect(page.getByText('Return to The Observatory')).toBeVisible()
})

test('mobile menu exposes the full primary navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Open navigation menu' }).click()
  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toBeVisible()
  await expect(page.locator('.mobile-nav-primary').getByRole('link', { name: /Work/ })).toBeVisible()
})

test('keyboard tools remain available on demand', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Backquote')
  await expect(page.getByText('observatory terminal')).toBeVisible()
  await page.keyboard.press('Escape')
  await page.keyboard.press('/')
  await expect(page.getByPlaceholder('Search projects, talks, posts...')).toBeVisible()
})
