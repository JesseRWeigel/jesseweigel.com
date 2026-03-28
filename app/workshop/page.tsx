import { getProjects } from '@/lib/content'
import { WorkshopClient } from './workshop-client'

export const metadata = {
  title: 'Workshop | Jesse Weigel',
  description: 'Projects, experiments, and things built in the open.',
}

export default async function WorkshopPage() {
  const projects = await getProjects()
  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <WorkshopClient projects={projects} />
    </main>
  )
}
