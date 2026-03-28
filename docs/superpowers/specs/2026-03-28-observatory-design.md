# The Observatory — jesseweigel.com Design Spec

**Date**: 2026-03-28
**Status**: Draft

## Overview

A personal website for Jesse Weigel at jesseweigel.com, deployed on Vercel. The site showcases projects, talks, podcasts, YouTube content, blog posts, and research. The design concept is "The Observatory" — contemplative sci-fi meets zen garden. Dark, spacious, warm. Visitors discover layers over time rather than seeing everything at once.

## Design Concept

**Aesthetic**: Quiet sci-fi. Not cyberpunk neon or Star Trek consoles — more like a research station at the edge of known space. Dark indigo-to-charcoal backgrounds, amber/gold accent color, generous whitespace (darkspace), slow purposeful animations.

**Core principle**: Discovery over time. First visit shows the surface. Repeat visits reveal hidden layers (terminal, zen mode, easter eggs).

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Styling**: Tailwind CSS v4 + shadcn/ui (dark theme, zinc/neutral tokens, amber accent)
- **3D**: Three.js via @react-three/fiber + @react-three/drei (particle field)
- **Animation**: Framer Motion (page transitions, hover effects)
- **Content**: MDX files with frontmatter (file-based, no CMS, no database)
- **Typography**: Geist Sans (body) + Geist Mono (code, dates, IDs)
- **Deploy**: Vercel (jesseweigel.com)
- **Testing**: Vitest + React Testing Library, Playwright for e2e

## Site Structure

```
jesseweigel.com/                    → The Field (particle constellation landing)
jesseweigel.com/workshop/           → All projects
jesseweigel.com/workshop/[slug]     → Individual project page
jesseweigel.com/transmissions/      → Talks, podcasts, YouTube
jesseweigel.com/log/                → Blog / Captain's log
jesseweigel.com/log/[slug]          → Individual blog post
jesseweigel.com/archive/            → Research papers & deep writing (future)
jesseweigel.com/gallery/            → AI art, music, video (future)
jesseweigel.com/graph/              → Connection explorer (future)
```

## Pages

### The Field (Landing Page)

A dark expanse with softly glowing nodes rendered via Three.js. Each node represents a section or featured project. Nodes drift slowly in zero-gravity style. The scene is interactive:

- **Hover** a node → brightens, shows title + one-line description
- **Click** → smooth transition to that section/project
- Nodes cluster loosely by type but aren't rigidly grouped
- **Typing anywhere** activates search — no visible search bar until you type
- Subtle ambient particle dust in the background (50-100 slow-drifting points)
- Mouse/scroll gently influences particle movement

Below the fold (or accessible via scroll/click): a minimal text section with name, one-line bio, and section links for visitors who prefer traditional navigation.

**Fallback**: For low-end devices or reduced-motion preferences, render a static dark page with the same node layout as simple CSS cards.

### Workshop (Projects)

Grid/list of project cards, filterable by category. Each card shows:
- Project name
- One-line description
- Tech tags (React, TypeScript, Python, etc.)
- Status badge: Active / Experimental / Archived
- Star count (from GitHub)
- Links: GitHub repo, live demo (if applicable)

Clicking a card opens the project detail page with fuller description, screenshots/media, and related links.

**Categories**:
| Category | Projects |
|---|---|
| Agent Orchestration | toryo, taisho, tenshu |
| Games | HunterPath, idle-abyss, battlemath, demigods-fate, HunterPath-RPG, lotr-js-game |
| AI Tools | mineflayer-chatgpt |
| Education | koe |
| Research | ligo-glitch-vit-cnn, chromatic-number-random-graphs, ai-tutoring-k12-meta-analysis, get-math-done, get-review-done, get-legal-done, get-quant-done, get-engineering-done, get-chem-done, get-bio-done, get-policy-done |
| Creative & Experiments | stay-focused, voice-to-text-notes |

