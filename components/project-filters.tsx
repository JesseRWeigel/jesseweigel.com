'use client'

import type { ProjectCategory } from '@/lib/types'

const CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: 'agent-orchestration', label: 'Agent Orchestration' },
  { value: 'games', label: 'Games' },
  { value: 'ai-tools', label: 'AI Tools' },
  { value: 'education', label: 'Education' },
  { value: 'research', label: 'Research' },
  { value: 'creative', label: 'Creative' },
]

interface ProjectFiltersProps {
  active: ProjectCategory | null
  onFilter: (category: ProjectCategory | null) => void
}

export function ProjectFilters({ active, onFilter }: ProjectFiltersProps) {
  return (
    <div className="project-filters" aria-label="Filter projects by category">
      <button
        type="button"
        onClick={() => onFilter(null)}
        aria-pressed={active === null}
      >
        All
      </button>
      {CATEGORIES.map(({ value, label }) => (
        <button
          type="button"
          key={value}
          onClick={() => onFilter(value)}
          aria-pressed={active === value}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
