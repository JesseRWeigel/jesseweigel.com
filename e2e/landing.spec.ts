import { getProjectBySlug } from '../lib/content'
import { test, expect } from '@playwright/test'

test('landing page loads with title', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Jesse Weigel.*Senior AI/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Explore selected work/i })).toBeVisible()
})

test('homepage foregrounds proof and a contact path', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Selected work, with the evidence.' })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Have a difficult AI systems problem/i })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Start a conversation' })).toBeVisible()
})

test('homepage uses current positioning and foregrounds original work', async ({ page }) => {
  await page.goto('/')

  const hero = page.locator('.hero-shell')
  await expect(hero.locator('.signal-core')).toHaveCount(0)
  await expect(hero).not.toContainText('father of four')
  await expect(hero).not.toContainText('learning in public since')
  await expect(hero.getByRole('link', { name: /Contextrot/i })).toBeVisible()

  const featuredWork = page.locator('.featured-project-list')
  await expect(featuredWork.getByRole('heading', { name: 'Contextrot' })).toBeVisible()
  await expect(featuredWork.getByRole('heading', { name: /Get-X-Done/i })).toHaveCount(0)
})


test('hiring essentials work on mobile without JavaScript or WebGL', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Senior AI & full-stack engineer')
  const hero = page.locator('.hero-shell')
  await expect(hero).toContainText('Open to senior engineering roles')
  await expect(hero.getByRole('link', { name: 'View résumé' })).toBeVisible()
  await expect(hero.getByRole('link', { name: 'Contact me' })).toBeVisible()
  await expect(hero).not.toContainText('currently a Generative AI Engineer at TRACTIAN')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: '../preview-mobile.png', fullPage: true })
  await context.close()
})

test('case studies and public resume are reachable', async ({ page }) => {
  for (const path of ['/workshop/toryo', '/workshop/minecraft-agent-swarm', '/workshop/contextrot', '/resume', '/transmissions', '/contact']) {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page.locator('main h1')).toBeVisible()
  }
  await page.goto('/')
  await page.screenshot({ path: '../preview-desktop.png', fullPage: true })
})


test('public contact links and resume use Jesse’s verified address', async ({ page }) => {
  for (const path of ['/', '/contact', '/resume', '/transmissions', '/about']) {
    await page.goto(path)
    await expect(page.locator('body')).not.toContainText('jesse@jesseweigel.com')
    const links = page.locator('a[href^="mailto:"]')
    expect(await links.count()).toBeGreaterThan(0)
    for (const href of await links.evaluateAll(nodes => nodes.map(node => node.getAttribute('href')))) {
      expect(href?.split('?')[0]).toBe('mailto:jesseweigel@gmail.com')
    }
  }
  await page.goto('/resume')
  await expect(page.locator('.resume-header address')).toContainText('jesseweigel@gmail.com')
  await expect(page.locator('.resume-header a[href^="mailto:"]')).toHaveAttribute('href', 'mailto:jesseweigel@gmail.com')
  await page.screenshot({ path: '../resume-email-corrected.png', fullPage: true })
})


test('Minecraft star count is a dated snapshot on every project surface', async ({ page }) => {
  const project = await getProjectBySlug('minecraft-agent-swarm')
  expect(project?.starsCheckedAt).toBeTruthy()
  const snapshotDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(project!.starsCheckedAt!))
  for (const path of ['/', '/workshop', '/workshop/minecraft-agent-swarm']) {
    await page.goto(path)
    const link = page.locator('a[href="https://github.com/JesseRWeigel/minecraft-agent-swarm"]').filter({ hasText: '★' })
    await expect(link).toContainText(`★ ${project!.stars}`)
    await expect(link).toContainText(`as of ${snapshotDate}`)
    await expect(link.locator('time')).toHaveAttribute('datetime', project!.starsCheckedAt!)
  }
})