**Note**: Only include repos that are public on github.com/JesseRWeigel. Excluded: future-vision-xprize, discord-cc-bridge, mission-control, gemma-school (private/not public), OpenClaw (not Jesse's project), Web Dev category (not showcased), AI-Speicalist-Course, flashcards, music-player, langchain-rag-chat, research-crew, guide-creator-flow, github-chatGPT-plugin, chatGPT-discord, OpenAI-Assistant-Starter-Node, OpenAI-Assistant-Starter-Python.

**Talk slide repos**: Some talks have companion GitHub repos with slides (Spectacle-based presentations). These should be linked from the talk cards in Transmissions: how-livecoding-changed-my-life, one-codebase-to-rule-them-all, livecoding-mentoring, livecoding-mentoring-stirtrek2019, live-coding-mentoring-dachfest2018, react-wp-graphql-slides, kubernetes-slides. These are NOT listed as Workshop projects — they are linked from their respective Transmissions entries.

### Transmissions (Talks, Podcasts, YouTube)

Three subsections, visually unified:

**Conference Talks**:
- How Live Coding Changed My Life (DACHFest 2018, StirTrek 2019, NDC Minnesota, Abstractions, Pittsburgh TechFest)
- One Codebase to Rule Them All — Using React Native Everywhere (React Loop, Abstractions, KCDC)
- Building a Mentoring Community Through Live Coding (MidAtlantic Dev Conf, StirTrek 2019)
- React + GraphQL + WordPress with Zero Server Management (MidAtlantic Dev Conf — workshop)
- Intro to Kubernetes (slides repo exists)

Each talk card: title, venue(s), year, links to slides repo and video (if available).

**Podcasts**:
- freeCodeCamp Podcast Ep. 63 — "Building community and career through live streaming"
- CodeNewbie S13:E1 — "How live coding can level up your development"
- Learn to Code With Me S8:E4 — "From Washing Dishes to Managing Engineers"
- CTO Think (aka "This Old App") — "Benefits of Coding While Streaming"
- Faraday Tech Cafe Ep. 1.1 — "Learning, Livestreaming, and Mental Health"

Each podcast card: show name, episode title, listen link.

**YouTube / freeCodeCamp**:
- Personal channel: youtube.com/c/JesseWeigel29
- freeCodeCamp "Live Coding with Jesse" series
- Featured in "How to Create a Programming YouTube Channel"

### Log (Blog)

MDX-powered blog. Each post has:
- Date (star-date style display, e.g., "★ 2026.087")
- Title
- Tags (linking to related projects/transmissions)
- Body (full MDX — code blocks, images, embeds)

Posts are listed chronologically (newest first). Launch with 1-2 initial posts.

### About (Embedded in Landing or Accessible via Node)

Not a separate full page — accessible from the landing field or footer:
- Name, current role (Generative AI Engineer at TRACTIAN)
- Brief bio: self-taught developer, live coding community builder, conference speaker, AI agent architect, father of 4
- Social links: GitHub, Twitter/X, LinkedIn, YouTube
- Location: Steubenville, Ohio

## Visual Design

| Element | Treatment |
|---|---|
| Background | Deep indigo (#0a0a1a) → warm charcoal (#1a1a2e) gradient |
| Accent | Amber/gold (#f59e0b / amber-500) for interactive elements, links, highlights |
| Text | Cool blue-white (#e2e8f0 / slate-200) for body, brighter white for headings |
| Borders | 1px, low opacity (~0.1), things defined by space not lines |
| Cards | Subtle glass-morphism — bg-white/5, backdrop-blur-sm, thin border, soft amber glow on hover |
| Motion | Slow, eased (0.4-0.8s transitions). Nothing bounces. Drift, fade, breathe. |
| Spacing | Generous. Minimum 2rem between sections. Content max-width ~800px for readability |
| Typography | Geist Sans body (16px base), Geist Mono for code/meta. Headings large and light-weight |
| Particles | 50-100 points, very slow drift, gentle mouse interaction |

## Hidden Layers (Easter Eggs)

1. **Terminal**: Press backtick (`) anywhere → translucent terminal slides up. Commands: `help`, `ls`, `cd workshop`, `cat about`, `play music`, `hack` (fun response). Mobile: hidden but discoverable via long-press on logo.

2. **Zen Mode**: Press `z` → strips everything away, leaves only the particle field with very slow drift. A meditative screensaver. Press `z` or `Escape` to exit.

3. **Keyboard navigation**: Arrow keys move between nodes on the landing page. `/` opens search. `?` shows keyboard shortcuts overlay.

## Content Architecture (File-Based)

```
content/
├── projects/
│   ├── toryo.mdx
│   ├── hunterpath.mdx
│   └── ... (one per project)
├── transmissions/
│   ├── talks/
│   │   ├── how-live-coding-changed-my-life.mdx
│   │   └── ...
│   ├── podcasts/
│   │   ├── freecodecamp-ep63.mdx
│   │   └── ...
│   └── youtube/
│       ├── live-coding-with-jesse.mdx
│       └── ...
├── log/
│   ├── 2026-03-28-hello-observatory.mdx
│   └── ...
└── meta/
    ├── socials.json
    └── bio.json
```

Each content file uses frontmatter for structured data:

```mdx
---
title: "Toryo"
description: "Intelligent agent orchestrator with trust-based delegation"
category: "agent-orchestration"
status: "active"
github: "https://github.com/JesseRWeigel/toryo"
demo: null
tech: ["TypeScript", "Node.js", "WebSocket"]
stars: 0
featured: true
---

Full description and details here in MDX...
```

## AI-First Design Principles

- All content is structured data files — an AI agent can add/update/remove content by editing files and pushing to git
- No manual image optimization required — next/image handles it
- MDX allows mixing markdown with React components — AI can write rich content
- GitHub API could auto-sync star counts, descriptions via a cron job (future)
- The site itself can be tested end-to-end with Playwright — an AI can verify its own changes
- Clear separation: data (content/), presentation (components/), infrastructure (app/)

## Scope

### Launch (v1)
- The Field (landing with Three.js particle constellation)
- Workshop (projects grid with filtering)
- Transmissions (talks, podcasts, YouTube)
- Log (blog, 1-2 starter posts)
- About section (embedded in landing)
- Terminal easter egg
- Responsive (mobile-first)
- Deployed on Vercel at jesseweigel.com (or preview URL until DNS is configured)

### Future (v2+)
- Archive section (research papers)
- Gallery section (AI art/music/video)
- Graph explorer (connection visualization)
- Zen mode easter egg
- GitHub API integration for auto-syncing project data
- RSS feed for the log
- OG image generation per page

## Non-Goals

- No CMS or admin panel
- No authentication or user accounts
- No comments system
- No analytics beyond Vercel's built-in (can add later)
- No e-commerce or payment processing
- No server-side data fetching from external APIs at runtime (all content is static/build-time)
