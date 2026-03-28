import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type {
  Project, ProjectFrontmatter,
  Transmission, TransmissionFrontmatter,
  BlogPost, BlogPostFrontmatter,
} from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content')

async function getFilesFromDir(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files: string[] = []
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...(await getFilesFromDir(fullPath)))
      } else if (entry.name.endsWith('.mdx')) {
        files.push(fullPath)
      }
    }
    return files
  } catch {
    return []
  }
}

function slugFromPath(filePath: string): string {
  return path.basename(filePath, '.mdx')
}

export async function getProjects(): Promise<Project[]> {
  const dir = path.join(CONTENT_DIR, 'projects')
  const files = await getFilesFromDir(dir)
  const projects: Project[] = []
  for (const file of files) {
    const raw = await fs.readFile(file, 'utf-8')
    const { data, content } = matter(raw)
    const fm = data as ProjectFrontmatter
    projects.push({ ...fm, slug: slugFromPath(file), content })
  }
  return projects.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return b.stars - a.stars
  })
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const filePath = path.join(CONTENT_DIR, 'projects', `${slug}.mdx`)
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(raw)
    return { ...(data as ProjectFrontmatter), slug, content }
  } catch {
    return null
  }
}

export async function getTransmissions(): Promise<Transmission[]> {
  const dir = path.join(CONTENT_DIR, 'transmissions')
  const files = await getFilesFromDir(dir)
  const transmissions: Transmission[] = []
  for (const file of files) {
    const raw = await fs.readFile(file, 'utf-8')
    const { data, content } = matter(raw)
    transmissions.push({ ...(data as TransmissionFrontmatter), slug: slugFromPath(file), content })
  }
  return transmissions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const dir = path.join(CONTENT_DIR, 'log')
  const files = await getFilesFromDir(dir)
  const posts: BlogPost[] = []
  for (const file of files) {
    const raw = await fs.readFile(file, 'utf-8')
    const { data, content } = matter(raw)
    posts.push({
      ...(data as BlogPostFrontmatter),
      slug: slugFromPath(file),
      content,
      readingTime: readingTime(content).text,
    })
  }
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(CONTENT_DIR, 'log', `${slug}.mdx`)
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(raw)
    return { ...(data as BlogPostFrontmatter), slug, content, readingTime: readingTime(content).text }
  } catch {
    return null
  }
}
