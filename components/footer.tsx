import Link from 'next/link'

const socials = [
  { href: 'https://github.com/JesseRWeigel', label: 'GitHub' },
  { href: 'https://x.com/JesseRWeigel', label: 'X' },
  { href: 'https://www.linkedin.com/in/jesseweigel/', label: 'LinkedIn' },
  { href: 'https://youtube.com/c/JesseWeigel29', label: 'YouTube' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="font-mono text-xs text-muted-foreground">
            Jesse Weigel &middot; The Observatory
          </p>
          <div className="flex gap-4">
            {socials.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <p className="mt-4 text-center font-mono text-[10px] text-muted-foreground">
          Press <kbd className="rounded border border-white/10 px-1">`</kbd> for terminal · <kbd className="rounded border border-white/10 px-1">z</kbd> for zen
        </p>
      </div>
    </footer>
  )
}
