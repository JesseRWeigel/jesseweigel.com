import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const PROJECTS_DIR = path.join(process.cwd(), 'content/projects')

async function syncStars() {
  const files = await fs.readdir(PROJECTS_DIR)

  for (const file of files) {
    if (!file.endsWith('.mdx')) continue
    const filePath = path.join(PROJECTS_DIR, file)
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(raw)

    if (!data.github) continue

    // Extract owner/repo from GitHub URL
    const match = (data.github as string).match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) continue
    const [, owner, repo] = match

    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
      })
      if (!res.ok) {
        console.error(`GitHub API error for ${owner}/${repo}: ${res.status}`)
        continue
      }
      const json = await res.json() as { stargazers_count: number }
      const stars = json.stargazers_count

      if (stars !== data.stars) {
        data.stars = stars
        const updated = matter.stringify(content, data)
        await fs.writeFile(filePath, updated)
        console.log(`Updated ${file}: ${stars} stars`)
      } else {
        console.log(`No change for ${file}: ${stars} stars`)
      }
    } catch (err) {
      console.error(`Failed to fetch stars for ${owner}/${repo}:`, err)
    }
  }
}

syncStars()
