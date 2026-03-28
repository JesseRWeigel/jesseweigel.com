import Link from 'next/link'
import { LandingFallback } from '@/components/landing-fallback'
import { ParticleFieldLoader } from '@/components/particle-field-loader'

export default function Home() {
  return (
    <main className="relative">
      <ParticleFieldLoader />
      {/* Overlay text */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-light tracking-tight text-foreground">Jesse Weigel</h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">The Observatory</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground/60">
          Generative AI Engineer &middot; Community builder
        </p>
      </div>
      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 text-muted-foreground/70">
          <p className="font-mono text-[10px]">click a node to explore</p>
          <div className="h-6 w-px bg-gradient-to-b from-muted-foreground/70 to-transparent" />
        </div>
      </div>
      {/* Below-fold navigation */}
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
              <p className="font-medium text-foreground transition-colors group-hover:text-primary">{label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </Link>
          ))}
        </div>
        <div className="mt-16 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Generative AI Engineer at TRACTIAN. Self-taught developer building autonomous systems,
            games for my kids, and tools that make developers&apos; lives better. Previously at
            American Express, DICK&apos;s Sporting Goods, and Tabella.
          </p>
        </div>
      </section>
    </main>
  )
}
