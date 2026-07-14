import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { MdxContent } from '@/components/mdx-content'
import { PageTransition } from '@/components/page-transition'
import { ProjectMetrics } from '@/components/project-metrics'
import { TrackedLink } from '@/components/tracked-link'
import { getProjectBySlug, getProjects, getProjectStats } from '@/lib/content'
import { SITE_URL } from '@/lib/site'

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/workshop/${slug}` },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/workshop/${slug}`,
      title: `${project.title} — Jesse Weigel`,
      description: project.description,
      images: project.cover ? [{ url: project.cover, alt: `${project.title} interface` }] : undefined,
    },
  }
}

const statusLabels: Record<string, string> = {
  active: 'Active system',
  experimental: 'Experiment',
  archived: 'Archived project',
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  const stats = await getProjectStats(slug)
  const outcomes = project.outcomes ?? []
  const projectJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    description: project.description,
    url: `${SITE_URL}/workshop/${slug}`,
    codeRepository: project.github,
    programmingLanguage: project.tech,
    author: { '@id': `${SITE_URL}/#jesse-weigel` },
    image: project.cover ? `${SITE_URL}${project.cover}` : undefined,
  }

  return (
    <PageTransition>
      <main className="case-study-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(projectJsonLd).replace(/</g, '\\u003c'),
          }}
        />

        <div className="site-container">
          <Link href="/workshop" className="case-study-back">← All work</Link>

          <header className="case-study-header">
            <div className="case-study-title-row">
              <div>
                <p className="eyebrow">
                  {statusLabels[project.status]} · {project.category.replaceAll('-', ' ')}
                </p>
                <h1>{project.title}</h1>
              </div>
              <span className={`case-study-status status-${project.status}`}>{project.status}</span>
            </div>
            <p className="case-study-dek">{project.description}</p>

            <div className="case-study-facts">
              {project.role && (
                <div><span>My role</span><strong>{project.role}</strong></div>
              )}
              {project.timeframe && (
                <div><span>Timeline</span><strong>{project.timeframe}</strong></div>
              )}
              <div><span>Stack</span><strong>{project.tech.slice(0, 4).join(' · ')}</strong></div>
            </div>

            <div className="case-study-actions">
              <TrackedLink
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-primary"
                eventName="project_outbound"
                eventData={{ project: project.slug, destination: 'github' }}
              >
                Inspect the source{project.stars > 0 ? ` · ★ ${project.stars}` : ''}
              </TrackedLink>
              {project.demo && (
                <TrackedLink
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button button-secondary"
                  eventName="project_outbound"
                  eventData={{ project: project.slug, destination: 'demo' }}
                >
                  Open live demo ↗
                </TrackedLink>
              )}
            </div>
          </header>

          {outcomes.length > 0 && (
            <section className="outcome-grid" aria-label="Project outcomes">
              {outcomes.map((outcome) => (
                <div key={outcome.label}>
                  <strong>{outcome.value}</strong>
                  <span>{outcome.label}</span>
                </div>
              ))}
            </section>
          )}

          {project.cover && (
            <div className="case-study-cover">
              <Image
                src={project.cover}
                alt={`${project.title} interface`}
                width={1600}
                height={1000}
                sizes="(max-width: 1240px) 100vw, 1180px"
                priority
              />
              <span>Interface capture · {project.title}</span>
            </div>
          )}

          {stats && <ProjectMetrics stats={stats} />}

          <div className="case-study-body-grid">
            <aside className="case-study-aside">
              <p className="eyebrow">Build notes</p>
              <div className="case-study-tech">
                {project.tech.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="quiet-link">
                Browse repository ↗
              </a>
            </aside>
            <article className="case-study-content">
              <MdxContent source={project.content} />
            </article>
          </div>

          {project.images && project.images.length > 0 && (
            <section className="case-study-gallery" aria-label={`${project.title} gallery`}>
              {project.images.map((src, index) => (
                <figure key={src}>
                  <Image
                    src={src}
                    alt={`${project.title} screenshot ${index + 1}`}
                    width={1600}
                    height={1000}
                    sizes="(max-width: 800px) 100vw, 50vw"
                  />
                  <figcaption>System capture 0{index + 1}</figcaption>
                </figure>
              ))}
            </section>
          )}

          <section className="case-study-next">
            <p className="eyebrow">Next signal</p>
            <h2>There&apos;s more in the workshop.</h2>
            <Link href="/workshop" className="button button-secondary">Explore every project →</Link>
          </section>
        </div>
      </main>
    </PageTransition>
  )
}
