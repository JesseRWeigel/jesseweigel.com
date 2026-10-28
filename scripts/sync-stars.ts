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
    const { data } = matter(raw)

    if (!data.github) continue

    // Extract owner/repo from GitHub URL
    const match = (data.github as string).match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) continue
    const [, owner, repo] = match

    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        signal: AbortSignal.timeout(15_000),
        headers: {
          Accept: 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
      })
      if (!res.ok) {
        console.error(`GitHub API error for ${owner}/${repo}: ${res.status}`)
        process.exitCode = 1
        continue
      }
      const json = await res.json() as { stargazers_count: number }
      const stars = json.stargazers_count

      if (!Number.isSafeInteger(stars) || stars < 0) {
        throw new Error(`Invalid GitHub stargazers_count for ${owner}/${repo}`)
      }
      const checkedAt = new Date().toISOString()
      let updated = raw.replace(/^stars:[ \t]*\d+[ \t]*$/m, `stars: ${stars}`)
      if (!/^stars:[ \t]*\d+[ \t]*$/m.test(raw)) {
        throw new Error(`Could not find a stars field in ${file}`)
      }
      updated = /^starsCheckedAt:/m.test(updated)
        ? updated.replace(/^starsCheckedAt:.*$/m, `starsCheckedAt: '${checkedAt}'`)
        : updated.replace(/^stars:.*$/m, `$&\nstarsCheckedAt: '${checkedAt}'`)
      await fs.writeFile(filePath, updated)
      console.log(JSON.stringify({ file, repository: `${owner}/${repo}`, previous: data.stars, stars, checkedAt }))
    } catch (err) {
      console.error(`Failed to fetch stars for ${owner}/${repo}:`, err)
      process.exitCode = 1
    }
  }
}

syncStars()
