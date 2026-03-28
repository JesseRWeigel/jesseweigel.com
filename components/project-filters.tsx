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
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onFilter(null)}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          active === null
            ? 'bg-primary text-primary-foreground'
            : 'border border-white/10 text-muted-foreground hover:text-foreground'
        }`}
      >
        All
      </button>
      {CATEGORIES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onFilter(value)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            active === value
              ? 'bg-primary text-primary-foreground'
              : 'border border-white/10 text-muted-foreground hover:text-foreground'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
