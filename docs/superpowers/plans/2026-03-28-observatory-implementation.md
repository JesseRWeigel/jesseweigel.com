# The Observatory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build jesseweigel.com — a personal portfolio site with Three.js particle landing, project showcase, transmissions (talks/podcasts/YouTube), and blog, deployed on Vercel.

**Architecture:** Next.js 16 App Router with file-based MDX content. Three.js particle field via @react-three/fiber for the landing page. All content stored as MDX files with frontmatter parsed by gray-matter and rendered by next-mdx-remote. shadcn/ui for component primitives, Tailwind for styling, Framer Motion for page transitions. Vitest for unit tests, Playwright for e2e.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Three.js (@react-three/fiber, @react-three/drei), Framer Motion, gray-matter, next-mdx-remote, Vitest, Playwright

---

## File Structure

```
jesseweigel.com/
├── app/
│   ├── layout.tsx                  Root layout (fonts, metadata, terminal provider)
│   ├── page.tsx                    The Field (landing page with Three.js)
│   ├── globals.css                 Global styles + Tailwind
│   ├── workshop/
│   │   ├── page.tsx                Project grid with filtering
│   │   └── [slug]/
│   │       └── page.tsx            Individual project detail
│   ├── transmissions/
│   │   └── page.tsx                Talks, podcasts, YouTube
│   ├── log/
│   │   ├── page.tsx                Blog post list
│   │   └── [slug]/
│   │       └── page.tsx            Individual blog post
│   └── not-found.tsx               Custom 404
├── components/
│   ├── ui/                         shadcn/ui components (auto-generated)
│   ├── particle-field.tsx          Three.js particle constellation (client)
│   ├── landing-fallback.tsx        Static fallback for reduced-motion/SSR
│   ├── project-card.tsx            Workshop card component
│   ├── project-filters.tsx         Category filter bar (client)
│   ├── transmission-card.tsx       Talk/podcast/YouTube card
│   ├── blog-post-card.tsx          Log entry card
│   ├── mdx-content.tsx             MDX renderer wrapper (client)
│   ├── terminal.tsx                Hidden terminal easter egg (client)
│   ├── terminal-provider.tsx       Terminal state context (client)
│   ├── nav.tsx                     Minimal navigation bar
│   ├── footer.tsx                  Site footer with social links
│   ├── search-overlay.tsx          Global search overlay (client)
│   └── page-transition.tsx         Framer Motion page wrapper (client)
├── lib/
│   ├── content.ts                  Read & parse MDX files (server only)
│   ├── types.ts                    Shared TypeScript types
│   ├── search.ts                   Client-side search index builder
│   └── terminal-commands.ts        Terminal command registry & handlers
├── content/
│   ├── projects/                   One .mdx per project (~20 files)
│   ├── transmissions/
│   │   ├── talks/                  One .mdx per talk (~5 files)
│   │   ├── podcasts/               One .mdx per podcast (~5 files)
│   │   └── youtube/                One .mdx per YouTube entry (~3 files)
│   ├── log/                        Blog posts
│   │   └── 2026-03-28-hello-observatory.mdx
│   └── meta/
│       ├── socials.json            Social media links
│       └── bio.json                Name, role, bio text
├── __tests__/
│   ├── lib/
│   │   ├── content.test.ts         Content loader tests
│   │   ├── search.test.ts          Search index tests
│   │   └── terminal-commands.test.ts Terminal command tests
│   └── components/
│       ├── project-card.test.tsx   Card rendering tests
│       ├── project-filters.test.tsx Filter logic tests
│       └── terminal.test.tsx       Terminal interaction tests
├── e2e/
│   ├── landing.spec.ts             Landing page loads, nodes visible
│   ├── workshop.spec.ts            Projects render, filters work
│   ├── transmissions.spec.ts       Talks/podcasts render
│   ├── log.spec.ts                 Blog posts render
│   └── navigation.spec.ts         Nav, search, 404
├── public/
│   └── og-default.png              Default OG image
├── next.config.ts
├── tailwind.config.ts              (only if v4 needs one — may be CSS-only)
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

---

## Task 1: Project Scaffold & Tooling

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /home/jesse/Projects/jesseweigel.com
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --turbopack --yes
```

This will scaffold into the existing directory. Accept overwriting files if prompted.

- [ ] **Step 2: Install core dependencies**

```bash
npm install @react-three/fiber @react-three/drei three framer-motion gray-matter next-mdx-remote reading-time
npm install -D @types/three vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @playwright/test
```

- [ ] **Step 3: Install Playwright browsers**

```bash
npx playwright install chromium
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
})
```

Create `__tests__/setup.ts`:

```typescript
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 5: Configure Playwright**

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
```

- [ ] **Step 6: Add test scripts to package.json**

Add to `scripts` in `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

- [ ] **Step 7: Initialize shadcn/ui**

```bash
npx shadcn@latest init --defaults
```

Then add components we'll need:

```bash
npx shadcn@latest add badge button card input
```

- [ ] **Step 8: Set up global styles**

Replace `app/globals.css` with Observatory theme. Import Tailwind, set dark mode defaults, define CSS custom properties for the color palette:

```css
@import "tailwindcss";

@layer base {
  :root {
    --background: 234 50% 5%;
    --foreground: 214 32% 91%;
    --card: 234 30% 8%;
    --card-foreground: 214 32% 91%;
    --primary: 38 92% 50%;
    --primary-foreground: 234 50% 5%;
    --secondary: 234 20% 15%;
    --secondary-foreground: 214 32% 91%;
    --muted: 234 20% 15%;
    --muted-foreground: 215 20% 65%;
    --accent: 38 92% 50%;
    --accent-foreground: 234 50% 5%;
    --border: 234 20% 18%;
    --ring: 38 92% 50%;
    --radius: 0.75rem;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

- [ ] **Step 9: Set up root layout with fonts**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { TerminalProvider } from '@/components/terminal-provider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Jesse Weigel — The Observatory',
    template: '%s | Jesse Weigel',
  },
  description: 'Software engineer, AI agent architect, and community builder. Projects, talks, and experiments.',
  metadataBase: new URL('https://jesseweigel.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <TerminalProvider>
          {children}
        </TerminalProvider>
      </body>
    </html>
  )
}
```

Install geist font:

```bash
npm install geist
```

- [ ] **Step 10: Create placeholder page**

Replace `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-4xl font-light text-primary">The Observatory</h1>
    </main>
  )
}
```

- [ ] **Step 11: Create TerminalProvider placeholder**

Create `components/terminal-provider.tsx`:

```tsx
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
```

- [ ] **Step 12: Verify the dev server starts**

```bash
npm run dev
```

Open in browser and confirm "The Observatory" renders in amber on a dark background.

- [ ] **Step 13: Commit scaffold**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind, shadcn, Three.js deps, and test tooling"
```

---

## Task 2: Types & Content Loading Library

**Files:**
- Create: `lib/types.ts`, `lib/content.ts`
- Test: `__tests__/lib/content.test.ts`

- [ ] **Step 1: Define shared types**

Create `lib/types.ts`:

```typescript
export type ProjectStatus = 'active' | 'experimental' | 'archived'

export type ProjectCategory =
  | 'agent-orchestration'
  | 'games'
  | 'ai-tools'
  | 'education'
  | 'research'
  | 'creative'

export interface ProjectFrontmatter {
  title: string
  description: string
  category: ProjectCategory
  status: ProjectStatus
  github: string
  demo: string | null
  tech: string[]
  stars: number
  featured: boolean
}

export interface Project extends ProjectFrontmatter {
  slug: string
  content: string
}

export type TransmissionType = 'talk' | 'podcast' | 'youtube'

export interface TransmissionFrontmatter {
  title: string
  description: string
  type: TransmissionType
  venue: string
  date: string
  links: {
    listen?: string
    watch?: string
    slides?: string
    spotify?: string
  }
}

export interface Transmission extends TransmissionFrontmatter {
  slug: string
  content: string
}

export interface BlogPostFrontmatter {
  title: string
  date: string
  tags: string[]
  excerpt: string
}

export interface BlogPost extends BlogPostFrontmatter {
  slug: string
  content: string
  readingTime: string
}
```

