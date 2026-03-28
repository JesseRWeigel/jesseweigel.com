import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjectBySlug, getProjects } from '@/lib/content'
import { Badge } from '@/components/ui/badge'
import { MdxContent } from '@/components/mdx-content'

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: `${project.title} | Jesse Weigel`,
    description: project.description,
  }
}

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  experimental: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  archived: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <div className="mb-8">
        <Link
          href="/workshop"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Workshop
        </Link>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-light tracking-tight">{project.title}</h1>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${statusColors[project.status] ?? statusColors.archived}`}
            >
              {project.status}
            </span>
            <Badge variant="outline" className="text-xs capitalize">
              {project.category.replace(/-/g, ' ')}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>

        {project.tech.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tech.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-4">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub{project.stars > 0 ? ` ★${project.stars}` : ''}
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Live Demo →
            </a>
          )}
        </div>

        <hr className="border-white/5" />

        <MdxContent source={project.content} />
      </div>
    </main>
  )
}
