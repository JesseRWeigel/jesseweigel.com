import { getProjects } from '@/lib/content'
import { WorkshopClient } from './workshop-client'
import { PageTransition } from '@/components/page-transition'

export const metadata = {
  title: 'Workshop',
  description: 'Projects, experiments, and things built in the open.',
}

export default async function WorkshopPage() {
  const projects = await getProjects()
  return (
    <PageTransition>
      <main className="mx-auto max-w-5xl px-6 py-24">
        <WorkshopClient projects={projects} />
      </main>
    </PageTransition>
  )
}