- [ ] **Step 2: Write failing tests for content loader**

Create `__tests__/lib/content.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import {
  getProjects,
  getProjectBySlug,
  getTransmissions,
  getBlogPosts,
  getBlogPostBySlug,
} from '@/lib/content'

describe('getProjects', () => {
  it('returns an array of projects', async () => {
    const projects = await getProjects()
    expect(Array.isArray(projects)).toBe(true)
  })

  it('each project has required frontmatter fields', async () => {
    const projects = await getProjects()
    if (projects.length === 0) return // no content yet is OK
    const p = projects[0]
    expect(p).toHaveProperty('title')
    expect(p).toHaveProperty('slug')
    expect(p).toHaveProperty('description')
    expect(p).toHaveProperty('category')
    expect(p).toHaveProperty('status')
    expect(p).toHaveProperty('github')
    expect(p).toHaveProperty('tech')
  })
})

describe('getProjectBySlug', () => {
  it('returns null for non-existent slug', async () => {
    const result = await getProjectBySlug('does-not-exist-xyz')
    expect(result).toBeNull()
  })
})

describe('getTransmissions', () => {
  it('returns an array of transmissions', async () => {
    const transmissions = await getTransmissions()
    expect(Array.isArray(transmissions)).toBe(true)
  })
})

describe('getBlogPosts', () => {
  it('returns an array sorted by date descending', async () => {
    const posts = await getBlogPosts()
    expect(Array.isArray(posts)).toBe(true)
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime())
        .toBeGreaterThanOrEqual(new Date(posts[i].date).getTime())
    }
  })
})

describe('getBlogPostBySlug', () => {
  it('returns null for non-existent slug', async () => {
    const result = await getBlogPostBySlug('does-not-exist-xyz')
    expect(result).toBeNull()
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `lib/content` does not exist yet.

- [ ] **Step 4: Implement content loader**

Create `lib/content.ts`:

```typescript
import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type {
  Project,
  ProjectFrontmatter,
  Transmission,
  TransmissionFrontmatter,
  BlogPost,
  BlogPostFrontmatter,
} from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content')

async function getFilesFromDir(dir: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files: string[] = []
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...(await getFilesFromDir(fullPath)))
      } else if (entry.name.endsWith('.mdx')) {
        files.push(fullPath)
      }
    }
    return files
  } catch {
    return []
  }
}

function slugFromPath(filePath: string): string {
  return path.basename(filePath, '.mdx')
}

export async function getProjects(): Promise<Project[]> {
  const dir = path.join(CONTENT_DIR, 'projects')
  const files = await getFilesFromDir(dir)
  const projects: Project[] = []

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf-8')
    const { data, content } = matter(raw)
    const fm = data as ProjectFrontmatter
    projects.push({
      ...fm,
      slug: slugFromPath(file),
      content,
    })
  }

  return projects.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return b.stars - a.stars
  })
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const filePath = path.join(CONTENT_DIR, 'projects', `${slug}.mdx`)
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(raw)
    return { ...(data as ProjectFrontmatter), slug, content }
  } catch {
    return null
  }
}

export async function getTransmissions(): Promise<Transmission[]> {
  const dir = path.join(CONTENT_DIR, 'transmissions')
  const files = await getFilesFromDir(dir)
  const transmissions: Transmission[] = []

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf-8')
    const { data, content } = matter(raw)
    transmissions.push({
      ...(data as TransmissionFrontmatter),
      slug: slugFromPath(file),
      content,
    })
  }

  return transmissions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const dir = path.join(CONTENT_DIR, 'log')
  const files = await getFilesFromDir(dir)
  const posts: BlogPost[] = []

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf-8')
    const { data, content } = matter(raw)
    posts.push({
      ...(data as BlogPostFrontmatter),
      slug: slugFromPath(file),
      content,
      readingTime: readingTime(content).text,
    })
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(CONTENT_DIR, 'log', `${slug}.mdx`)
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(raw)
    return {
      ...(data as BlogPostFrontmatter),
      slug,
      content,
      readingTime: readingTime(content).text,
    }
  } catch {
    return null
  }
}
```

- [ ] **Step 5: Create empty content directories**

```bash
mkdir -p content/projects content/transmissions/talks content/transmissions/podcasts content/transmissions/youtube content/log content/meta
```

- [ ] **Step 6: Run tests to verify they pass**

```bash
npm test
```

Expected: PASS — all tests pass (empty arrays for empty dirs, null for missing slugs).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add types and content loading library with tests"
```

---

## Task 3: Content Data Files

**Files:**
- Create: ~20 project MDX files, ~13 transmission MDX files, 1 blog post, 2 meta JSON files

This task creates all the content data files. No tests needed — the content loader tests from Task 2 will validate the structure.

- [ ] **Step 1: Create meta files**

Create `content/meta/bio.json`:

```json
{
  "name": "Jesse Weigel",
  "role": "Generative AI Engineer",
  "company": "TRACTIAN",
  "subtitle": "The Observatory",
  "bio": "Self-taught developer turned AI agent architect. I build autonomous systems, games for my kids, and tools that make developers' lives better. Previously at American Express, The Motley Fool, and DICK'S Sporting Goods. Conference speaker, live coding community builder, and father of four.",
  "location": "Steubenville, Ohio"
}
```

Create `content/meta/socials.json`:

```json
{
  "github": "https://github.com/JesseRWeigel",
  "twitter": "https://x.com/JesseRWeigel",
  "linkedin": "https://www.linkedin.com/in/jesseweigel/",
  "youtube": "https://youtube.com/c/JesseWeigel29"
}
```

- [ ] **Step 2: Create featured project MDX files**

Create `content/projects/toryo.mdx`:

```mdx
---
title: "Toryo"
description: "Intelligent agent orchestrator with trust-based delegation, quality ratcheting, and self-improving loops"
category: "agent-orchestration"
status: "active"
github: "https://github.com/JesseRWeigel/toryo"
demo: null
tech: ["TypeScript", "Node.js", "WebSocket", "Vitest"]
stars: 0
featured: true
---

The intelligent agent orchestrator. Toryo chains multiple AI coding agents (Claude Code, Aider, Gemini, Ollama) with spec-driven workflows, trust-based delegation, and quality ratcheting. Available as an npm package at `@jweigel/toryo`.
```

Create `content/projects/tenshu.mdx`:

```mdx
---
title: "Tenshu"
description: "Real-time dashboard for AI agent teams with anime-styled command centers"
category: "agent-orchestration"
status: "active"
github: "https://github.com/JesseRWeigel/tenshu"
demo: null
tech: ["React", "TypeScript", "Vite", "Hono", "WebSocket", "Canvas"]
stars: 0
featured: true
---

Real-time dashboard for monitoring autonomous AI agent teams. Features anime-styled themes (War Room, Control Deck, Zen Garden), live activity feeds, experiment tracking via results.tsv, and system resource monitoring.
```

Create `content/projects/taisho.mdx`:

```mdx
---
title: "Taisho"
description: "Multi-repo orchestrator that dispatches parallel Claude Code sessions autonomously"
category: "agent-orchestration"
status: "active"
github: "https://github.com/JesseRWeigel/taisho"
demo: null
tech: ["Python", "Claude Code", "Git"]
stars: 0
featured: true
---

Lightweight multi-repo orchestrator for Claude Code. Scans projects, ranks by priority, dispatches parallel sessions to autonomously fix issues, write tests, and find bugs. Implements Karpathy's autoresearch quality ratcheting pattern.
```

Create `content/projects/hunterpath.mdx`:

```mdx
---
title: "HunterPath"
description: "Dark-fantasy idle RPG with dungeon gates, spirit binding, and prestige systems"
category: "games"
status: "active"
github: "https://github.com/JesseRWeigel/HunterPath"
demo: "https://jesserweigel.github.io/HunterPath/"
tech: ["React", "TypeScript", "Vite", "Tailwind", "PostgreSQL", "Express"]
stars: 1
featured: true
---

An idle/roguelite RPG built as a Progressive Web App. Clear dungeon gates, fight bosses, bind spirits, manage fatigue, and prestige to grow stronger. Features daily quests with penalties, stat progression, and cloud saves.
```

