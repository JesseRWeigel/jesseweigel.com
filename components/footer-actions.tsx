'use client'

import { useTerminal } from '@/components/terminal-provider'

export function FooterActions() {
  const { toggle: toggleTerminal } = useTerminal()

  const triggerZen = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z' }))
  }

  const triggerSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }))
  }

  return (
    <>
      {/* Desktop: keyboard hints */}
      <p className="hidden text-center font-mono text-[10px] text-muted-foreground md:block">
        <kbd>`</kbd> terminal · <kbd>z</kbd> focus · <kbd>/</kbd> search
      </p>

      {/* Mobile: tappable buttons */}
      <div className="footer-tools-mobile md:hidden">
        <button
          type="button"
          onClick={toggleTerminal}
          className="footer-tool-button"
        >
          &gt;_ terminal
        </button>
        <button
          type="button"
          onClick={triggerZen}
          className="footer-tool-button"
        >
          ◐ zen
        </button>
        <button
          type="button"
          onClick={triggerSearch}
          className="footer-tool-button"
        >
          / search
        </button>
      </div>
    </>
  )
}
