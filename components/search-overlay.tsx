'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { search, buildSearchIndex, type SearchResult } from '@/lib/search'
import type { Project, Transmission, BlogPost, ArchiveEntry } from '@/lib/types'

const typeLabels: Record<string, string> = {
  project: 'Project',
  transmission: 'Transmission',
  post: 'Log',
  archive: 'Archive',
}

const typeColors: Record<string, string> = {
  project: 'text-emerald-400',
  transmission: 'text-blue-400',
  post: 'text-amber-400',
  archive: 'text-violet-400',
}

export function SearchOverlay({
  projects,
  transmissions,
  posts,
  archiveEntries = [],
}: {
  projects: Project[]
  transmissions: Transmission[]
  posts: BlogPost[]
  archiveEntries?: ArchiveEntry[]
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const index = useMemo(
    () => buildSearchIndex(projects, transmissions, posts, archiveEntries),
    [projects, transmissions, posts, archiveEntries]
  )

  const results = useMemo(() => search(query, index), [query, index])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const tag = (e.target as HTMLElement)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      setQuery('')
      setSelectedIndex(0)
    }
  }, [open])

  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      const result = results[selectedIndex]
      setOpen(false)
      if (result.href.startsWith('http')) {
        window.open(result.href, '_blank')
      } else {
        router.push(result.href)
      }
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[20vh]">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-white/10 bg-card shadow-2xl">
        <div className="flex items-center border-b border-white/5 px-4">
          <span className="font-mono text-sm text-muted-foreground">/</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search projects, talks, posts..."
            className="flex-1 bg-transparent px-3 py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            esc
          </kbd>
        </div>
        {query && (
          <div className="max-h-72 overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                No results for &quot;{query}&quot;
              </p>
            ) : (
              results.map((result, i) => (
                <button
                  key={`${result.type}-${result.href}`}
                  onClick={() => {
                    setOpen(false)
                    if (result.href.startsWith('http')) {
                      window.open(result.href, '_blank')
                    } else {
                      router.push(result.href)
                    }
                  }}
                  className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                    i === selectedIndex
                      ? 'bg-white/5'
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <span className={`mt-0.5 font-mono text-[10px] uppercase ${typeColors[result.type]}`}>
                    {typeLabels[result.type]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{result.title}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {result.description}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
