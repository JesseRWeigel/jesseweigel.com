'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

export function EasterEggs() {
  const [konamiActive, setKonamiActive] = useState(false)
  const [helloActive, setHelloActive] = useState(false)
  const konamiProgress = useRef<string[]>([])
  const helloBuffer = useRef('')
  const konamiTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const helloTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerKonami = useCallback(() => {
    setKonamiActive(true)
    setTimeout(() => setKonamiActive(false), 3000)
  }, [])

  const triggerHello = useCallback(() => {
    setHelloActive(true)
    setTimeout(() => setHelloActive(false), 2000)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      const isInput = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable

      // Konami code — works globally including inputs
      konamiProgress.current.push(e.key)
      if (konamiProgress.current.length > KONAMI.length) {
        konamiProgress.current.shift()
      }
      if (
        konamiProgress.current.length === KONAMI.length &&
        konamiProgress.current.every((k, i) => k === KONAMI[i])
      ) {
        konamiProgress.current = []
        triggerKonami()
        return
      }

      // Reset konami buffer after 3s of inactivity
      if (konamiTimer.current) clearTimeout(konamiTimer.current)
      konamiTimer.current = setTimeout(() => {
        konamiProgress.current = []
      }, 3000)

      // "hello" buffer — only outside inputs
      if (!isInput && e.key.length === 1) {
        helloBuffer.current += e.key.toLowerCase()
        if (helloBuffer.current.length > 5) {
          helloBuffer.current = helloBuffer.current.slice(-5)
        }
        if (helloBuffer.current.endsWith('hello')) {
          helloBuffer.current = ''
          triggerHello()
        }
        if (helloTimer.current) clearTimeout(helloTimer.current)
        helloTimer.current = setTimeout(() => {
          helloBuffer.current = ''
        }, 2000)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [triggerKonami, triggerHello])

  return (
    <>
      {/* Konami code overlay */}
      {konamiActive && (
        <div
          className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center"
          style={{ animation: 'konami-flash 3s ease-out forwards' }}
        >
          <div className="relative">
            {/* Retro scanline overlay */}
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
                pointerEvents: 'none',
              }}
            />
            <div
              className="rounded-lg border-2 px-8 py-6 text-center font-mono"
              style={{
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(0,0,0,0.92)',
                boxShadow: '0 0 40px #f59e0b, 0 0 80px rgba(245,158,11,0.3)',
                animation: 'konami-glow 0.5s ease-in-out infinite alternate',
              }}
            >
              <p className="text-xs tracking-widest" style={{ color: '#f59e0b' }}>
                ★ ACHIEVEMENT UNLOCKED ★
              </p>
              <p className="mt-2 text-2xl font-bold" style={{ color: '#fbbf24' }}>
                YOU KNOW THE CODE
              </p>
              <p className="mt-1 text-xs" style={{ color: 'rgba(251,191,36,0.7)' }}>
                ↑ ↑ ↓ ↓ ← → ← → B A
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hello World flash */}
      {helloActive && (
        <div className="pointer-events-none fixed inset-0 z-[150] flex items-center justify-center">
          <p
            className="font-mono text-4xl font-bold tracking-wider"
            style={{
              color: '#f59e0b',
              textShadow: '0 0 20px rgba(245,158,11,0.8)',
              animation: 'hello-fade 2s ease-out forwards',
            }}
          >
            Hello, World!
          </p>
        </div>
      )}

      <style>{`
        @keyframes konami-flash {
          0% { opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes konami-glow {
          from { box-shadow: 0 0 20px #f59e0b, 0 0 40px rgba(245,158,11,0.3); }
          to { box-shadow: 0 0 40px #f59e0b, 0 0 80px rgba(245,158,11,0.5); }
        }
        @keyframes hello-fade {
          0% { opacity: 0; transform: scale(0.8); }
          20% { opacity: 1; transform: scale(1.05); }
          70% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.1); }
        }
      `}</style>
    </>
  )
}
