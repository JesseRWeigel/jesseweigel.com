import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GitHubStars } from '@/components/github-stars'

describe('GitHub star snapshots', () => {
  it('labels a verified count with the UTC observation date', () => {
    const { container } = render(<GitHubStars count={34} checkedAt="2026-10-28T00:01:00Z" />)
    expect(container).toHaveTextContent('★ 34 (as of Oct 28, 2026)')
    expect(screen.getByText('Oct 28, 2026')).toHaveAttribute('datetime', '2026-10-28T00:01:00Z')
  })
  it('does not publish an undated or invalid snapshot', () => {
    const { container, rerender } = render(<GitHubStars count={34} />)
    expect(container).toBeEmptyDOMElement()
    rerender(<GitHubStars count={34} checkedAt="invalid" />)
    expect(container).toBeEmptyDOMElement()
  })
})
