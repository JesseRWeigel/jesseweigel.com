'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

const ParticleField = dynamic(
  () => import('@/components/particle-field').then((m) => m.ParticleField),
  { ssr: false }
)

export function ZenMode() {
  const [active, setActive] = useState(false)

  const toggle = useCallback(() => setActive((v) => !v), [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'z' && !e.ctrlKey && !e.metaKey) {
        const tag = (e.target as HTMLElement)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        toggle()
      }
      if (e.key === 'Escape' && active) {
        setActive(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggle, active])

  if (!active) return null

  return (
    <div className="fixed inset-0 z-[100] bg-background">
      <ParticleField />
      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
        <p className="font-mono text-[10px] text-muted-foreground/40 transition-opacity">
          press z or esc to exit
        </p>
      </div>
    </div>
  )
}
