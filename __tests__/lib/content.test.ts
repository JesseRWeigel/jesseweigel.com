import { describe, it, expect } from 'vitest'
import {
  getProjects,
  getProjectBySlug,
  getTransmissions,
  getBlogPosts,
  getBlogPostBySlug,
} from '@/lib/content'

describe('getProjects', () => {
  it('returns an array of projects', async () => {
    const projects = await getProjects()
    expect(Array.isArray(projects)).toBe(true)
  })

  it('each project has required frontmatter fields', async () => {
    const projects = await getProjects()
    if (projects.length === 0) return
    const p = projects[0]
    expect(p).toHaveProperty('title')
    expect(p).toHaveProperty('slug')
    expect(p).toHaveProperty('description')
    expect(p).toHaveProperty('category')
    expect(p).toHaveProperty('status')
    expect(p).toHaveProperty('github')
    expect(p).toHaveProperty('tech')
  })
})

describe('getProjectBySlug', () => {
  it('returns null for non-existent slug', async () => {
    const result = await getProjectBySlug('does-not-exist-xyz')
    expect(result).toBeNull()
  })
})

describe('getTransmissions', () => {
  it('returns an array of transmissions', async () => {
    const transmissions = await getTransmissions()
    expect(Array.isArray(transmissions)).toBe(true)
  })
})

describe('getBlogPosts', () => {
  it('returns an array sorted by date descending', async () => {
    const posts = await getBlogPosts()
    expect(Array.isArray(posts)).toBe(true)
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime())
        .toBeGreaterThanOrEqual(new Date(posts[i].date).getTime())
    }
  })
})

describe('getBlogPostBySlug', () => {
  it('returns null for non-existent slug', async () => {
    const result = await getBlogPostBySlug('does-not-exist-xyz')
    expect(result).toBeNull()
  })
})
