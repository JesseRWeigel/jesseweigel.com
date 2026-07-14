import type { Metadata } from 'next'
import Link from 'next/link'
import { FeaturedProjectCard } from '@/components/featured-project-card'
import { MetricStrip } from '@/components/metric-strip'
import { ObservatoryHero } from '@/components/observatory-hero'
import { SectionHeading } from '@/components/section-heading'
import { TrackedLink } from '@/components/tracked-link'
import { getBlogPosts, getProjectBySlug, getProjectStats } from '@/lib/content'
import { contactEmail, credibilityMarks, flagshipSlugs } from '@/lib/site'
import type { Project } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Jesse Weigel — Generative AI Engineer & Agent Systems Builder',
  description:
    'Generative AI engineer building autonomous agent teams, evaluation infrastructure, developer tools, and ambitious experiments.',
  alternates: { canonical: '/' },
}

export default async function Home() {
  const [projects, posts, stats] = await Promise.all([
    Promise.all(flagshipSlugs.map((slug) => getProjectBySlug(slug))),
    getBlogPosts(),
    getProjectStats('minecraft-agent-swarm'),
  ])

  const flagshipProjects = projects.filter((project): project is Project => project !== null)
  const latestPosts = posts.slice(0, 3)

  return (
    <main>
      <ObservatoryHero />

      <div className="site-container">
        <MetricStrip
          totalActions={stats?.totalActions ?? 344_117}
          sessionCount={stats?.sessionCount ?? 111}
          longestHours={Math.round((stats?.longestSessionSec ?? 507_058) / 3600)}
        />

        <section className="home-section" aria-labelledby="selected-work">
          <SectionHeading
            id="selected-work"
            eyebrow="Selected systems"
            title="Proof, not prototypes."
            description="A few projects where the hard part was not generating a demo—it was building a system that could be measured, trusted, and improved."
            action={
              <Link href="/workshop" className="text-link">
                View all work <span aria-hidden="true">→</span>
              </Link>
            }
          />
          <div className="featured-project-list">
            {flagshipProjects.map((project, index) => (
              <FeaturedProjectCard key={project.slug} project={project} priority={index === 0} />
            ))}
          </div>
        </section>

        <section className="home-section credibility-section" aria-labelledby="public-work">
          <SectionHeading
            id="public-work"
            eyebrow="Public record"
            title="A decade of building—and explaining the build."
            description="I learned in public, taught the mistakes as well as the wins, and found a career through community. That instinct still shapes how I work with teams today."
          />
          <div className="credibility-grid">
            <div className="credibility-story">
              <p className="pull-quote">
                “Hundreds of hours of live coding taught me to make the work legible: explain the
                tradeoffs, show the failed attempt, and leave a trail someone else can follow.”
              </p>
              <div className="credibility-actions">
                <Link href="/transmissions" className="text-link">
                  Talks, podcasts, and 226 episodes <span aria-hidden="true">→</span>
                </Link>
                <Link href="/about" className="quiet-link">
                  Read my story
                </Link>
              </div>
            </div>
            <div className="credibility-marks" aria-label="Selected publications and conferences">
              {credibilityMarks.map((mark) => (
                <div key={mark} className="credibility-mark">
                  {mark}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section" aria-labelledby="field-notes">
          <SectionHeading
            id="field-notes"
            eyebrow="Field notes"
            title="What the systems taught back."
            description="Short engineering stories from long-running agents, model trials, and the bugs that only appear after everyone goes to sleep."
            action={
              <Link href="/log" className="text-link">
                Read the log <span aria-hidden="true">→</span>
              </Link>
            }
          />
          <div className="field-notes-grid">
            {latestPosts.map((post, index) => (
              <Link key={post.slug} href={`/log/${post.slug}`} className="field-note-card">
                <span className="field-note-index">0{index + 1}</span>
                <div>
                  <p className="eyebrow">{post.readingTime} · {post.tags[0]}</p>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
                <span className="field-note-arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="contact-panel" aria-labelledby="contact-title">
          <div>
            <p className="eyebrow">Open channel</p>
            <h2 id="contact-title">Have a difficult AI systems problem?</h2>
            <p>
              I&apos;m interested in ambitious engineering roles, focused consulting, speaking,
              and collaborations where the system has to do more than look good in a demo.
            </p>
          </div>
          <div className="contact-panel-actions">
            <TrackedLink
              href="/contact"
              className="button button-primary"
              eventName="contact_cta"
              eventData={{ location: 'homepage_footer' }}
            >
              Start a conversation
            </TrackedLink>
            <a href={`mailto:${contactEmail}`} className="quiet-link">
              {contactEmail}
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}
