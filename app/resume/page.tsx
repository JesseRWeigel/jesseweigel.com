import type { Metadata } from 'next'
import Link from 'next/link'
import { PrintResumeButton } from '@/components/print-resume-button'
import { capabilities, contactEmail, experience, socialLinks } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Résumé',
  description: 'Jesse Weigel — Generative AI Engineer and senior software engineer.',
  alternates: { canonical: '/resume' },
}

const projects = [
  {
    title: 'Minecraft Agent Swarm',
    href: '/workshop/minecraft-agent-swarm',
    description:
      'Five autonomous local-LLM agents with shared context, dynamic skills, evaluation telemetry, and a 140-hour unattended run.',
  },
  {
    title: 'Toryo',
    href: '/workshop/toryo',
    description:
      'Open-source coding-agent orchestrator with trust-based delegation, quality ratcheting, and pluggable tool adapters.',
  },
  {
    title: 'Get-X-Done',
    href: '/workshop/get-x-done',
    description:
      'Seven domain-specific autonomous research copilots spanning mathematics, law, quant, engineering, science, and policy.',
  },
]

export default function ResumePage() {
  return (
    <main className="resume-page">
      <div className="resume-toolbar site-container">
        <Link href="/about" className="quiet-link">← About</Link>
        <PrintResumeButton />
      </div>

      <article className="resume-sheet">
        <header className="resume-header">
          <div>
            <p className="eyebrow">Generative AI Engineer</p>
            <h1>Jesse R. Weigel</h1>
            <p>
              Senior software engineer with 10+ years of experience, specializing in agent systems,
              LLM orchestration, evaluation infrastructure, and production AI architecture.
            </p>
          </div>
          <address>
            Steubenville, Ohio · Remote<br />
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a><br />
            <a href={socialLinks.github}>github.com/JesseRWeigel</a><br />
            <a href={socialLinks.linkedin}>linkedin.com/in/jesseweigel</a>
          </address>
        </header>

        <section className="resume-section">
          <h2>Experience</h2>
          <div className="resume-experience-list">
            {experience.map((item) => (
              <div key={`${item.company}-${item.period}`} className="resume-experience-item">
                <div>
                  <h3>{item.role}</h3>
                  <p>{item.company}</p>
                </div>
                <p>{item.summary}</p>
                <time>{item.period}</time>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-section">
          <h2>Selected systems</h2>
          <div className="resume-project-list">
            {projects.map((project) => (
              <div key={project.title}>
                <h3><Link href={project.href}>{project.title}</Link></h3>
                <p>{project.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-section resume-two-column">
          <div>
            <h2>Capabilities</h2>
            <ul>{capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div>
            <h2>Education & community</h2>
            <p><strong>Udacity</strong> — React Nanodegree, 2017</p>
            <p><strong>West Liberty State University</strong> — BS Business Administration, Summa Cum Laude, 2008</p>
            <p><strong>freeCodeCamp</strong> — 226 live-coding episodes and global developer mentorship</p>
            <p><strong>Conference speaker</strong> — React Loop, NDC Minnesota, DACHFest, Abstractions, and more</p>
          </div>
        </section>
      </article>
    </main>
  )
}
