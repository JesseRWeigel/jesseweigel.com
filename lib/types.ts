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
}

export interface Project extends ProjectFrontmatter {
  slug: string
  content: string
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
