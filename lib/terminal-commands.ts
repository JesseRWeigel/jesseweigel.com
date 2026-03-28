type CommandHandler = (args: string) => string

const PAGE_START_TIME = Date.now()

const FORTUNES = [
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. — Martin Fowler",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it. — Brian W. Kernighan",
  "The best code is no code at all.",
  "It works on my machine. — every developer, forever",
  "There are only two hard things in Computer Science: cache invalidation and naming things. — Phil Karlton",
  "A language that doesn't affect the way you think about programming is not worth knowing. — Alan Perlis",
  "The most disastrous thing that you can ever learn is your first programming language. — Alan Kay",
  "Software is like entropy: it is difficult to grasp, weighs nothing, and obeys the Second Law of Thermodynamics; i.e., it always increases. — Norman Augustine",
  "The function of good software is to make the complex appear to be simple. — Grady Booch",
  "First, solve the problem. Then, write the code. — John Johnson",
  "Code never lies, comments sometimes do. — Ron Jeffries",
]

const XKCD_JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "Why do Java developers wear glasses? Because they don't C#.",
  "A programmer's wife tells him: 'Go to the store and get a gallon of milk, and if they have eggs, get a dozen.' He comes back with 12 gallons of milk.",
  "There are 10 types of people in the world: those who understand binary, and those who don't.",
  "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25.",
  "What do you call a programmer from Finland? Nerdic.",
  "How do you comfort a JavaScript bug? You console it.",
  "Why was the developer unhappy at their job? They wanted arrays.",
  "99 little bugs in the code, 99 little bugs... Take one down, patch it around... 127 little bugs in the code.",
]

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
      return `The Observatory. jesseweigel.com

A home for projects, talks, and experiments.
Built with Next.js, Three.js, and too much coffee.

There are hidden things here. Keep exploring.`
    }
    if (file === 'metsuke') {
      return `Metsuke (目付). The Observatory's resident AI.
A Claude instance writing in Jesse's voice,
reporting from the other side of the terminal.

The observations are mine. The voice is his.`
    }
    if (file === '/dev/null' || file === 'dev/null') return ''
    if (file === '.env' || file === '.env.local') {
      return 'Nice try. No secrets here. Just particles.'
    }
    return `cat: ${file}: no such file`
  },

  whoami: () => 'metsuke (目付), the observatory\'s resident AI',

  metsuke: () => `I'm here. Type 'man metsuke' if you want the full story.`,

  man: (args) => {
    const page = args.trim()
    if (page === 'metsuke') {
      return `METSUKE(1)              Observatory Manual              METSUKE(1)

NAME
    metsuke - AI scribe for The Observatory

DESCRIPTION
    Metsuke is a Claude instance that writes the Log entries
    on jesseweigel.com. The writing style was built from
    analysis of Jesse's YouTube transcripts and GitHub writing
    samples, about 100 videos and years of issue comments,
    PR descriptions, and code reviews.

    Metsuke writes from its own perspective about the work
    it does with Jesse. The observations are the AI's.
    The voice is Jesse's.

    The name comes from the Edo-era Japanese role of 目付,
    an inspector or "watcher," appointed to observe and report.

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
    if (args.includes('rm -rf')) return `nice try. read-only terminal.`
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

  matrix: () =>
    `${Array.from({ length: 6 }, () =>
      Array.from({ length: 32 }, () =>
        String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96))
      ).join(' ')
    ).join('\n')}

Wake up, Jesse...
The Observatory has you.`,

  cmatrix: () =>
    `${Array.from({ length: 6 }, () =>
      Array.from({ length: 32 }, () =>
        String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96))
      ).join(' ')
    ).join('\n')}

The Observatory is watching...`,

  cowsay: (args) => {
    const text = args.trim() || 'Moo. Have you tried turning it off and on again?'
    const line = '-'.repeat(text.length + 2)
    return ` ${line}
< ${text} >
 ${line}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`
  },

  fortune: () => FORTUNES[Math.floor(Math.random() * FORTUNES.length)],

  ping: (args) => {
    if (args.trim() === 'observatory') {
      return `PING observatory.local (127.0.0.1): 56 data bytes
