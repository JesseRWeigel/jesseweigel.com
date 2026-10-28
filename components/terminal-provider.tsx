'use client'

import dynamic from 'next/dynamic'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

const Terminal = dynamic(
  () => import('@/components/terminal').then((module) => module.Terminal),
  { ssr: false },
)

interface TerminalContextValue {
  isOpen: boolean
  toggle: () => void
}

const TerminalContext = createContext<TerminalContextValue>({
  isOpen: false,
  toggle: () => {},
})

export function useTerminal() {
  return useContext(TerminalContext)
}

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = useCallback(() => setIsOpen((value) => !value), [])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) return
      if (event.key === '`' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        toggle()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggle])

  return (
    <TerminalContext.Provider value={{ isOpen, toggle }}>
      {children}
      {isOpen && <Terminal />}
    </TerminalContext.Provider>
  )
}
