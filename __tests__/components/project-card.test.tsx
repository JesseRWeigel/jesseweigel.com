import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectCard } from '@/components/project-card'
import type { Project } from '@/lib/types'

const mockProject: Project = {
  title: 'Test Project',
  description: 'A test project description',
  category: 'games',
  status: 'active',
  github: 'https://github.com/test/test',
  demo: 'https://test.com',
  tech: ['React', 'TypeScript'],
  stars: 42,
  featured: true,
  slug: 'test-project',
  content: 'Full description here.',
}

describe('ProjectCard', () => {
  it('renders project title and description', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('A test project description')).toBeInTheDocument()
  })
  it('renders tech tags', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })
  it('renders status badge', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('active')).toBeInTheDocument()
  })
  it('renders GitHub link', () => {
    render(<ProjectCard project={mockProject} />)
    const link = screen.getByRole('link', { name: /github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/test/test')
  })
  it('renders demo link when present', () => {
    render(<ProjectCard project={mockProject} />)
    const link = screen.getByRole('link', { name: /demo/i })
    expect(link).toHaveAttribute('href', 'https://test.com')
  })
  it('does not render demo link when null', () => {
    render(<ProjectCard project={{ ...mockProject, demo: null }} />)
    expect(screen.queryByRole('link', { name: /demo/i })).not.toBeInTheDocument()
  })
})
