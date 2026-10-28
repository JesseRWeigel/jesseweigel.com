export function MetricStrip({
  totalActions,
  sessionCount,
  longestHours,
}: {
  totalActions: number
  sessionCount: number
  longestHours: number
}) {
  const metrics = [
    { value: '10+', label: 'years shipping software' },
    { value: '5', label: 'autonomous agents' },
    { value: `${longestHours}h`, label: 'longest unattended run' },
    { value: `${Math.floor(totalActions / 1000)}k+`, label: 'measured agent actions' },
    { value: String(sessionCount), label: 'instrumented sessions' },
    { value: '226', label: 'live-coding episodes' },
  ]

  return (
    <section className="metric-strip" aria-label="Career and project highlights">
      {metrics.map((metric) => (
        <div key={metric.label} className="metric-strip-item">
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
        </div>
      ))}
    </section>
  )
}
