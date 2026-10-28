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
            <h1>About me</h1>
            <div className="about-prose">
              <p>I’m a software engineer working on AI systems and full-stack apps. Most recently, I worked on generative AI at Tractian.</p>
              <p>I also build a lot of things on my own. Some are tools for working with coding agents. Others are experiments, like getting a group of agents to play Minecraft and seeing what they do. The unexpected behavior is often the interesting part.</p>
              <p>I’ve done live coding with freeCodeCamp and spoken at conferences. This site is where I share my projects, talks, and what I’m working on.</p>
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
