import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectFilters } from '@/components/project-filters'

describe('ProjectFilters', () => {
  it('renders all category buttons plus "All"', () => {
    render(<ProjectFilters active={null} onFilter={() => {}} />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Agent Orchestration')).toBeInTheDocument()
    expect(screen.getByText('Games')).toBeInTheDocument()
  })
  it('calls onFilter with category when clicked', () => {
    const onFilter = vi.fn()
    render(<ProjectFilters active={null} onFilter={onFilter} />)
    fireEvent.click(screen.getByText('Games'))
    expect(onFilter).toHaveBeenCalledWith('games')
  })
  it('calls onFilter with null when "All" is clicked', () => {
    const onFilter = vi.fn()
    render(<ProjectFilters active="games" onFilter={onFilter} />)
    fireEvent.click(screen.getByText('All'))
    expect(onFilter).toHaveBeenCalledWith(null)
  })
})
