'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTerminal } from '@/components/terminal-provider'
import { executeCommand } from '@/lib/terminal-commands'

interface HistoryEntry { input: string; output: string }

export function Terminal() {
  const { isOpen, toggle } = useTerminal()
  const router = useRouter()
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [cmdIndex, setCmdIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (isOpen) inputRef.current?.focus() }, [isOpen])
  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight) }, [history])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '`' && !e.ctrlKey && !e.metaKey) {
        const tag = (e.target as HTMLElement)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggle])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    const result = executeCommand(input)
    setCmdHistory((prev) => [input, ...prev])
    setCmdIndex(-1)
    if (result === 'CLEAR') { setHistory([]); setInput(''); return }
    if (result.startsWith('NAVIGATE:')) {
      const path = result.slice('NAVIGATE:'.length)
      setHistory((prev) => [...prev, { input, output: `Navigating to ${path}...` }])
      setInput('')
      toggle()
      router.push(path)
      return
    }
    setHistory((prev) => [...prev, { input, output: result }])
    setInput('')
  }, [input, router, toggle])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(cmdIndex + 1, cmdHistory.length - 1)
      setCmdIndex(next)
      if (cmdHistory[next]) setInput(cmdHistory[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = cmdIndex - 1
      if (next < 0) { setCmdIndex(-1); setInput('') }
      else { setCmdIndex(next); setInput(cmdHistory[next]) }
    } else if (e.key === 'Escape') { toggle() }
  }, [cmdIndex, cmdHistory, toggle])

  if (!isOpen) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/20 bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-primary">observatory terminal</p>
          <button onClick={toggle} className="font-mono text-xs text-muted-foreground hover:text-foreground">[esc]</button>
        </div>
        <div ref={scrollRef} className="mt-2 max-h-48 overflow-y-auto font-mono text-xs">
          {history.map((entry, i) => (
            <div key={i} className="mb-1">
              <p><span className="text-primary">$ </span><span className="text-foreground">{entry.input}</span></p>
              <p className="whitespace-pre-wrap text-muted-foreground">{entry.output}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-2 flex items-center">
          <span className="font-mono text-xs text-primary">$ </span>
          <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
            className="ml-1 flex-1 bg-transparent font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground/30"
            placeholder="type 'help' to begin..." autoComplete="off" spellCheck={false} />
        </form>
      </div>
    </div>
  )
}