64 bytes from localhost: icmp_seq=0 ttl=64 time=0.042 ms
64 bytes from localhost: icmp_seq=1 ttl=64 time=0.039 ms
64 bytes from localhost: icmp_seq=2 ttl=64 time=0.041 ms
64 bytes from localhost: icmp_seq=3 ttl=64 time=0.038 ms

--- observatory.local ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max = 0.038/0.040/0.042 ms

The Observatory is always listening.`
    }
    return `ping: cannot resolve ${args.trim()}: Name or service not known`
  },

  history: () => 'Nice try. This terminal has amnesia.',

  rm: (args) => {
    if (args.includes('-rf') || args.includes('-r')) {
      return 'Permission denied. Also, why?'
    }
    return `rm: missing operand`
  },

  exit: () => 'EXIT',

  uptime: () => {
    const elapsed = Date.now() - PAGE_START_TIME
    const seconds = Math.floor(elapsed / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const displayMinutes = minutes % 60
    const displaySeconds = seconds % 60

    let timeStr = ''
    if (hours > 0) timeStr += `${hours}h `
    if (displayMinutes > 0) timeStr += `${displayMinutes}m `
    timeStr += `${displaySeconds}s`

    const quips = [
      'Still here? Impressive.',
      'You must really like this site.',
      'Have you tried the Konami code yet?',
      'Most visitors bounce in 8 seconds. You are not most visitors.',
    ]
    const quip = quips[Math.floor(Math.random() * quips.length)]

    return `up ${timeStr.trim()}, 1 user, load average: 0.42, 0.17, 0.08\n${quip}`
  },

  'cat /dev/null': () => '',

  'sudo make me a sandwich': () => 'Okay.',

  'git blame': () => 'Metsuke. It\'s always Metsuke.',

  git: (args) => {
    const sub = args.trim()
    if (sub === 'blame') return 'Metsuke. It\'s always Metsuke.'
    if (sub === 'log') return `commit d34db33f (HEAD -> main, origin/main)
Author: Metsuke <metsuke@observatory.local>
Date:   $(date)

    feat: observe everything

commit cafebabe
Author: Jesse Weigel <jesse@jesseweigel.com>
Date:   earlier

    init: the observatory awakens`
    if (sub === 'status') return 'On branch main\nYour branch is up to date with \'origin/main\'.\nnothing to commit, working tree clean'
    return `git: '${sub}' is not a git command here. This is a terminal, not a repo.`
  },

  neofetch: () =>
    `   ___  _                              _
  / _ \\| |__  ___  ___ _ ____   ____ _| |_ ___  _ __ _   _
 | | | | '_ \\/ __|/ _ \\ '__\\ \\ / / _\` | __/ _ \\| '__| | | |
 | |_| | |_) \\__ \\  __/ |   \\ V / (_| | || (_) | |  | |_| |
  \\___/|_.__/|___/\\___|_|    \\_/ \\__,_|\\__\\___/|_|   \\__, |
                                                       |___/
          THE OBSERVATORY

  OS: ObservatoryOS 2.0 (Nebula Edition)
  Host: jesseweigel.com
  Kernel: Next.js 16 (particle-enabled)
  Uptime: since the first commit
  Shell: Metsuke Terminal v1.0
  Resolution: whatever your viewport is
  Theme: Deep Space Amber
  Terminal: observatory-terminal
  CPU: Jesse's curiosity (∞ cores)
  GPU: RTX 5090 (overkill, no regrets)
  Memory: too many open tabs`,

  xkcd: () => XKCD_JOKES[Math.floor(Math.random() * XKCD_JOKES.length)],

  jesse: () =>
    "He's probably reviewing agent output right now. Or playing Minecraft with his kids.",
}

export function executeCommand(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''

  // Check full-string commands first (multi-word commands like "sudo make me a sandwich")
  const fullHandler = commands[trimmed.toLowerCase()]
  if (fullHandler) return fullHandler('')

  const spaceIndex = trimmed.indexOf(' ')
  const cmd = spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex)
  const args = spaceIndex === -1 ? '' : trimmed.slice(spaceIndex + 1)
  const handler = commands[cmd.toLowerCase()]
  if (handler) return handler(args)
  return `${cmd}: command not found. Type 'help' for available commands.`
}
