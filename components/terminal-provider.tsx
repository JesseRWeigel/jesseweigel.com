'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

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
  return (
    <TerminalContext.Provider value={{ isOpen, toggle: () => setIsOpen(v => !v) }}>
      {children}
    </TerminalContext.Provider>
  )
}
