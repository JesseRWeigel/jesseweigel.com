import type { ProjectStats } from '@/lib/types'

function formatSec(sec: number): string {
  if (sec < 60) return `${sec}s`
  if (sec < 3600) return `${Math.round(sec / 60)}m`
  const h = Math.floor(sec / 3600)
  const m = Math.round((sec % 3600) / 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function pct(n: number): string {
  return `${Math.round(n * 100)}%`
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-3">
      <div className="text-lg font-light tabular-nums text-foreground">{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  )
}

export function ProjectMetrics({ stats }: { stats: ProjectStats }) {
  const synced = new Date(stats.generatedAt).toISOString().slice(0, 10)

  return (
    <section className="mt-12 space-y-5">
      <div className="space-y-1">
        <h2 className="text-sm font-medium tracking-tight text-foreground">
          Measured progress
        </h2>
        <p className="text-xs text-muted-foreground">
          Pulled from the team&apos;s own session scoreboard. {stats.sessionCount} sessions
          tracked, last synced {synced}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Tile label="Sessions" value={String(stats.sessionCount)} />
        <Tile label="Team success rate" value={pct(stats.successRate)} />
        <Tile label="Actions taken" value={stats.totalActions.toLocaleString()} />
        <Tile label="Deaths" value={String(stats.totalDeaths)} />
        <Tile label="Items stashed" value={String(stats.itemsDeposited)} />
        <Tile label="Longest run" value={formatSec(stats.longestSessionSec)} />
      </div>

      {stats.milestones.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Tech-tree milestones (best of {stats.coldStartCount} cold starts)
          </div>
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-1">
            {stats.milestones.map((m) => (
              <div
                key={m.name}
                className="flex items-baseline justify-between gap-4 px-3 py-1.5 text-sm"
              >
                <span className="text-foreground/90">{m.label}</span>
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  {formatSec(m.bestSec)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.sessions.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Recent sessions
          </div>
          <div className="overflow-hidden rounded-lg border border-white/5">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="px-3 py-2 font-normal">Date</th>
                  <th className="px-3 py-2 text-right font-normal">Length</th>
                  <th className="px-3 py-2 text-right font-normal">Actions</th>
                  <th className="px-3 py-2 text-right font-normal">Success</th>
                  <th className="px-3 py-2 text-right font-normal">Deaths</th>
                </tr>
              </thead>
              <tbody>
                {stats.sessions.map((s) => (
                  <tr key={s.id} className="border-t border-white/5">
                    <td className="px-3 py-2 font-mono text-muted-foreground">
                      {s.id.slice(0, 10)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatSec(s.durationSec)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {s.actions.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{pct(s.successRate)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{s.deaths}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
