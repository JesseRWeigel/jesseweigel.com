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
