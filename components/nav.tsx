import Link from 'next/link'

const links = [
  { href: '/workshop', label: 'Workshop' },
  { href: '/transmissions', label: 'Transmissions' },
  { href: '/archive', label: 'Archive' },
  { href: '/log', label: 'Log' },
]

export function Nav() {
  return (
    <nav className="fixed top-0 z-40 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-sm tracking-wider text-primary transition-opacity hover:opacity-80"
        >
          JW
        </Link>
        <div className="flex gap-4 sm:gap-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