Create `content/projects/mineflayer-chatgpt.mdx`:

```mdx
---
title: "Mineflayer ChatGPT"
description: "Autonomous AI Minecraft bot team with 5 specialized bots and neural combat"
category: "ai-tools"
status: "active"
github: "https://github.com/JesseRWeigel/mineflayer-chatgpt"
demo: null
tech: ["TypeScript", "Node.js", "Mineflayer", "Ollama", "Python", "Socket.io"]
stars: 15
featured: true
---

An autonomous AI Minecraft bot team with 5 specialized bots (Atlas, Flora, Forge, Mason, Blade). Features multi-bot coordination via Team Bulletin, a hybrid skill system with 57+ Voyager JS skills, neural combat server, and Mission Control dashboard for Twitch streaming.
```

Create `content/projects/idle-abyss.mdx`:

```mdx
---
title: "Idle Abyss"
description: "Free idle RPG dungeon crawler with zero microtransactions"
category: "games"
status: "active"
github: "https://github.com/JesseRWeigel/idle-abyss"
demo: "https://jesserweigel.github.io/idle-abyss/"
tech: ["React", "TypeScript", "Vite", "Tailwind", "Web Audio API"]
stars: 0
featured: true
---

A free idle RPG dungeon crawler. 100+ floors across 5 biomes, 6 hero classes, 5-tier equipment rarity, prestige system, 26 achievements, and procedural sound effects. Zero microtransactions — the whole game is free, forever.
```

- [ ] **Step 3: Create remaining project MDX files**

Create `content/projects/battlemath.mdx`:

```mdx
---
title: "BattleMath"
description: "Browser-based math game for children with multiple difficulty levels"
category: "games"
status: "active"
github: "https://github.com/JesseRWeigel/battlemath"
demo: "https://jesserweigel.github.io/battlemath/"
tech: ["React", "TypeScript", "Vite", "Tailwind", "Vitest", "Cypress"]
stars: 35
featured: false
---

A math game for kids. Practice addition, subtraction, multiplication, and division across 3 difficulty levels with a 30-second timer and point system.
```

Create `content/projects/demigods-fate.mdx`:

```mdx
---
title: "Demigod's Fate"
description: "Percy Jackson Minecraft mod with celestial weapons, mythological monsters, and prophecy quests"
category: "games"
status: "active"
github: "https://github.com/JesseRWeigel/demigods-fate"
demo: null
tech: ["Java", "NeoForge", "Minecraft 1.21.1"]
stars: 0
featured: false
---

A NeoForge Minecraft mod inspired by Percy Jackson. Choose your godly parent, wield celestial bronze weapons, fight mythological monsters, complete prophecy-driven quests, and explore Camp Half-Blood, Camp Jupiter, the Underworld, Mount Olympus, and the Labyrinth.
```

Create `content/projects/hunterpath-rpg.mdx`:

```mdx
---
title: "HunterPath RPG"
description: "Console-style RPG version of Hunter's Path"
category: "games"
status: "experimental"
github: "https://github.com/JesseRWeigel/HunterPath-RPG"
demo: null
tech: ["TypeScript"]
stars: 0
featured: false
---

A console-style text RPG spin-off of HunterPath.
```

Create `content/projects/lotr-js-game.mdx`:

```mdx
---
title: "LOTR JS Game"
description: "A JavaScript text game based on Lord of the Rings, built for my kids"
category: "games"
status: "archived"
github: "https://github.com/JesseRWeigel/lotr-js-game"
demo: null
tech: ["JavaScript"]
stars: 0
featured: false
---

A little JavaScript text adventure based on Lord of the Rings, created for my son and daughter.
```

Create `content/projects/koe.mdx`:

```mdx
---
title: "Koe"
description: "AI-powered language learning with FSRS spaced repetition for Japanese, Spanish, and Portuguese"
category: "education"
status: "active"
github: "https://github.com/JesseRWeigel/koe"
demo: null
tech: ["Next.js", "React", "TypeScript", "Neon Postgres", "Drizzle", "AI SDK"]
stars: 1
featured: false
---

AI-powered language learning app supporting Japanese, Spanish, and Brazilian Portuguese. Features FSRS spaced repetition, AI conversation partner, graded reader, grammar-on-demand, kanji learning, and shadowing mode.
```

Create `content/projects/stay-focused.mdx`:

```mdx
---
title: "Stay Focused"
description: "Brain-computer interface app to help you maintain focus"
category: "creative"
status: "experimental"
github: "https://github.com/JesseRWeigel/stay-focused"
demo: "https://jesserweigel.github.io/stay-focused/"
tech: ["TypeScript", "BCI"]
stars: 31
featured: false
---

A brain-computer interface app that helps you stay focused by monitoring your brain activity.
```

Create `content/projects/voice-to-text-notes.mdx`:

```mdx
---
title: "Voice to Text Notes"
description: "Basic speech-to-text note taking app"
category: "creative"
status: "experimental"
github: "https://github.com/JesseRWeigel/voice-to-text-notes"
demo: "https://jesserweigel.github.io/voice-to-text-notes/"
tech: ["TypeScript", "Web Speech API"]
stars: 4
featured: false
---

A speech-to-text app for quick voice note capture.
```

Create `content/projects/ligo-glitch-vit-cnn.mdx`:

```mdx
---
title: "LIGO Glitch ViT vs CNN"
description: "Vision Transformer vs CNN for gravitational wave glitch classification"
category: "research"
status: "active"
github: "https://github.com/JesseRWeigel/ligo-glitch-vit-cnn"
demo: null
tech: ["Python", "PyTorch", "ViT", "CNN"]
stars: 0
featured: false
---

Research paper: Vision Transformer vs CNN for LIGO gravitational wave glitch classification. Investigates class-dependent architecture preferences and implications for continuous wave searches.
```

Create `content/projects/chromatic-number-random-graphs.mdx`:

```mdx
---
title: "Chromatic Number of Random Graphs"
description: "Improved concentration bounds for chi(G(n, n^{-1/2}))"
category: "research"
status: "active"
github: "https://github.com/JesseRWeigel/chromatic-number-random-graphs"
demo: null
tech: ["LaTeX", "Mathematics"]
stars: 0
featured: false
---

Mathematical research on improved concentration of the chromatic number of random graphs. Produced autonomously by get-math-done.
```

Create `content/projects/ai-tutoring-k12-meta-analysis.mdx`:

```mdx
---
title: "AI Tutoring K-12 Meta-Analysis"
description: "Systematic review of AI tutoring effectiveness in K-12 mathematics"
category: "research"
status: "active"
github: "https://github.com/JesseRWeigel/ai-tutoring-k12-meta-analysis"
demo: null
tech: ["Research", "Meta-Analysis"]
stars: 0
featured: false
---

Systematic review examining the effectiveness of AI tutoring systems in K-12 math education. Produced by get-review-done.
```

Create `content/projects/get-math-done.mdx` (representative of the get-X-done series):

```mdx
---
title: "Get-X-Done Series"
description: "Domain-specific AI research copilots — 7 repos spanning math, law, quant, engineering, chemistry, biology, and policy"
category: "research"
status: "active"
github: "https://github.com/JesseRWeigel/get-math-done"
demo: null
tech: ["Python", "AI", "Autonomous Research"]
stars: 1
featured: false
---

A family of domain-specific AI research copilots, each adapted from Get Physics Done. Seven repos cover math, literature review, legal research, quantitative finance, engineering, chemistry, biology, and policy analysis. Each runs autonomously to produce research papers and analyses.
```

- [ ] **Step 4: Create transmission MDX files — Talks**

Create `content/transmissions/talks/how-live-coding-changed-my-life.mdx`:

```mdx
---
title: "How Live Coding Changed My Life"
description: "Conference talk on building community and career through live streaming code"
type: "talk"
venue: "DACHFest 2018, NDC Minnesota, Abstractions, StirTrek, Pittsburgh TechFest"
date: "2019-05-01"
links:
  slides: "https://github.com/JesseRWeigel/how-livecoding-changed-my-life"
---

A talk about how live coding on YouTube and Twitch transformed my career, built a mentoring community, and opened doors to conference speaking around the world.
```

