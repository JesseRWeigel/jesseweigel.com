export type ProjectStatus = 'active' | 'experimental' | 'archived'

export type ProjectCategory =
  | 'agent-orchestration'
  | 'games'
  | 'ai-tools'
  | 'education'
  | 'research'
  | 'creative'

export interface ProjectFrontmatter {
  title: string
  description: string
  category: ProjectCategory
  status: ProjectStatus
  github: string
  demo: string | null
  tech: string[]
  stars: number
  featured: boolean
  /** Jesse's role or primary contribution to the project. */
  role?: string
  /** Short project timeframe shown in the case-study header. */
  timeframe?: string
  /** Compact, evidence-focused results shown near the top of the case study. */
  outcomes?: Array<{ value: string; label: string }>
  /** Optional hero image (path under /public), shown on the card and detail page. */
  cover?: string
  /** Optional additional images (paths under /public), shown as a gallery on the detail page. */
  images?: string[]
}

export interface Project extends ProjectFrontmatter {
  slug: string
  content: string
}

export interface MilestoneStat {
  name: string
  label: string
  bestSec: number
}

export interface SessionStat {
  id: string
  durationSec: number
  actions: number
  successRate: number
  deaths: number
}

export interface ProjectStats {
  generatedAt: string
  sessionCount: number
  coldStartCount: number
  totalActions: number
  totalSuccesses: number
  successRate: number
  totalDeaths: number
  itemsDeposited: number
  longestSessionSec: number
  milestones: MilestoneStat[]
  sessions: SessionStat[]
}

export type TransmissionType = 'talk' | 'podcast' | 'youtube'

export interface TransmissionFrontmatter {
  title: string
  description: string
  type: TransmissionType
  venue: string
  date: string
  links: {
    listen?: string
    watch?: string
    slides?: string
    spotify?: string
  }
}

export interface Transmission extends TransmissionFrontmatter {
  slug: string
  content: string
}

export interface BlogPostFrontmatter {
  title: string
  date: string
  tags: string[]
  excerpt: string
  /** Named author. Metsuke is Jesse's AI collaborator and site chronicler. */
  author?: string
}

export interface BlogPost extends BlogPostFrontmatter {
  slug: string
  content: string
  readingTime: string
}

export interface ArchiveFrontmatter {
  title: string
  description: string
  date: string
  category: 'paper' | 'analysis' | 'report'
  links: {
    pdf?: string
    github?: string
    arxiv?: string
  }
}

export interface ArchiveEntry extends ArchiveFrontmatter {
  slug: string
  content: string
}
