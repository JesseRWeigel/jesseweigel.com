import { test, expect } from '@playwright/test'

test('landing page loads with title', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Jesse Weigel' }).first()).toBeVisible()
  await expect(page.getByText('The Observatory').first()).toBeVisible()
})

test('below-fold navigation cards are visible', async ({ page }) => {
  await page.goto('/')
  // Scroll down to see below-fold content
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(page.getByRole('link', { name: /Workshop/i }).first()).toBeVisible()
})
