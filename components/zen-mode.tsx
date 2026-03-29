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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <p className="hidden font-mono text-[10px] text-muted-foreground/40 sm:block">
          press z or esc to exit
        </p>
        <button
          onClick={() => setActive(false)}
          className="rounded border border-white/10 px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors active:text-primary sm:hidden"
        >
          exit zen
        </button>
      </div>
    </div>
  )
}
