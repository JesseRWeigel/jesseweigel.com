import type { Metadata } from 'next'
import Link from 'next/link'
import { FeaturedProjectCard } from '@/components/featured-project-card'
import { PageTransition } from '@/components/page-transition'
import { getProjects } from '@/lib/content'
import { flagshipSlugs } from '@/lib/site'
import { WorkshopClient } from './workshop-client'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Selected autonomous systems, AI infrastructure, research copilots, games, and open-source experiments by Jesse Weigel.',
  alternates: { canonical: '/workshop' },
}

export default async function WorkshopPage() {
  const projects = await getProjects()
  const flagship = flagshipSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project) => project !== undefined)
  const moreProjects = projects.filter(
    (project) => !flagshipSlugs.some((slug) => slug === project.slug),
  )

  return (
    <PageTransition>
      <main className="work-page">
        <div className="site-container">
          <header className="work-hero">
            <p className="eyebrow">Selected work · The Workshop</p>
            <h1>Systems built to encounter the real world.</h1>
            <div className="work-hero-bottom">
              <p>
                Autonomous agents, orchestration infrastructure, research copilots, and games.
                The common thread is a preference for measurable behavior over polished claims.
              </p>
              <Link href="/contact" className="text-link">Bring me a hard problem →</Link>
            </div>
          </header>

          <section className="work-flagships" aria-labelledby="flagship-heading">
            <div className="work-section-label">
              <p id="flagship-heading">Flagship case studies</p>
              <span>{flagship.length} systems</span>
            </div>
            <div className="featured-project-list">
              {flagship.map((project, index) => (
                <FeaturedProjectCard key={project.slug} project={project} priority={index === 0} />
              ))}
            </div>
          </section>

          <section className="more-work" aria-labelledby="more-work-heading">
            <div className="work-section-label">
              <p id="more-work-heading">More experiments</p>
              <span>{moreProjects.length} projects</span>
            </div>
            <WorkshopClient projects={moreProjects} />
          </section>
        </div>
      </main>
    </PageTransition>
  )
}
