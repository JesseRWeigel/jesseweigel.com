'use client'

import { useState, useRef, useCallback } from 'react'

export function FooterName() {
  const [tooltip, setTooltip] = useState(false)
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handlePressStart = useCallback(() => {
    pressTimer.current = setTimeout(() => {
      setTooltip(true)
      setTimeout(() => setTooltip(false), 3000)
    }, 3000)
  }, [])

  const handlePressEnd = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current)
      pressTimer.current = null
    }
  }, [])

  return (
    <span
      className="relative select-none cursor-default"
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
    >
      Jesse Weigel
      {tooltip && (
        <span
          className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded border border-primary/30 bg-background px-2 py-1 font-mono text-[10px] text-primary"
          style={{
            boxShadow: '0 0 12px rgba(245,158,11,0.2)',
            animation: 'tooltip-appear 0.2s ease-out',
          }}
        >
          Built with curiosity and too many tokens
          <style>{`
            @keyframes tooltip-appear {
              from { opacity: 0; transform: translateX(-50%) translateY(4px); }
              to { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
          `}</style>
        </span>
      )}
    </span>
  )
}
