import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/lib/types'

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  experimental: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  archived: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm transition-colors hover:border-primary/20">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/workshop/${project.slug}`}
          className="text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          {project.title}
        </Link>
        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[project.status] ?? statusColors.archived}`}
        >
          {project.status}
        </span>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">{project.description}</p>

      {project.tech.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.tech.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center gap-3 pt-1">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          GitHub{project.stars > 0 ? ` ★${project.stars}` : ''}
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Demo"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Demo
          </a>
        )}
      </div>
    </div>
  )
}