Create `content/transmissions/talks/one-codebase-to-rule-them-all.mdx`:

```mdx
---
title: "One Codebase to Rule Them All"
description: "Using React Native to build mobile, web, and desktop apps from a single codebase"
type: "talk"
venue: "React Loop, Abstractions, KCDC"
date: "2019-06-01"
links:
  slides: "https://github.com/JesseRWeigel/one-codebase-to-rule-them-all"
---

A presentation about using React Native Everywhere to ship mobile, web, and desktop applications from a single JavaScript codebase.
```

Create `content/transmissions/talks/building-mentoring-community.mdx`:

```mdx
---
title: "Building a Mentoring Community Through Live Coding"
description: "How live coding creates mentoring opportunities and grows developer communities"
type: "talk"
venue: "MidAtlantic Developer Conference, StirTrek 2019, DACHFest 2018"
date: "2019-04-01"
links:
  slides: "https://github.com/JesseRWeigel/livecoding-mentoring"
---

Exploring how live coding on platforms like YouTube creates natural mentoring relationships. From 1-2 viewers to hundreds of active contributors per project.
```

Create `content/transmissions/talks/react-graphql-wordpress.mdx`:

```mdx
---
title: "React + GraphQL + WordPress"
description: "Workshop on building headless WordPress sites with React and GraphQL"
type: "talk"
venue: "MidAtlantic Developer Conference 2019"
date: "2019-07-01"
links:
  slides: "https://github.com/JesseRWeigel/react-wp-graphql-slides"
---

A hands-on workshop covering how to use React and GraphQL to build a modern frontend for WordPress, with zero server management.
```

Create `content/transmissions/talks/intro-to-kubernetes.mdx`:

```mdx
---
title: "Intro to Kubernetes"
description: "Introduction to container orchestration with Kubernetes"
type: "talk"
venue: "Conference Talk"
date: "2019-01-01"
links:
  slides: "https://github.com/JesseRWeigel/kubernetes-slides"
---

An introductory talk on Kubernetes and container orchestration for developers.
```

- [ ] **Step 5: Create transmission MDX files — Podcasts**

Create `content/transmissions/podcasts/freecodecamp-ep63.mdx`:

```mdx
---
title: "Building Community and Career Through Live Streaming"
description: "freeCodeCamp Podcast Episode 63 — interview about live coding, community building, and career growth"
type: "podcast"
venue: "freeCodeCamp Podcast"
date: "2019-01-15"
links:
  listen: "https://www.freecodecamp.org/news/podcast-jesse-weigel/"
  spotify: "https://freecodecamp.libsyn.com/ep-63-jesse-weigel-prolific-live-streamer-and-senior-software-engineer"
---

Interview covering how live streaming code on YouTube built a community, accelerated learning, and created career opportunities.
```

Create `content/transmissions/podcasts/codenewbie-s13e1.mdx`:

```mdx
---
title: "How Live Coding Can Level Up Your Development"
description: "CodeNewbie Season 13 Episode 1 — the benefits of coding in public"
type: "podcast"
venue: "CodeNewbie Podcast"
date: "2020-01-01"
links:
  listen: "https://www.codenewbie.org/podcast/how-live-coding-can-level-up-your-development"
---

Discussion about how live coding accelerates your development skills, helps you learn in public, and builds meaningful professional connections.
```

Create `content/transmissions/podcasts/learn-to-code-with-me.mdx`:

```mdx
---
title: "From Washing Dishes to Managing Engineers"
description: "Learn to Code With Me S8:E4 — the journey from food service to tech leadership"
type: "podcast"
venue: "Learn to Code With Me"
date: "2021-01-01"
links:
  listen: "https://learntocodewith.me/podcast/washing-dishes-to-managing-engineers-with-jesse-weigel/"
  spotify: "https://open.spotify.com/episode/1fIjjNFk4c6DvmUjxg6Rpa"
---

The full career arc — from washing dishes at a restaurant to managing a team of engineers. Self-taught, community-driven, no CS degree required.
```

Create `content/transmissions/podcasts/cto-think.mdx`:

```mdx
---
title: "Benefits of Coding While Streaming"
description: "CTO Think Podcast — streaming as a professional development tool"
type: "podcast"
venue: "CTO Think"
date: "2021-06-01"
links:
  spotify: "https://creators.spotify.com/pod/profile/thisoldapp/episodes/Benefits-of-Coding-While-Streaming-with-Jesse-Weigel-e187joo"
---

Discussion about how coding while streaming benefits both the streamer and the audience, and how it can be a professional development tool for engineering leaders.
```

Create `content/transmissions/podcasts/faraday-tech-cafe.mdx`:

```mdx
---
title: "Learning, Livestreaming, and Mental Health"
description: "Faraday Tech Cafe Episode 1.1 — the intersection of tech, learning, and wellbeing"
type: "podcast"
venue: "Faraday Tech Cafe"
date: "2020-06-01"
links:
  listen: "https://podtail.com/en/podcast/faraday-tech-cafe-podcast/episode-1-1-learning-livestreaming-and-mental-heal/"
---

A conversation about the intersection of continuous learning, live streaming, and mental health in the tech industry.
```

- [ ] **Step 6: Create transmission MDX files — YouTube**

Create `content/transmissions/youtube/live-coding-with-jesse.mdx`:

```mdx
---
title: "Live Coding with Jesse"
description: "Regular live coding series on the freeCodeCamp YouTube channel"
type: "youtube"
venue: "freeCodeCamp YouTube"
date: "2018-06-01"
links:
  watch: "https://youtube.com/c/JesseWeigel29"
---

A regular live coding series on the freeCodeCamp.org YouTube channel. Built projects collaboratively with viewers — growing from 1-2 viewers to hundreds watching live, with 5-12 contributors per project.
```

Create `content/transmissions/youtube/how-to-create-programming-channel.mdx`:

```mdx
---
title: "How to Create a Programming YouTube Channel"
description: "Featured in freeCodeCamp's guide to starting a programming YouTube channel"
type: "youtube"
venue: "freeCodeCamp"
date: "2019-03-01"
links:
  watch: "https://www.freecodecamp.org/news/how-to-start-a-software-youtube-channel/"
---

Featured alongside other successful creators in freeCodeCamp's guide to starting and growing a programming YouTube channel.
```

- [ ] **Step 7: Create first blog post**

Create `content/log/2026-03-28-hello-observatory.mdx`:

```mdx
---
title: "Hello, Observatory"
date: "2026-03-28"
tags: ["meta", "launch"]
excerpt: "Welcome to The Observatory — a new home for my projects, talks, and experiments."
---

Welcome to The Observatory.

This site is a home for everything I build, research, and explore. It's intentionally different from a typical developer portfolio — there's no sales pitch here, no "hire me" banner. Just projects, ideas, and the occasional captain's log entry.

## What you'll find

**The Workshop** — my active projects, from AI agent orchestrators to games I build for my kids. Everything links back to GitHub.

**Transmissions** — conference talks, podcast appearances, and YouTube content from my years of live coding on freeCodeCamp.

**This log** — thoughts, updates, and dispatches from whatever I'm working on.

## Why "The Observatory"?

I spend most of my time watching autonomous AI agents work — monitoring their output, guiding their decisions, measuring their improvement. It felt right.

There are hidden things on this site. If you're the type who presses random keys, you might find them.

Clear skies.
```

- [ ] **Step 8: Verify content loads correctly**

```bash
npm test
```

Expected: All content loader tests PASS — projects, transmissions, and blog posts are found and parsed.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add all content data files — projects, transmissions, blog, and meta"
```

---

## Task 4: Navigation, Footer, and Page Layout Shell

**Files:**
- Create: `components/nav.tsx`, `components/footer.tsx`, `app/not-found.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Build navigation component**

Create `components/nav.tsx`:

```tsx
import Link from 'next/link'

const links = [
  { href: '/workshop', label: 'Workshop' },
  { href: '/transmissions', label: 'Transmissions' },
  { href: '/log', label: 'Log' },
]

export function Nav() {
  return (
    <nav className="fixed top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-sm tracking-wider text-primary transition-opacity hover:opacity-80"
        >
          JW
        </Link>
        <div className="flex gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Build footer component**

Create `components/footer.tsx`:

```tsx
import Link from 'next/link'

