/**
 * Sync the mineflayer-chatgpt session scoreboard into a committed snapshot.
 *
 * The bot team writes logs/sessions/<id>.json on its own machine. This reads
 * those, aggregates them, and writes content/data/mineflayer-chatgpt-sessions.json
 * which the Workshop page renders at build time. Run it locally after a session,
 * then commit the JSON. Same idea as sync-stars: the site stays self-contained.
 *
 *   node scripts/sync-mineflayer-stats.mjs [sessionsDir]
 *
 * Default sessionsDir: ../mineflayer-chatgpt/logs/sessions
 */
import fs from 'fs'
import path from 'path'

const SESSIONS_DIR =
  process.argv[2] ||
  path.resolve(process.cwd(), '..', 'mineflayer-chatgpt', 'logs', 'sessions')

const OUT = path.resolve(
  process.cwd(),
  'content',
  'data',
  'mineflayer-chatgpt-sessions.json',
)

// Canonical tech-tree order + human labels. Unknown milestones fall back to a
// humanized label and sort after the known ones.
const MILESTONE_ORDER = [
  ['first_log', 'First log'],
  ['first_planks', 'First planks'],
  ['first_crafting_table', 'First crafting table'],
  ['first_wooden_tool', 'First wooden tool'],
  ['first_chest', 'First chest'],
  ['first_stone_tool', 'First stone tool'],
  ['first_furnace', 'First furnace'],
  ['first_coal', 'First coal'],
  ['first_iron', 'First iron'],
  ['first_iron_tool', 'First iron tool'],
  ['first_diamond', 'First diamond'],
]
const ORDER_INDEX = new Map(MILESTONE_ORDER.map(([name], i) => [name, i]))
const LABELS = new Map(MILESTONE_ORDER)

function humanize(name) {
  const base = name.replace(/^first_/, 'first ').replace(/_/g, ' ')
  return base.charAt(0).toUpperCase() + base.slice(1)
}

function readSessions(dir) {
  if (!fs.existsSync(dir)) {
    console.error(`No sessions directory at ${dir}`)
    process.exit(1)
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')))
    .filter((s) => s && s.perBot)
}

function aggregate(sessions) {
  let totalActions = 0
  let totalSuccesses = 0
  let totalDeaths = 0
  let itemsDeposited = 0
  let longestSessionSec = 0

  // earliest time we hit each milestone across every session
  const best = new Map() // name -> bestSec

  const sessionRows = []

  for (const s of sessions) {
    let actions = 0
    let successes = 0
    let deaths = 0
    for (const bot of Object.values(s.perBot)) {
      actions += bot.actions || 0
      successes += bot.successes || 0
      deaths += bot.deaths || 0
      itemsDeposited += bot.itemsDeposited || 0
    }
    totalActions += actions
    totalSuccesses += successes
    totalDeaths += deaths
    longestSessionSec = Math.max(longestSessionSec, s.durationSec || 0)

    for (const m of s.milestones || []) {
      const prev = best.get(m.name)
      if (prev === undefined || m.atSec < prev) best.set(m.name, m.atSec)
    }

    sessionRows.push({
      id: s.sessionId,
      durationSec: s.durationSec || 0,
      actions,
      successRate: actions > 0 ? successes / actions : 0,
      deaths,
    })
  }

  const milestones = [...best.entries()]
    .map(([name, bestSec]) => ({
      name,
      label: LABELS.get(name) || humanize(name),
      bestSec,
    }))
    .sort(
      (a, b) =>
        (ORDER_INDEX.get(a.name) ?? 99) - (ORDER_INDEX.get(b.name) ?? 99) ||
        a.bestSec - b.bestSec,
    )

  // newest sessions first, keep the last 12
  sessionRows.sort((a, b) => b.id.localeCompare(a.id))

  return {
    generatedAt: new Date().toISOString(),
    sessionCount: sessions.length,
    totalActions,
    totalSuccesses,
    successRate: totalActions > 0 ? totalSuccesses / totalActions : 0,
    totalDeaths,
    itemsDeposited,
    longestSessionSec,
    milestones,
    sessions: sessionRows.slice(0, 12),
  }
}

const sessions = readSessions(SESSIONS_DIR)
const out = aggregate(sessions)
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
console.log(
  `Wrote ${path.relative(process.cwd(), OUT)} from ${sessions.length} session(s).`,
)
