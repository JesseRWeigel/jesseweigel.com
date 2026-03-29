'use client'

import { useTerminal } from '@/components/terminal-provider'
import { useState, useEffect } from 'react'

export function FooterActions() {
  const { toggle: toggleTerminal } = useTerminal()
  const [zenActive, setZenActive] = useState(false)

  const triggerZen = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z' }))
  }

  const triggerSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }))
  }

  return (
    <>
      {/* Desktop: keyboard hints */}
      <p className="hidden text-center font-mono text-[10px] text-muted-foreground sm:block">
        Press <kbd className="rounded border border-white/10 px-1">`</kbd> for terminal · <kbd className="rounded border border-white/10 px-1">z</kbd> for zen · <kbd className="rounded border border-white/10 px-1">/</kbd> to search
      </p>

      {/* Mobile: tappable buttons */}
      <div className="flex gap-2 sm:hidden">
        <button
          onClick={toggleTerminal}
          className="rounded border border-white/10 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors active:text-primary"
        >
          &gt;_ terminal
        </button>
        <button
          onClick={triggerZen}
          className="rounded border border-white/10 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors active:text-primary"
        >
          ◐ zen
        </button>
        <button
          onClick={triggerSearch}
          className="rounded border border-white/10 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors active:text-primary"
        >
          / search
        </button>
      </div>
    </>
  )
}