const socials = [
  { href: 'https://github.com/JesseRWeigel', label: 'GitHub' },
  { href: 'https://x.com/JesseRWeigel', label: 'X' },
  { href: 'https://www.linkedin.com/in/jesseweigel/', label: 'LinkedIn' },
  { href: 'https://youtube.com/c/JesseWeigel29', label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            Jesse Weigel &middot; The Observatory
          </p>
          <div className="flex gap-4">
            {socials.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-4 text-center font-mono text-[10px] text-muted-foreground/50">
          Press <kbd className="rounded border border-white/10 px-1">`</kbd> for a surprise
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Create 404 page**

Create `app/not-found.tsx`:

```tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
      <h1 className="font-mono text-6xl font-light text-primary">404</h1>
      <p className="text-muted-foreground">Signal lost. Nothing at this coordinate.</p>
      <Link
        href="/"
        className="mt-4 text-sm text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
      >
        Return to The Observatory
      </Link>
    </main>
  )
}
```

- [ ] **Step 4: Update root layout to include nav and footer**

Update `app/layout.tsx` to add Nav and Footer:

```tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { TerminalProvider } from '@/components/terminal-provider'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Jesse Weigel — The Observatory',
    template: '%s | Jesse Weigel',
  },
  description: 'Software engineer, AI agent architect, and community builder. Projects, talks, and experiments.',
  metadataBase: new URL('https://jesseweigel.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <TerminalProvider>
          <Nav />
          <div className="pt-14">{children}</div>
          <Footer />
        </TerminalProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Verify in browser**

```bash
npm run dev
```

Confirm: nav bar with "JW" logo and links, footer with socials, 404 page at `/nonexistent`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add navigation, footer, 404 page, and layout shell"
```

---

## Task 5: Workshop Page (Projects)

**Files:**
- Create: `app/workshop/page.tsx`, `app/workshop/[slug]/page.tsx`, `components/project-card.tsx`, `components/project-filters.tsx`, `components/mdx-content.tsx`
- Test: `__tests__/components/project-card.test.tsx`, `__tests__/components/project-filters.test.tsx`

- [ ] **Step 1: Write failing test for ProjectCard**

Create `__tests__/components/project-card.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProjectCard } from '@/components/project-card'
import type { Project } from '@/lib/types'

const mockProject: Project = {
  title: 'Test Project',
  description: 'A test project description',
  category: 'games',
  status: 'active',
  github: 'https://github.com/test/test',
  demo: 'https://test.com',
  tech: ['React', 'TypeScript'],
  stars: 42,
  featured: true,
  slug: 'test-project',
  content: 'Full description here.',
}

describe('ProjectCard', () => {
  it('renders project title and description', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('A test project description')).toBeInTheDocument()
  })

  it('renders tech tags', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders status badge', () => {
    render(<ProjectCard project={mockProject} />)
    expect(screen.getByText('active')).toBeInTheDocument()
  })

  it('renders GitHub link', () => {
    render(<ProjectCard project={mockProject} />)
    const link = screen.getByRole('link', { name: /github/i })
    expect(link).toHaveAttribute('href', 'https://github.com/test/test')
  })

  it('renders demo link when present', () => {
    render(<ProjectCard project={mockProject} />)
    const link = screen.getByRole('link', { name: /demo/i })
    expect(link).toHaveAttribute('href', 'https://test.com')
  })

  it('does not render demo link when null', () => {
    render(<ProjectCard project={{ ...mockProject, demo: null }} />)
    expect(screen.queryByRole('link', { name: /demo/i })).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- __tests__/components/project-card.test.tsx
```

Expected: FAIL — component does not exist.

- [ ] **Step 3: Implement ProjectCard**

Create `components/project-card.tsx`:

```tsx
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/lib/types'

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  experimental: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  archived: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-500 hover:border-primary/20 hover:bg-white/[0.04] hover:shadow-[0_0_30px_-10px] hover:shadow-primary/10">
      <div className="flex items-start justify-between gap-3">
        <Link href={`/workshop/${project.slug}`} className="min-w-0 flex-1">
          <h3 className="text-lg font-medium text-foreground transition-colors group-hover:text-primary">
            {project.title}
          </h3>
        </Link>
        <Badge variant="outline" className={statusColors[project.status]}>
          {project.status}
        </Badge>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3 text-xs">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-muted-foreground transition-colors hover:text-primary"
        >
          GitHub{project.stars > 0 ? ` (${project.stars} ★)` : ''}
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Demo"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            Demo
          </a>
        )}
      </div>
    </article>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- __tests__/components/project-card.test.tsx
```

Expected: PASS

- [ ] **Step 5: Write failing test for project filters**

Create `__tests__/components/project-filters.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectFilters } from '@/components/project-filters'

const categories = [
  'agent-orchestration',
  'games',
  'ai-tools',
  'education',
  'research',
  'creative',
] as const

describe('ProjectFilters', () => {
  it('renders all category buttons plus "All"', () => {
    render(<ProjectFilters active={null} onFilter={() => {}} />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Agent Orchestration')).toBeInTheDocument()
    expect(screen.getByText('Games')).toBeInTheDocument()
  })

  it('calls onFilter with category when clicked', () => {
    const onFilter = vi.fn()
    render(<ProjectFilters active={null} onFilter={onFilter} />)
    fireEvent.click(screen.getByText('Games'))
    expect(onFilter).toHaveBeenCalledWith('games')
  })

  it('calls onFilter with null when "All" is clicked', () => {
    const onFilter = vi.fn()
    render(<ProjectFilters active="games" onFilter={onFilter} />)
    fireEvent.click(screen.getByText('All'))
    expect(onFilter).toHaveBeenCalledWith(null)
  })
})
```

- [ ] **Step 6: Run test to verify it fails**

```bash
npm test -- __tests__/components/project-filters.test.tsx
```

Expected: FAIL

- [ ] **Step 7: Implement ProjectFilters**

Create `components/project-filters.tsx`:

```tsx
'use client'

import type { ProjectCategory } from '@/lib/types'

const categories: { value: ProjectCategory; label: string }[] = [
  { value: 'agent-orchestration', label: 'Agent Orchestration' },
  { value: 'games', label: 'Games' },
  { value: 'ai-tools', label: 'AI Tools' },
  { value: 'education', label: 'Education' },
  { value: 'research', label: 'Research' },
  { value: 'creative', label: 'Creative' },
]

interface ProjectFiltersProps {
  active: ProjectCategory | null
  onFilter: (category: ProjectCategory | null) => void
}

export function ProjectFilters({ active, onFilter }: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onFilter(null)}
        className={`rounded-full px-3 py-1 text-xs transition-colors ${
          active === null
            ? 'bg-primary text-primary-foreground'
            : 'bg-white/5 text-muted-foreground hover:text-foreground'
        }`}
      >
        All
      </button>
      {categories.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onFilter(value)}
          className={`rounded-full px-3 py-1 text-xs transition-colors ${
            active === value
              ? 'bg-primary text-primary-foreground'
              : 'bg-white/5 text-muted-foreground hover:text-foreground'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 8: Run test to verify it passes**

```bash
npm test -- __tests__/components/project-filters.test.tsx
```

Expected: PASS

- [ ] **Step 9: Build Workshop page**

Create `app/workshop/page.tsx`:

```tsx
import { getProjects } from '@/lib/content'
import { WorkshopClient } from './workshop-client'

export const metadata = {
  title: 'Workshop',
  description: 'Projects, tools, games, and experiments by Jesse Weigel.',
}

export default async function WorkshopPage() {
  const projects = await getProjects()
  return <WorkshopClient projects={projects} />
}
```

Create `app/workshop/workshop-client.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { ProjectCard } from '@/components/project-card'
import { ProjectFilters } from '@/components/project-filters'
import type { Project, ProjectCategory } from '@/lib/types'

export function WorkshopClient({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | null>(null)

  const filtered = filter
    ? projects.filter((p) => p.category === filter)
    : projects

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-light tracking-tight">Workshop</h1>
      <p className="mt-2 text-muted-foreground">
        Projects, tools, games, and experiments.
      </p>

      <div className="mt-8">
        <ProjectFilters active={filter} onFilter={setFilter} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {filtered.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No projects in this category yet.
        </p>
      )}
    </main>
  )
}
```

- [ ] **Step 10: Create MDX renderer component**

Create `components/mdx-content.tsx`:

```tsx
'use client'

import { MDXRemote } from 'next-mdx-remote/rsc'

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none prose-headings:font-light prose-a:text-primary prose-code:font-mono">
      <MDXRemote source={source} />
    </div>
  )
}
```

- [ ] **Step 11: Build project detail page**

Create `app/workshop/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { MdxContent } from '@/components/mdx-content'
import { getProjectBySlug, getProjects } from '@/lib/content'

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: 'Not Found' }
  return { title: project.title, description: project.description }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/workshop"
        className="text-xs text-muted-foreground transition-colors hover:text-primary"
      >
        &larr; Workshop
      </Link>

      <h1 className="mt-6 text-3xl font-light tracking-tight">{project.title}</h1>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{project.status}</Badge>
        {project.tech.map((t) => (
          <span
            key={t}
            className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-3 text-sm">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4"
        >
          GitHub
        </a>
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4"
          >
            Live Demo
          </a>
        )}
      </div>

      <div className="mt-8">
        <MdxContent source={project.content} />
      </div>
    </main>
  )
}
```

- [ ] **Step 12: Verify in browser**

```bash
npm run dev
```

Navigate to `/workshop` — confirm projects render in grid, filters work, clicking a card goes to detail page.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add Workshop page with project cards, filters, and detail pages"
```

