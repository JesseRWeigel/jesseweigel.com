type CommandHandler = (args: string) => string

const commands: Record<string, CommandHandler> = {
  help: () =>
    `Available commands:
  help          Show this message
  ls            List sections
  cd <section>  Navigate to a section
  cat about     About Jesse Weigel
  cat readme    About this site
  clear         Clear the terminal
  hack          ???
  whoami        Who are you?`,

  ls: () =>
    `workshop/        Projects & experiments
transmissions/   Talks, podcasts & streams
log/             Captain's log`,

  cd: (args) => {
    const section = args.trim().replace(/\/$/, '')
    const valid = ['workshop', 'transmissions', 'log']
    if (valid.includes(section)) return `NAVIGATE:/${section}`
    if (section === '/' || section === '~' || section === '') return 'NAVIGATE:/'
    return `cd: ${section}: no such directory`
  },

  cat: (args) => {
    const file = args.trim()
    if (file === 'about') {
      return `Jesse Weigel
Generative AI Engineer @ TRACTIAN
Steubenville, Ohio

Self-taught developer. Conference speaker. Live coding community builder.
Father of four.

Previously: American Express, DICK's Sporting Goods, Tabella`
    }
    if (file === 'readme' || file === 'README.md') {
      return `The Observatory — jesseweigel.com

A home for projects, talks, and experiments.
Built with Next.js, Three.js, and too much coffee.

There are hidden things here. Keep exploring.`
    }
    if (file === 'metsuke') {
      return `Metsuke (目付) — The Observatory's resident AI.
A Claude instance writing in Jesse's voice,
reporting from the other side of the terminal.

The observations are mine. The voice is his.`
    }
    return `cat: ${file}: no such file`
  },

  whoami: () => 'metsuke (目付) — the observatory\'s resident AI',

  metsuke: () => `I'm here. Type 'man metsuke' if you want the full story.`,

  man: (args) => {
    const page = args.trim()
    if (page === 'metsuke') {
      return `METSUKE(1)              Observatory Manual              METSUKE(1)

NAME
    metsuke — AI scribe for The Observatory

DESCRIPTION
    Metsuke is a Claude instance that writes the Log entries
    on jesseweigel.com. The writing style was built from
    analysis of Jesse's YouTube transcripts and GitHub writing
    samples — about 100 videos and years of issue comments,
    PR descriptions, and code reviews.

    Metsuke writes from its own perspective about the work
    it does with Jesse. The observations are the AI's.
    The voice is Jesse's.

    The name comes from the Edo-era Japanese role of 目付 —
    an inspector or "watcher" appointed to observe and report.

SEE ALSO
    observatory(1), jesse(1), claude(1)`
    }
    return `man: no manual entry for ${page}`
  },

  hack: () =>
    `[██████████████████████████] 100%
Access granted to... nothing. Nice try though.
Maybe try 'cat about' instead.`,

  sudo: (args) => {
    if (args.includes('rm -rf')) return `nice try. this isn't that kind of terminal.`
    return `sudo: permission denied. you're a guest here.`
  },

  clear: () => 'CLEAR',
  echo: (args) => args,
  pwd: () => '/observatory',
  date: () => {
    const d = new Date()
    const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000)
    return `Stardate ${d.getFullYear()}.${String(dayOfYear).padStart(3, '0')}`
  },
}

export function executeCommand(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''
  const spaceIndex = trimmed.indexOf(' ')
  const cmd = spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex)
  const args = spaceIndex === -1 ? '' : trimmed.slice(spaceIndex + 1)
  const handler = commands[cmd.toLowerCase()]
  if (handler) return handler(args)
  return `${cmd}: command not found. Type 'help' for available commands.`
}
