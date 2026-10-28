'use client'

import { useState } from 'react'
import { ProjectCard } from '@/components/project-card'
import { ProjectFilters } from '@/components/project-filters'
import type { Project, ProjectCategory } from '@/lib/types'

interface WorkshopClientProps {
  projects: Project[]
}

export function WorkshopClient({ projects }: WorkshopClientProps) {
  const [filter, setFilter] = useState<ProjectCategory | null>(null)

  const filtered = filter ? projects.filter((p) => p.category === filter) : projects

  return (
    <div className="work-browser">
      <ProjectFilters active={filter} onFilter={setFilter} />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects in this category yet.</p>
      ) : (
        <div className="project-card-grid">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