---

## Task 6: Transmissions Page

**Files:**
- Create: `app/transmissions/page.tsx`, `components/transmission-card.tsx`

- [ ] **Step 1: Create TransmissionCard component**

Create `components/transmission-card.tsx`:

```tsx
import type { Transmission } from '@/lib/types'

const typeIcons: Record<string, string> = {
  talk: '🎤',
  podcast: '🎧',
  youtube: '📺',
}

const typeLabels: Record<string, string> = {
  talk: 'Talk',
  podcast: 'Podcast',
  youtube: 'YouTube',
}

export function TransmissionCard({ transmission }: { transmission: Transmission }) {
  const primaryLink =
    transmission.links.watch ||
    transmission.links.listen ||
    transmission.links.slides ||
    transmission.links.spotify

  return (
    <article className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-500 hover:border-primary/20 hover:bg-white/[0.04]">
      <div className="flex items-start gap-3">
        <span className="text-xl" aria-hidden="true">
          {typeIcons[transmission.type]}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {typeLabels[transmission.type]} &middot; {transmission.venue}
          </p>
          <h3 className="mt-1 text-base font-medium text-foreground transition-colors group-hover:text-primary">
            {transmission.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {transmission.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {transmission.links.watch && (
              <a
                href={transmission.links.watch}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Watch
              </a>
            )}
            {transmission.links.listen && (
              <a
                href={transmission.links.listen}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Listen
              </a>
            )}
            {transmission.links.spotify && (
              <a
                href={transmission.links.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Spotify
              </a>
            )}
            {transmission.links.slides && (
              <a
                href={transmission.links.slides}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Slides
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
```

- [ ] **Step 2: Build Transmissions page**

Create `app/transmissions/page.tsx`:

```tsx
import { getTransmissions } from '@/lib/content'
import { TransmissionCard } from '@/components/transmission-card'

export const metadata = {
  title: 'Transmissions',
  description: 'Conference talks, podcast appearances, and YouTube content by Jesse Weigel.',
}

export default async function TransmissionsPage() {
  const all = await getTransmissions()
  const talks = all.filter((t) => t.type === 'talk')
  const podcasts = all.filter((t) => t.type === 'podcast')
  const youtube = all.filter((t) => t.type === 'youtube')

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-light tracking-tight">Transmissions</h1>
      <p className="mt-2 text-muted-foreground">
        Signals sent out into the world — talks, podcasts, and streams.
      </p>

      {talks.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Conference Talks
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {talks.map((t) => (
              <TransmissionCard key={t.slug} transmission={t} />
            ))}
          </div>
        </section>
      )}

      {podcasts.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Podcast Appearances
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {podcasts.map((t) => (
              <TransmissionCard key={t.slug} transmission={t} />
            ))}
          </div>
        </section>
      )}

      {youtube.length > 0 && (
        <section className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            YouTube
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {youtube.map((t) => (
              <TransmissionCard key={t.slug} transmission={t} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
```

- [ ] **Step 3: Verify in browser**

Navigate to `/transmissions` — confirm talks, podcasts, and YouTube sections render with correct data and links.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Transmissions page with talks, podcasts, and YouTube sections"
```

---

## Task 7: Log (Blog) Page

**Files:**
- Create: `app/log/page.tsx`, `app/log/[slug]/page.tsx`, `components/blog-post-card.tsx`

- [ ] **Step 1: Create BlogPostCard**

Create `components/blog-post-card.tsx`:

```tsx
import Link from 'next/link'
import type { BlogPost } from '@/lib/types'

function toStardate(dateStr: string): string {
  const d = new Date(dateStr)
  const dayOfYear = Math.floor(
    (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000
  )
  return `${d.getFullYear()}.${String(dayOfYear).padStart(3, '0')}`
}

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group border-b border-white/5 py-6 first:pt-0 last:border-0">
      <Link href={`/log/${post.slug}`} className="block">
        <p className="font-mono text-xs text-muted-foreground">
          ★ {toStardate(post.date)} &middot; {post.readingTime}
        </p>
        <h3 className="mt-1 text-xl font-medium text-foreground transition-colors group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      </Link>
    </article>
  )
}
```

- [ ] **Step 2: Build Log list page**

Create `app/log/page.tsx`:

```tsx
import { getBlogPosts } from '@/lib/content'
import { BlogPostCard } from '@/components/blog-post-card'

export const metadata = {
  title: 'Log',
  description: "Captain's log — thoughts, updates, and dispatches from Jesse Weigel.",
}

export default async function LogPage() {
  const posts = await getBlogPosts()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-light tracking-tight">Log</h1>
      <p className="mt-2 text-muted-foreground">
        Dispatches from the observatory.
      </p>

      <div className="mt-10">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>

      {posts.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted-foreground">
          No log entries yet. Check back soon.
        </p>
      )}
    </main>
  )
}
```

- [ ] **Step 3: Build individual blog post page**

Create `app/log/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MdxContent } from '@/components/mdx-content'
import { getBlogPostBySlug, getBlogPosts } from '@/lib/content'

function toStardate(dateStr: string): string {
  const d = new Date(dateStr)
  const dayOfYear = Math.floor(
    (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000
  )
  return `${d.getFullYear()}.${String(dayOfYear).padStart(3, '0')}`
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: 'Not Found' }
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/log"
        className="text-xs text-muted-foreground transition-colors hover:text-primary"
      >
        &larr; Log
      </Link>

      <header className="mt-6">
        <p className="font-mono text-xs text-muted-foreground">
          ★ {toStardate(post.date)} &middot; {post.readingTime}
        </p>
        <h1 className="mt-2 text-3xl font-light tracking-tight">{post.title}</h1>
      </header>

      <div className="mt-8">
        <MdxContent source={post.content} />
      </div>
    </main>
  )
}
```

- [ ] **Step 4: Verify in browser**

Navigate to `/log` — see the "Hello, Observatory" post. Click it — see the full post with stardate, reading time, and MDX content.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Log (blog) with stardate display and MDX rendering"
```

---

## Task 8: Three.js Particle Field Landing Page

**Files:**
- Create: `components/particle-field.tsx`, `components/landing-fallback.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create the particle field component**

Create `components/particle-field.tsx`:

```tsx
'use client'

import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const NODE_DATA = [
  { label: 'Workshop', href: '/workshop', x: -2.5, y: 1.2, z: 0 },
  { label: 'Transmissions', href: '/transmissions', x: 2.2, y: 0.8, z: 0.5 },
  { label: 'Log', href: '/log', x: 0.3, y: -1.5, z: -0.3 },
]

