import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/lib/types'

const statusLabels: Record<string, string> = {
  active: 'Active',
  experimental: 'Experiment',
  archived: 'Archive',
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      {project.cover ? (
        <Link href={`/workshop/${project.slug}`} className="project-card-image" aria-label={`View ${project.title}`}>
          <Image
            src={project.cover}
            alt=""
            fill
            sizes="(max-width: 720px) 100vw, 33vw"
          />
        </Link>
      ) : (
        <Link href={`/workshop/${project.slug}`} className="project-card-placeholder" aria-label={`View ${project.title}`}>
          <span>{project.category.replaceAll('-', ' ')}</span>
          <strong>{project.title.slice(0, 2).toUpperCase()}</strong>
        </Link>
      )}

      <div className="project-card-body">
        <div className="project-card-topline">
          <span className={`project-status status-${project.status}`}>{statusLabels[project.status]}</span>
          <span>{project.category.replaceAll('-', ' ')}</span>
        </div>
        <Link href={`/workshop/${project.slug}`} className="project-card-title">{project.title}</Link>
        <p>{project.description}</p>
        <div className="project-card-tech">
          {project.tech.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="project-card-footer">
          <Link href={`/workshop/${project.slug}`}>Case study →</Link>
          <div>
            <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub repository for ${project.title}`}>
              GitHub{project.stars > 0 ? ` · ★${project.stars}` : ''}
            </a>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label={`Demo for ${project.title}`}>Demo ↗</a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
