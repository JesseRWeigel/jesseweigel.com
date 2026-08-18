import Link from 'next/link'
import { PageTransition } from '@/components/page-transition'
import report from '@/content/data/minecraft-advancements.json'

export const metadata = {
  title: 'Swarm Advancement Ledger',
  description:
    'Every Minecraft advancement the agent swarm has earned, read from the server files — never self-reported.',
}

const CATEGORY_ORDER = ['story', 'nether', 'end', 'adventure', 'husbandry'] as const
const CATEGORY_LABELS: Record<string, string> = {
  story: 'Story',
  nether: 'Nether',
  end: 'The End',
  adventure: 'Adventure',
  husbandry: 'Husbandry',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function AdvancementsPage() {
  const { earned, total, categories, entries, generatedAt } = report
  return (
    <PageTransition>
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-light tracking-tight sm:text-3xl">Swarm Advancement Ledger</h1>
        <p className="mt-2 text-muted-foreground">
          Every advancement the{' '}
          <Link href="/workshop/minecraft-agent-swarm" className="underline underline-offset-4 hover:text-foreground">
            Minecraft agent swarm
          </Link>{' '}
          has earned. Read from the server&apos;s own files, never self-reported — the bots do not get to grade
          their own homework.
        </p>

        <div className="mt-10 flex items-baseline gap-3">
          <span className="text-5xl font-light tabular-nums">{earned}</span>
          <span className="text-xl text-muted-foreground">of {total}</span>
        </div>

        <div className="mt-6 space-y-2">
          {CATEGORY_ORDER.map((cat) => {
            const c = (categories as Record<string, { earned: number; total: number }>)[cat]
            if (!c) return null
            const pct = c.total === 0 ? 0 : Math.round((c.earned / c.total) * 100)
            return (
              <div key={cat} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0 text-muted-foreground">{CATEGORY_LABELS[cat]}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-foreground/60" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-16 shrink-0 text-right tabular-nums text-muted-foreground">
                  {c.earned}/{c.total}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="py-2 pr-4 font-normal">Earned</th>
                <th className="py-2 pr-4 font-normal">Advancement</th>
                <th className="py-2 pr-4 font-normal">Category</th>
                <th className="py-2 font-normal">First</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-border/50 align-top">
                  <td className="whitespace-nowrap py-2 pr-4 tabular-nums text-muted-foreground">
                    {formatDate(e.earnedAt)}
                  </td>
                  <td className="py-2 pr-4">
                    <span className="font-medium">{e.title}</span>
                    {e.description && <span className="block text-muted-foreground">{e.description}</span>}
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">{CATEGORY_LABELS[e.category] ?? e.category}</td>
                  <td className="py-2 text-muted-foreground">
                    {e.by[0]}
                    {e.by.length > 1 && <span className="text-muted-foreground/60"> +{e.by.length - 1}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          Generated {formatDate(generatedAt)} by{' '}
          <a
            href="https://github.com/JesseRWeigel/minecraft-agent-swarm/blob/main/scripts/advancement-report.ts"
            className="underline underline-offset-4 hover:text-foreground"
          >
            advancement-report.ts
          </a>{' '}
          from Paper&apos;s per-player advancement files. &ldquo;First&rdquo; is the earliest bot to earn it;
          +N counts teammates who have it too. Updated whenever there is something new to record.
        </p>
      </main>
    </PageTransition>
  )
}