function DustParticles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    const time = state.clock.elapsedTime * 0.05
    const pos = ref.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      const ix = i * 3
      pos.array[ix + 1] += Math.sin(time + i * 0.1) * 0.0003
      pos.array[ix] += Math.cos(time + i * 0.15) * 0.0002
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#f59e0b"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

function NodeSphere({
  position,
  label,
  onClick,
}: {
  position: [number, number, number]
  label: string
  onClick: () => void
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y =
      position[1] + Math.sin(t * 0.3 + position[0]) * 0.08
    if (glowRef.current) {
      glowRef.current.position.copy(ref.current.position)
    }
  })

  return (
    <group>
      <mesh ref={glowRef} position={position}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.06} />
      </mesh>
      <mesh
        ref={ref}
        position={position}
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
    </group>
  )
}

function Scene() {
  const { camera } = useThree()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    camera.position.x = Math.sin(t * 0.02) * 0.3
    camera.position.y = Math.cos(t * 0.015) * 0.2
  })

  const handleNodeClick = useCallback((href: string) => {
    window.location.href = href
  }, [])

  return (
    <>
      <DustParticles />
      {NODE_DATA.map((node) => (
        <NodeSphere
          key={node.label}
          position={[node.x, node.y, node.z]}
          label={node.label}
          onClick={() => handleNodeClick(node.href)}
        />
      ))}
    </>
  )
}

