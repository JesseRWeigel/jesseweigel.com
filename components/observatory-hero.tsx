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
    href: '/workshop/get-x-done',
    index: '03',
    label: 'Autonomous research',
    detail: 'Specialized copilots working across science, math, law, and policy.',
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
          Generative AI engineer · systems online
        </div>
        <h1 id="hero-title">
          I build AI systems that learn, coordinate, and{' '}
          <span>survive contact with reality.</span>
        </h1>
        <p className="hero-lede">
          I&apos;m Jesse Weigel. I build autonomous agent teams, evaluation infrastructure,
          and ambitious experiments—currently at TRACTIAN, always in the open when I can be.
        </p>
        <div className="hero-actions">
          <TrackedLink
            href="/workshop/minecraft-agent-swarm"
            className="button button-primary"
            eventName="hero_cta"
            eventData={{ destination: 'minecraft-agent-swarm' }}
          >
            Explore the agent swarm
            <span aria-hidden="true">↗</span>
          </TrackedLink>
          <TrackedLink
            href="/contact"
            className="button button-secondary"
            eventName="hero_cta"
            eventData={{ destination: 'contact' }}
          >
            Work with me
          </TrackedLink>
        </div>
        <p className="hero-footnote">
          Over a decade shipping software · father of four · learning in public since 2017
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

        <div className="signal-core" aria-hidden="true">
          <span>JW</span>
          <small>observatory</small>
        </div>

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
