import { GitHubStars } from '@/components/github-stars'
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/lib/types'

const projectMeta: Record<
  string,
  { number: string; eyebrow: string; highlights: string[]; accent: string }
> = {
  'minecraft-agent-swarm': {
    number: '02',
    eyebrow: 'Autonomous systems · flagship',
    highlights: ['5 specialized agents', 'Local models', 'Self-repairing skills'],
    accent: 'amber',
  },
  toryo: {
    number: '01',
    eyebrow: 'Agent infrastructure',
    highlights: ['8 tool adapters', 'Quality ratcheting', 'Trust-based delegation'],
    accent: 'cyan',
  },
  contextrot: {
    number: '03',
    eyebrow: 'Evaluation engineering',
    highlights: ['Deterministic grading', 'Committed transcripts', 'Explicit limitations'],
    accent: 'violet',
  },
  tenshu: {
    number: '03',
    eyebrow: 'Agent observability',
    highlights: ['Live activity feeds', 'Experiment tracking', 'Real-time monitoring'],
    accent: 'violet',
  },
}

export function FeaturedProjectCard({
  project,
  priority = false,
}: {
  project: Project
  priority?: boolean
}) {
  const meta = projectMeta[project.slug] ?? {
    number: '·',
    eyebrow: project.category,
    highlights: project.tech.slice(0, 3),
    accent: 'amber',
  }

  return (
    <article className={`featured-project featured-${meta.accent}`}>
      <div className="featured-project-copy">
        <div className="featured-project-meta">
          <span>{meta.number}</span>
          <p className="eyebrow">{meta.eyebrow}</p>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <ul className="project-highlight-list" aria-label={`${project.title} highlights`}>
          {meta.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <div className="featured-project-actions">
          <Link href={`/workshop/${project.slug}`} className="text-link">
            Read the case study <span aria-hidden="true">→</span>
          </Link>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="quiet-link">
            GitHub<GitHubStars count={project.stars} checkedAt={project.starsCheckedAt} />
          </a>
        </div>
      </div>

      <Link
        href={`/workshop/${project.slug}`}
        className="featured-project-visual"
        aria-label={`View the ${project.title} case study`}
      >
        {project.cover ? (
          <Image
            src={project.cover}
            alt={`${project.title} interface`}
            fill
            sizes="(max-width: 768px) 100vw, 52vw"
            priority={priority}
          />
        ) : (
          <ProjectSystemGraphic slug={project.slug} />
        )}
        <div className="visual-scanline" aria-hidden="true" />
      </Link>
    </article>
  )
}

function ProjectSystemGraphic({ slug }: { slug: string }) {
  if (slug === 'contextrot') {
    return (
      <div className="system-graphic" aria-hidden="true">
        <div className="system-label">REPEATED SUMMARIZATION</div>
        <div className="system-node">50 SEED FACTS</div>
        <span>↓</span>
        <div className="system-node active">20 CYCLES</div>
        <span>↓</span>
        <div className="system-node">GRADE THE TRANSCRIPTS</div>
        <div className="system-result">One seed · three local models · inspectable evidence</div>
      </div>
    )
  }

  if (slug === 'toryo') {
    return (
      <div className="system-graphic toryo-graphic" aria-hidden="true">
        <div className="system-label">SPEC-DRIVEN CYCLE</div>
        <div className="system-node">PLAN</div>
        <span>→</span>
        <div className="system-node">RESEARCH</div>
        <span>→</span>
        <div className="system-node active">EXECUTE</div>
        <span>→</span>
        <div className="system-node">REVIEW</div>
        <div className="system-result">Illustration · acceptance requires configured checks</div>
      </div>
    )
  }

  if (slug === 'tenshu') {
    return (
      <div className="system-graphic tenshu-graphic" aria-hidden="true">
        <div className="system-label">AGENT COMMAND CENTER</div>
        <div className="tenshu-status-row">
          <span>3 AGENTS ONLINE</span>
          <span>RUN 024</span>
        </div>
        <div className="tenshu-agent-grid">
          <div><strong>PLAN</strong><small>active</small></div>
          <div><strong>BUILD</strong><small>working</small></div>
          <div><strong>REVIEW</strong><small>queued</small></div>
        </div>
        <div className="tenshu-activity">
          <span style={{ width: '82%' }} />
          <span style={{ width: '64%' }} />
          <span style={{ width: '91%' }} />
        </div>
        <div className="system-result">live telemetry · quality trend +12%</div>
      </div>
    )
  }

  return (
    <div className="system-graphic research-graphic" aria-hidden="true">
      <div className="system-label">RESEARCH NETWORK</div>
      {['MATH', 'LAW', 'QUANT', 'ENGINEERING', 'CHEM', 'BIO', 'POLICY'].map((label, index) => (
        <div key={label} className={`research-node research-node-${index + 1}`}>
          {label}
        </div>
      ))}
      <div className="research-core">EVIDENCE<br />LOOP</div>
    </div>
  )
}