export function ParticleField() {
  return (
    <div className="h-screen w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 2: Create static fallback**

Create `components/landing-fallback.tsx`:

```tsx
import Link from 'next/link'

const sections = [
  { href: '/workshop', label: 'Workshop', desc: 'Projects & experiments' },
  { href: '/transmissions', label: 'Transmissions', desc: 'Talks, podcasts & streams' },
  { href: '/log', label: 'Log', desc: 'Dispatches from the observatory' },
]

export function LandingFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-6">
      <div className="text-center">
        <h1 className="text-4xl font-light tracking-tight">Jesse Weigel</h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">The Observatory</p>
      </div>
      <div className="flex gap-6">
        {sections.map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-xl border border-white/5 bg-white/[0.02] px-6 py-4 text-center transition-all hover:border-primary/20"
          >
            <p className="font-medium text-foreground group-hover:text-primary">{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Update landing page to use particle field**

Replace `app/page.tsx`:

```tsx
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { LandingFallback } from '@/components/landing-fallback'

const ParticleField = dynamic(
  () => import('@/components/particle-field').then((m) => m.ParticleField),
  { ssr: false, loading: () => <LandingFallback /> }
)

export default function Home() {
  return (
    <main className="relative">
      <ParticleField />

      {/* Overlay text */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-light tracking-tight text-foreground">
          Jesse Weigel
        </h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">
          The Observatory
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground/60">
          Software engineer &middot; AI agent architect &middot; Community builder
        </p>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
          <p className="font-mono text-[10px]">scroll or click a node</p>
          <div className="h-6 w-px bg-gradient-to-b from-muted-foreground/40 to-transparent" />
        </div>
      </div>

      {/* Below-fold navigation for accessibility */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { href: '/workshop', label: 'Workshop', desc: 'Projects & experiments' },
            { href: '/transmissions', label: 'Transmissions', desc: 'Talks, podcasts & streams' },
            { href: '/log', label: 'Log', desc: 'Dispatches from the observatory' },
          ].map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-xl border border-white/5 bg-white/[0.02] px-6 py-5 transition-all duration-500 hover:border-primary/20 hover:bg-white/[0.04]"
            >
              <p className="font-medium text-foreground transition-colors group-hover:text-primary">
                {label}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Self-taught developer turned AI agent architect. Building autonomous
            systems, games for my kids, and tools that make developers&apos; lives
            better. Previously at American Express, The Motley Fool, and
            DICK&apos;s Sporting Goods.
          </p>
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Confirm: particle field renders with drifting amber dots and 3 clickable node spheres. Text overlay centered. Below-fold section with cards. Clicking nodes navigates.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Three.js particle field landing page with interactive nodes"
```

---

## Task 9: Terminal Easter Egg

**Files:**
- Create: `lib/terminal-commands.ts`, `components/terminal.tsx`
- Modify: `app/layout.tsx`
- Test: `__tests__/lib/terminal-commands.test.ts`

- [ ] **Step 1: Write failing tests for terminal commands**

Create `__tests__/lib/terminal-commands.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { executeCommand } from '@/lib/terminal-commands'

describe('executeCommand', () => {
  it('returns help text for "help"', () => {
    const result = executeCommand('help')
    expect(result).toContain('Available commands')
  })

  it('returns about text for "cat about"', () => {
    const result = executeCommand('cat about')
    expect(result).toContain('Jesse Weigel')
  })

  it('lists sections for "ls"', () => {
    const result = executeCommand('ls')
    expect(result).toContain('workshop')
    expect(result).toContain('transmissions')
    expect(result).toContain('log')
  })

  it('returns navigate instruction for "cd workshop"', () => {
    const result = executeCommand('cd workshop')
    expect(result).toContain('/workshop')
  })

  it('returns fun response for "hack"', () => {
    const result = executeCommand('hack')
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns fun response for "sudo rm -rf /"', () => {
    const result = executeCommand('sudo rm -rf /')
    expect(result).toContain('nice try')
  })

  it('returns unknown command message for garbage', () => {
    const result = executeCommand('xyzabc123')
    expect(result).toContain('command not found')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- __tests__/lib/terminal-commands.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement terminal commands**

Create `lib/terminal-commands.ts`:

```typescript
type CommandHandler = (args: string) => string

const commands: Record<string, CommandHandler> = {
  help: () =>
    `Available commands:
  help          Show this message
  ls            List sections
  cd <section>  Navigate to a section
  cat about     About Jesse Weigel
  cat readme    About this site
  clear         Clear the terminal
  hack          ???
  whoami        Who are you?`,

  ls: () =>
    `workshop/        Projects & experiments
transmissions/   Talks, podcasts & streams
log/             Captain's log`,

  cd: (args) => {
    const section = args.trim().replace(/\/$/, '')
    const valid = ['workshop', 'transmissions', 'log']
    if (valid.includes(section)) {
      return `NAVIGATE:/${section}`
    }
    if (section === '/' || section === '~' || section === '') {
      return 'NAVIGATE:/'
    }
    return `cd: ${section}: no such directory`
  },

  cat: (args) => {
    const file = args.trim()
    if (file === 'about') {
      return `Jesse Weigel
Generative AI Engineer @ TRACTIAN
Steubenville, Ohio

Self-taught developer. Conference speaker. Live coding community builder.
AI agent architect. Father of four.

Previously: American Express, The Motley Fool, DICK's Sporting Goods`
    }
    if (file === 'readme' || file === 'README.md') {
      return `The Observatory — jesseweigel.com

A home for projects, talks, and experiments.
Built with Next.js, Three.js, and too much coffee.

There are hidden things here. Keep exploring.`
    }
    return `cat: ${file}: no such file`
  },

  whoami: () => 'visitor — welcome to the observatory',

  hack: () =>
    `[██████████████████████████] 100%
Access granted to... nothing. Nice try though.
Maybe try 'cat about' instead.`,

  sudo: (args) => {
    if (args.includes('rm -rf')) {
      return `nice try. this isn't that kind of terminal.`
    }
    return `sudo: permission denied. you're a guest here.`
  },

  clear: () => 'CLEAR',

  echo: (args) => args,

  pwd: () => '/observatory',

  date: () => {
    const d = new Date()
    const dayOfYear = Math.floor(
      (d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000
    )
    return `Stardate ${d.getFullYear()}.${String(dayOfYear).padStart(3, '0')}`
  },
}

export function executeCommand(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''

  const spaceIndex = trimmed.indexOf(' ')
  const cmd = spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex)
  const args = spaceIndex === -1 ? '' : trimmed.slice(spaceIndex + 1)

  const handler = commands[cmd.toLowerCase()]
  if (handler) return handler(args)

  return `${cmd}: command not found. Type 'help' for available commands.`
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- __tests__/lib/terminal-commands.test.ts
```

Expected: PASS

- [ ] **Step 5: Build Terminal component**

Create `components/terminal.tsx`:

```tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTerminal } from '@/components/terminal-provider'
import { executeCommand } from '@/lib/terminal-commands'

interface HistoryEntry {
  input: string
  output: string
}

export function Terminal() {
  const { isOpen, toggle } = useTerminal()
  const router = useRouter()
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState<string[]>([])
  const [cmdIndex, setCmdIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
  }, [history])

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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!input.trim()) return

      const result = executeCommand(input)
      setCmdHistory((prev) => [input, ...prev])
      setCmdIndex(-1)

      if (result === 'CLEAR') {
        setHistory([])
        setInput('')
        return
      }

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
    },
    [input, router, toggle]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const next = Math.min(cmdIndex + 1, cmdHistory.length - 1)
        setCmdIndex(next)
        if (cmdHistory[next]) setInput(cmdHistory[next])
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = cmdIndex - 1
        if (next < 0) {
          setCmdIndex(-1)
          setInput('')
        } else {
          setCmdIndex(next)
          setInput(cmdHistory[next])
        }
      } else if (e.key === 'Escape') {
        toggle()
      }
    },
    [cmdIndex, cmdHistory, toggle]
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-primary/20 bg-background/95 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-6 py-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-primary">observatory terminal</p>
          <button
            onClick={toggle}
            className="font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            [esc]
          </button>
        </div>

        <div
          ref={scrollRef}
          className="mt-2 max-h-48 overflow-y-auto font-mono text-xs"
        >
          {history.map((entry, i) => (
            <div key={i} className="mb-1">
              <p>
                <span className="text-primary">$ </span>
                <span className="text-foreground">{entry.input}</span>
              </p>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {entry.output}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-2 flex items-center">
          <span className="font-mono text-xs text-primary">$ </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="ml-1 flex-1 bg-transparent font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground/30"
            placeholder="type 'help' to begin..."
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Add Terminal to layout**

Update `app/layout.tsx` — add `<Terminal />` import and render inside TerminalProvider, after Footer:

```tsx
import { Terminal } from '@/components/terminal'
```

Add `<Terminal />` after `<Footer />` inside the TerminalProvider.

- [ ] **Step 7: Verify in browser**

Press `` ` `` on any page — terminal should slide up. Type `help`, `ls`, `cat about`, `cd workshop`, `hack`, `sudo rm -rf /`. Verify navigation works. Press Escape to close.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add hidden terminal easter egg with navigation and fun commands"
```

---

## Task 10: E2E Tests

**Files:**
- Create: `e2e/landing.spec.ts`, `e2e/workshop.spec.ts`, `e2e/transmissions.spec.ts`, `e2e/log.spec.ts`, `e2e/navigation.spec.ts`

- [ ] **Step 1: Write e2e tests**

Create `e2e/landing.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('landing page loads with title', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Jesse Weigel')).toBeVisible()
  await expect(page.getByText('The Observatory')).toBeVisible()
})

test('below-fold navigation cards are visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: /Workshop/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Transmissions/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Log/i })).toBeVisible()
})
```

Create `e2e/workshop.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('workshop page renders projects', async ({ page }) => {
  await page.goto('/workshop')
  await expect(page.getByText('Workshop')).toBeVisible()
  await expect(page.getByText('Toryo')).toBeVisible()
  await expect(page.getByText('HunterPath')).toBeVisible()
})

test('category filters work', async ({ page }) => {
  await page.goto('/workshop')
  await page.getByText('Games', { exact: true }).click()
  await expect(page.getByText('HunterPath')).toBeVisible()
  await expect(page.getByText('Toryo')).not.toBeVisible()
})

test('project detail page loads', async ({ page }) => {
  await page.goto('/workshop/toryo')
  await expect(page.getByText('Toryo')).toBeVisible()
  await expect(page.getByText('GitHub')).toBeVisible()
})
```

Create `e2e/transmissions.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('transmissions page renders all sections', async ({ page }) => {
  await page.goto('/transmissions')
  await expect(page.getByText('Conference Talks')).toBeVisible()
  await expect(page.getByText('Podcast Appearances')).toBeVisible()
  await expect(page.getByText('YouTube')).toBeVisible()
})

test('talk cards have links', async ({ page }) => {
  await page.goto('/transmissions')
  await expect(page.getByText('How Live Coding Changed My Life')).toBeVisible()
})
```

Create `e2e/log.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('log page shows blog posts', async ({ page }) => {
  await page.goto('/log')
  await expect(page.getByText('Hello, Observatory')).toBeVisible()
})

test('blog post detail page loads', async ({ page }) => {
  await page.goto('/log/2026-03-28-hello-observatory')
  await expect(page.getByText('Hello, Observatory')).toBeVisible()
  await expect(page.getByText('Welcome to The Observatory')).toBeVisible()
})
```

Create `e2e/navigation.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test('nav links work', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('navigation').getByText('Workshop').click()
  await expect(page).toHaveURL('/workshop')
})

test('404 page shows for invalid routes', async ({ page }) => {
  await page.goto('/nonexistent-page')
  await expect(page.getByText('404')).toBeVisible()
  await expect(page.getByText('Return to The Observatory')).toBeVisible()
})
```

- [ ] **Step 2: Run e2e tests**

```bash
npm run test:e2e
```

Expected: All tests PASS.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "test: add Playwright e2e tests for all pages and navigation"
```

---

## Task 11: Deploy to Vercel & Create GitHub Issues

**Files:**
- None (operational task)

- [ ] **Step 1: Push to GitHub**

```bash
git push origin main
```

- [ ] **Step 2: Link to Vercel**

```bash
cd /home/jesse/Projects/jesseweigel.com
vercel link
```

Follow prompts to connect to the JesseRWeigel scope and create/link a project.

- [ ] **Step 3: Deploy preview**

```bash
vercel
```

Verify the preview URL loads correctly in browser — landing, workshop, transmissions, log, terminal.

- [ ] **Step 4: Create GitHub issues for v2 features**

Create issues for future work:

```bash
gh issue create --title "Add Archive section for research papers" --body "Display research papers and deep writing (ligo-glitch-vit-cnn, chromatic-number, etc.) in a dedicated section with academic-feeling layout, wide margins, and PDF downloads." --label "enhancement"

gh issue create --title "Add Gallery section for AI art, music, and video" --body "Full-bleed media gallery with dark background, audio player with waveform visualization, and video embeds." --label "enhancement"

gh issue create --title "Add Graph explorer for content connections" --body "Interactive graph visualization showing how projects, blog posts, research, and transmissions connect to each other. Like Obsidian's graph view but public." --label "enhancement"

gh issue create --title "Add Zen Mode easter egg" --body "Press 'z' to strip everything away and leave only the particle field with very slow drift. A meditative screensaver. Press 'z' or Escape to exit." --label "enhancement"

gh issue create --title "Add global search overlay" --body "Typing anywhere on the landing page (or pressing '/') activates a search overlay that searches across all content — projects, transmissions, blog posts." --label "enhancement"

gh issue create --title "Auto-sync GitHub star counts" --body "Cron job or build-time script that fetches star counts from the GitHub API and updates project frontmatter or a cache file." --label "enhancement"

gh issue create --title "Add RSS feed for the Log" --body "Generate an RSS/Atom feed from blog posts so readers can subscribe." --label "enhancement"

gh issue create --title "Generate dynamic OG images per page" --body "Use @vercel/og or Satori to generate unique Open Graph images for each project, blog post, and transmission page." --label "enhancement"

gh issue create --title "Configure jesseweigel.com domain" --body "Point the jesseweigel.com domain to Vercel deployment. Set up DNS records and SSL." --label "infrastructure"

gh issue create --title "Add keyboard navigation for landing page nodes" --body "Arrow keys move between nodes, Enter selects, '?' shows keyboard shortcuts overlay." --label "enhancement"

gh issue create --title "Add Framer Motion page transitions" --body "Smooth fade/slide transitions between pages using Framer Motion layout animations." --label "enhancement"

gh issue create --title "Mobile responsive polish" --body "Review and polish all pages on mobile viewports. Terminal should be accessible via long-press on logo. Cards should stack properly." --label "enhancement"
```

- [ ] **Step 5: Commit any remaining changes and push**

```bash
git push origin main
```
