import type { Metadata } from 'next'
import { contactEmail, socialLinks } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Work with me',
  description:
    'Contact Jesse Weigel about generative AI engineering roles, consulting, speaking, or ambitious collaborations.',
  alternates: { canonical: '/contact' },
}

const conversationTypes = [
  {
    title: 'Build a system',
    description: 'Multi-agent architecture, evaluation, model routing, RAG, and production AI infrastructure.',
    subject: 'AI systems project',
  },
  {
    title: 'Join a team',
    description: 'Senior and staff-level roles where autonomous systems, developer tools, or AI products are core.',
    subject: 'Engineering opportunity',
  },
  {
    title: 'Share the work',
    description: 'Conference talks, podcasts, workshops, livestreams, and technical conversations.',
    subject: 'Speaking invitation',
  },
  {
    title: 'Try something strange',
    description: 'Research collaborations and ambitious experiments that need an engineer who enjoys uncertainty.',
    subject: 'Collaboration idea',
  },
]

export default function ContactPage() {
  return (
    <main className="contact-page">
      <div className="site-container contact-layout">
        <section className="contact-intro">
          <p className="eyebrow">Open channel</p>
          <h1>Let&apos;s build something that has to work.</h1>
          <p className="contact-lede">
            The most interesting conversations usually start with a difficult constraint, a system
            that keeps failing, or an idea that sounds slightly unreasonable.
          </p>
          <a
            className="contact-email"
            href={`mailto:${contactEmail}?subject=${encodeURIComponent('Hello from jesseweigel.com')}`}
          >
            <span>Email Jesse</span>
            <strong>{contactEmail}</strong>
            <span aria-hidden="true">↗</span>
          </a>
          <p className="contact-response-note">
            I read every thoughtful message. A little context about the problem and why it matters
            is the best way to start.
          </p>
        </section>

        <section className="conversation-grid" aria-label="Ways to work together">
          {conversationTypes.map((item, index) => (
            <a
              key={item.title}
              href={`mailto:${contactEmail}?subject=${encodeURIComponent(item.subject)}`}
              className="conversation-card"
            >
              <span>0{index + 1}</span>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <strong>Start this conversation →</strong>
            </a>
          ))}
        </section>

        <div className="contact-social-row">
          <p>Prefer a public channel?</p>
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a href={socialLinks.x} target="_blank" rel="noopener noreferrer">X ↗</a>
        </div>
      </div>
    </main>
  )
}
