'use client'

import { useTerminal } from '@/components/terminal-provider'

export function TerminalTrigger() {
  const { toggle } = useTerminal()
  return (
    <button
      onClick={toggle}
      className="rounded border border-white/10 px-2 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:text-primary sm:hidden"
      aria-label="Open terminal"
    >
      &gt;_
    </button>
  )
}
