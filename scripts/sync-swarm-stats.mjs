/**
 * Sync the Minecraft Agent Swarm session scoreboard into a committed snapshot.
 *
 * The bot team writes logs/sessions/<id>.json on its own machine. This reads
 * those, aggregates them, and writes
 * content/data/minecraft-agent-swarm-sessions.json which the Workshop page
 * renders at build time. Run it locally after a session, then commit the JSON.
 * Same idea as sync-stars: the site stays self-contained.
 *
 *   node scripts/sync-swarm-stats.mjs [sessionsDir]
 *
 * Default sessionsDir: ../mineflayer-chatgpt/logs/sessions (the repo folder
 * kept its old name on disk even though the project was renamed).
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
  'minecraft-agent-swarm-sessions.json',
)

// Milestone times only count from "cold start" sessions. Sessions that continue
// a persistent world begin with items already in inventory, which logs
// milestones at ~1-6s and would otherwise claim things like "first diamond in
// 3s". In a true cold start the bot starts empty, so nothing is achieved
// instantly: the EARLIEST milestone takes real time (walk to a tree, chop it).
// If any milestone fired in under FRESH_MIN_SEC, the bot spawned holding items,
// so the whole session is excluded from milestone timing.
const FRESH_MIN_SEC = 15
function isColdStart(s) {
  const ms = s.milestones || []
  if (!ms.some((m) => m.name === 'first_log')) return false
  return ms.every((m) => m.atSec >= FRESH_MIN_SEC)
}

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
  ['first_iron_ingot', 'First iron ingot'],
  ['first_iron_tool', 'First iron tool'],
  ['first_diamond', 'First diamond'],
  ['first_bed', 'First bed'],
  ['first_stash_deposit', 'First stash deposit'],
  ['first_farm', 'First farm'],
  ['first_complete_house', 'First complete house'],
]
const ORDER_INDEX = new Map(MILESTONE_ORDER.map(([name], i) => [name, i]))
const LABELS = new Map(MILESTONE_ORDER)

// Fastest each milestone is physically achievable from an empty start (seconds).
// A recorded time below its floor means the bot spawned already holding that
// item (persistent world), so that datapoint is carryover and gets ignored.
const FLOORS = {
  first_log: 12,
  first_planks: 14,
  first_crafting_table: 16,
  first_wooden_tool: 18,
  first_chest: 16,
  first_stone_tool: 35,
  first_furnace: 35,
  first_coal: 30,
  first_iron: 150,
  first_iron_ingot: 180,
  first_iron_tool: 200,
  first_diamond: 600,
  first_bed: 20,
  first_stash_deposit: 20,
  first_farm: 45,
  first_complete_house: 300,
}

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

  // best time we hit each milestone, cold-start sessions only
  const best = new Map() // name -> bestSec
  let coldStartCount = 0

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

    if (isColdStart(s)) {
      coldStartCount++
      for (const m of s.milestones || []) {
        const floor = FLOORS[m.name] ?? FRESH_MIN_SEC
        if (m.atSec < floor) continue // carryover, not a real cold-start time
        const prev = best.get(m.name)
        if (prev === undefined || m.atSec < prev) best.set(m.name, m.atSec)
      }
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
    coldStartCount,
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
