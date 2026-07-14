import { test, expect } from '@playwright/test'

test('landing page loads with title', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /I build AI systems that learn/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Explore the agent swarm/i })).toBeVisible()
})

test('homepage foregrounds proof and a contact path', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Proof, not prototypes.' })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Have a difficult AI systems problem/i })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Start a conversation' })).toBeVisible()
})
