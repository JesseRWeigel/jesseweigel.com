'use client'

import Link from 'next/link'
import { useState, useRef, useCallback } from 'react'

export function NavLogo() {
  const [showKanji, setShowKanji] = useState(false)
  const clickTimes = useRef<number[]>([])
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClick = useCallback(() => {
    const now = Date.now()
    clickTimes.current.push(now)

    // Keep only clicks within the last 3 seconds
    clickTimes.current = clickTimes.current.filter((t) => now - t < 3000)

    if (resetTimer.current) clearTimeout(resetTimer.current)

    if (clickTimes.current.length >= 7) {
      clickTimes.current = []
      setShowKanji(true)
      resetTimer.current = setTimeout(() => setShowKanji(false), 3000)
    } else {
      // Reset buffer if idle for 3s
      resetTimer.current = setTimeout(() => {
        clickTimes.current = []
      }, 3000)
    }
  }, [])

  return (
    <Link
      href="/"
      onClick={handleClick}
      className="font-mono text-sm tracking-wider text-primary transition-all hover:opacity-80"
      style={{
        transition: 'all 0.3s ease',
        ...(showKanji ? { textShadow: '0 0 12px rgba(245,158,11,0.8)' } : {}),
      }}
    >
      {showKanji ? '目付' : 'JW'}
    </Link>
  )
}
