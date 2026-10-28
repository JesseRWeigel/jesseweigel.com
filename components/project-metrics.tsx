import type { ProjectStats } from '@/lib/types'

function formatSec(sec: number): string {
  if (sec < 60) return `${sec}s`
  if (sec < 3600) return `${Math.round(sec / 60)}m`
  const hours = Math.floor(sec / 3600)
  const minutes = Math.round((sec % 3600) / 60)
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
}

function pct(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function ProjectMetrics({ stats }: { stats: ProjectStats }) {
  const synced = new Date(stats.generatedAt).toISOString().slice(0, 10)
  const primaryMetrics = [
    { label: 'Sessions observed', value: String(stats.sessionCount) },
    { label: 'Actions recorded', value: stats.totalActions.toLocaleString() },
    { label: 'Items moved through stash', value: stats.itemsDeposited.toLocaleString() },
    { label: 'Longest continuous run', value: formatSec(stats.longestSessionSec) },
  ]

  return (
    <section className="telemetry-panel" aria-labelledby="telemetry-title">
      <div className="telemetry-heading">
        <div>
          <p className="eyebrow">Live evidence</p>
          <h2 id="telemetry-title">The project keeps its own receipts.</h2>
        </div>
        <p>Snapshot {synced} · generated from the team&apos;s session scoreboard</p>
      </div>

      <div className="telemetry-grid">
        {primaryMetrics.map((metric) => (
          <div key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>

      {stats.milestones.length > 0 && (
        <div className="milestone-strip">
          <p>Best cold-start milestones</p>
          <div>
            {stats.milestones.slice(0, 6).map((milestone) => (
              <span key={milestone.name}>
                {milestone.label} <strong>{formatSec(milestone.bestSec)}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {stats.sessions.length > 0 && (
        <details className="telemetry-details">
          <summary>Inspect recent run telemetry</summary>
          <div className="telemetry-table-wrap">
            <table>
              <thead>
                <tr><th>Date</th><th>Length</th><th>Actions</th><th>Action success</th><th>Deaths</th></tr>
              </thead>
              <tbody>
                {stats.sessions.map((session) => (
                  <tr key={session.id}>
                    <td>{session.id.slice(0, 10)}</td>
                    <td>{formatSec(session.durationSec)}</td>
                    <td>{session.actions.toLocaleString()}</td>
                    <td>{pct(session.successRate)}</td>
                    <td>{session.deaths}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </section>
  )
}
