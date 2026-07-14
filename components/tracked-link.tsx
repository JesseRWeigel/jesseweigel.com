'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'
import type { ComponentProps, MouseEvent } from 'react'

type LinkProps = ComponentProps<typeof Link>

interface TrackedLinkProps extends LinkProps {
  eventName: string
  eventData?: Record<string, string | number | boolean>
}

export function TrackedLink({
  eventName,
  eventData,
  onClick,
  ...props
}: TrackedLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    track(eventName, eventData)
    onClick?.(event)
  }

  return <Link {...props} onClick={handleClick} />
}
