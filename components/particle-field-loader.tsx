'use client'

import dynamic from 'next/dynamic'
import { LandingFallback } from '@/components/landing-fallback'

export const ParticleFieldLoader = dynamic(
  () => import('@/components/particle-field').then((m) => m.ParticleField),
  { ssr: false, loading: () => <LandingFallback /> }
)
