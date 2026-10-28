import Link from 'next/link'
import { TrackedLink } from '@/components/tracked-link'

const signals = [
  {
    href: '/workshop/minecraft-agent-swarm',
    index: '01',
    label: 'Minecraft Agent Swarm',
    detail: 'Five local-LLM agents earning their way through a persistent world.',
    className: 'signal-one',
  },
  {
    href: '/workshop/toryo',
    index: '02',
    label: 'Toryo',
    detail: 'Quality-ratcheting infrastructure for teams of coding agents.',
    className: 'signal-two',
  },
  {
    href: '/workshop/contextrot',
    index: '03',
    label: 'Contextrot',
    detail: 'Inspectable experiments in what repeated summarization preserves and loses.',
    className: 'signal-three',
  },
]

export function ObservatoryHero() {
  return (
    <section className="hero-shell" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-copy">
        <div className="hero-status">
          <span className="status-dot" />
          The Observatory · Open to senior engineering roles
        </div>
        <h1 id="hero-title">
          Jesse Weigel.{' '}
          <span>Senior AI &amp; full-stack engineer.</span>
        </h1>
        <p className="hero-lede">
          I build agent systems, evaluation tools, and full-stack products with TypeScript,
          Python, React, and Next.js. I&apos;m looking for my next senior engineering role
          and sharing the decisions, evidence, and lessons behind my work.
        </p>
        <div className="hero-actions">
          <TrackedLink
            href="#selected-work"
            className="button button-primary"
            eventName="hero_cta"
            eventData={{ destination: 'selected-work' }}
          >
            Explore selected work
            <span aria-hidden="true">↗</span>
          </TrackedLink>
          <TrackedLink
            href="/contact"
            className="button button-secondary"
            eventName="hero_cta"
            eventData={{ destination: 'contact' }}
          >
            Contact me
          </TrackedLink>
        </div>
        <nav className="hero-actions" aria-label="More about Jesse">
          <Link href="/resume" className="text-link">View résumé →</Link>
          <Link href="/transmissions" className="quiet-link">Speaking &amp; teaching</Link>
        </nav>
        <p className="hero-footnote">
          Over a decade shipping software · 226 live-coding episodes · production AI engineering
        </p>
      </div>

      <div className="signal-map" aria-label="Featured work">
        <svg className="signal-lines" viewBox="0 0 680 620" aria-hidden="true">
          <path d="M72 322 L248 102 L544 186 L602 474 L308 546 L72 322" />
          <path d="M248 102 L308 546 M544 186 L72 322" />
          <circle cx="72" cy="322" r="3" />
          <circle cx="248" cy="102" r="3" />
          <circle cx="544" cy="186" r="3" />
          <circle cx="602" cy="474" r="3" />
          <circle cx="308" cy="546" r="3" />
        </svg>

        {signals.map((signal) => (
          <Link
            key={signal.href}
            href={signal.href}
            className={`signal-card ${signal.className}`}
          >
            <span className="signal-beacon" aria-hidden="true" />
            <span className="signal-index">SIGNAL {signal.index}</span>
            <strong>{signal.label}</strong>
            <small>{signal.detail}</small>
          </Link>
        ))}
      </div>
    </section>
  )
}
