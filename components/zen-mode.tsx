'use client'

import { useCallback, useEffect, useState } from 'react'

const zenStars = [
  ['12%', '18%'], ['28%', '62%'], ['47%', '27%'], ['61%', '73%'],
  ['78%', '21%'], ['88%', '58%'], ['35%', '84%'], ['70%', '43%'],
]

export function ZenMode() {
  const [active, setActive] = useState(false)
  const toggle = useCallback(() => setActive((value) => !value), [])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) return

      if (event.key === 'z' && !event.ctrlKey && !event.metaKey) toggle()
      if (event.key === 'Escape') setActive(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggle])

  if (!active) return null

  return (
    <div className="zen-overlay" role="dialog" aria-modal="true" aria-label="Focus mode">
      <div className="zen-orbit" aria-hidden="true" />
      {zenStars.map(([left, top], index) => (
        <span key={`${left}-${top}`} className={`zen-star zen-star-${index + 1}`} style={{ left, top }} aria-hidden="true" />
      ))}
      <div className="zen-message">
        <span>OBSERVATORY QUIET MODE</span>
        <p>Make room for the next thought.</p>
      </div>
      <button type="button" onClick={() => setActive(false)} className="zen-exit">
        Exit focus mode <kbd>esc</kbd>
      </button>
    </div>
  )
}
