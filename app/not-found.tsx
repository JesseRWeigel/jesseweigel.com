import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
      <h1 className="font-mono text-6xl font-light text-primary">404</h1>
      <p className="text-muted-foreground">Signal lost. Nothing at this coordinate.</p>
      <Link
        href="/"
        className="mt-4 text-sm text-primary underline underline-offset-4 transition-opacity hover:opacity-80"
      >
        Return to The Observatory
      </Link>
    </main>
  )
}
