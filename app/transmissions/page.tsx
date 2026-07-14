import type { Metadata } from 'next'
import { PageTransition } from '@/components/page-transition'
import { SectionHeading } from '@/components/section-heading'
import { TransmissionCard } from '@/components/transmission-card'
import { YouTubeEmbed } from '@/components/youtube-embed'
import { getTransmissions } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Speaking & Media',
  description:
    'Conference talks, podcast appearances, and 226 live-coding episodes from Jesse Weigel.',
  alternates: { canonical: '/transmissions' },
}

export default async function TransmissionsPage() {
  const all = await getTransmissions()
  const talks = all.filter((item) => item.type === 'talk')
  const podcasts = all.filter((item) => item.type === 'podcast')
  const youtube = all.filter((item) => item.type === 'youtube')
  const featuredTalks = talks.filter((item) => item.links.watch)

  return (
    <PageTransition>
      <main className="transmissions-page">
        <div className="site-container">
          <header className="transmissions-hero">
            <p className="eyebrow">Speaking · Teaching · Building in public</p>
            <h1>I learned out loud. Then I took the lessons on the road.</h1>
            <div className="transmissions-intro">
              <p>
                Hundreds of unscripted live-coding sessions became conference talks, podcasts,
                and a global mentoring community. The subject was code; the real work was making
                difficult ideas feel possible.
              </p>
              <a href="mailto:jesse@jesseweigel.com?subject=Speaking%20invitation" className="button button-primary">
                Invite me to speak
              </a>
            </div>
          </header>

          <div className="media-proof" aria-label="Speaking and media highlights">
            <div><strong>226</strong><span>live-coding episodes</span></div>
            <div><strong>{talks.length}+</strong><span>conference talks</span></div>
            <div><strong>{podcasts.length}</strong><span>podcast appearances</span></div>
            <div><strong>70K</strong><span>views on top episode</span></div>
          </div>

          <section className="media-section" aria-labelledby="talks-heading">
            <SectionHeading
              id="talks-heading"
              eyebrow="On stage"
              title="Talks that started with real work."
              description="Career-changing live coding, cross-platform React architecture, developer mentorship, and the mechanics behind the systems."
            />
            <div className="talk-feature-grid">
              {featuredTalks.map((talk) => (
                <div key={talk.slug} className="talk-feature">
                  {talk.links.watch && <YouTubeEmbed url={talk.links.watch} title={talk.title} />}
                  <TransmissionCard transmission={talk} />
                </div>
              ))}
            </div>
            <div className="transmission-list">
              {talks.filter((talk) => !talk.links.watch).map((talk) => (
                <TransmissionCard key={talk.slug} transmission={talk} />
              ))}
            </div>
          </section>

          <section className="media-section" aria-labelledby="podcasts-heading">
            <SectionHeading
              id="podcasts-heading"
              eyebrow="In conversation"
              title="The story behind the systems."
              description="Conversations about the self-taught path, community, technical leadership, learning in public, and staying human while doing it."
            />
            <div className="transmission-list">
              {podcasts.map((podcast) => (
                <TransmissionCard key={podcast.slug} transmission={podcast} />
              ))}
            </div>
          </section>

          <section className="media-section" aria-labelledby="video-heading">
            <SectionHeading
              id="video-heading"
              eyebrow="The archive"
              title="226 episodes. No hiding behind the edit."
              description="A working record of learning React, React Native, open source, brain-computer interfaces, and community building in public."
            />
            <div className="video-grid">
              {youtube.map((video) => {
                const playable = video.links.watch?.includes('watch?v=') || video.links.watch?.includes('youtu.be/')
                return (
                  <div key={video.slug} className="video-card">
                    {playable && video.links.watch && <YouTubeEmbed url={video.links.watch} title={video.title} />}
                    <TransmissionCard transmission={video} />
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </main>
    </PageTransition>
  )
}
