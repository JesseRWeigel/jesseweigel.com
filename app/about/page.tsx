import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SectionHeading } from '@/components/section-heading'
import { TrackedLink } from '@/components/tracked-link'
import { capabilities, experience, socialLinks } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Jesse Weigel is a generative AI engineer, self-taught software developer, conference speaker, community builder, and father of four.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return (
    <main className="editorial-page">
      <div className="site-container">
        <section className="about-hero">
          <div className="about-portrait-wrap">
            <div className="about-portrait-frame">
              <Image
                src="https://avatars.githubusercontent.com/u/11077930?v=4"
                alt="Jesse Weigel"
                width={460}
                height={460}
                priority
              />
              <span className="portrait-coordinate">40.3698° N · 80.6340° W</span>
            </div>
          </div>
          <div className="about-intro">
            <p className="eyebrow">About Jesse</p>
            <h1>I took the long way into engineering. I kept the curiosity.</h1>
            <div className="about-prose">
              <p>
                I&apos;m a self-taught software engineer who started learning in public and never
                really stopped. Over the last decade, I&apos;ve moved from frontend development to
                engineering leadership to production generative AI systems.
              </p>
              <p>
                My favorite work lives where models meet consequences: autonomous agents with
                real tools, evaluation loops that expose failure, and systems that have to keep
                working after the demo ends. I&apos;m currently a Generative AI Engineer at TRACTIAN.
              </p>
              <p>
                I&apos;m also a husband, father of four, conference speaker, and the person most likely
                to turn a game for my kids into a multi-year systems experiment.
              </p>
            </div>
            <div className="hero-actions">
              <TrackedLink
                href="/contact"
                className="button button-primary"
                eventName="about_cta"
                eventData={{ destination: 'contact' }}
              >
                Work with me
              </TrackedLink>
              <Link href="/resume" className="button button-secondary">View résumé</Link>
            </div>
          </div>
        </section>

        <section className="about-section">
          <SectionHeading
            eyebrow="Operating principles"
            title="How I like to build."
          />
          <div className="principles-grid">
            <article>
              <span>01</span>
              <h3>Instrument the truth</h3>
              <p>If a system cannot tell us how it failed, it is not ready to improve.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Keep only forward progress</h3>
              <p>Quality gates, reversible experiments, and evidence beat hopeful iteration.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Make the work legible</h3>
              <p>Strong systems—and strong teams—leave a trail others can understand and extend.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Build for the real environment</h3>
              <p>The useful lessons begin after the happy path meets latency, failure, and time.</p>
            </article>
          </div>
        </section>

        <section className="about-section">
          <SectionHeading
            eyebrow="Experience"
            title="From frontend systems to agent teams."
            action={<Link href="/resume" className="text-link">Full résumé →</Link>}
          />
          <div className="experience-list">
            {experience.map((item) => (
              <article key={`${item.company}-${item.period}`} className="experience-item">
                <p className="experience-period">{item.period}</p>
                <div>
                  <h3>{item.role}</h3>
                  <p className="experience-company">{item.company}</p>
                </div>
                <p className="experience-summary">{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section about-capabilities">
          <SectionHeading eyebrow="Capabilities" title="The working set." />
          <div className="capability-cloud">
            {capabilities.map((capability) => <span key={capability}>{capability}</span>)}
          </div>
          <div className="about-socials">
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">YouTube ↗</a>
          </div>
        </section>
      </div>
    </main>
  )
}
