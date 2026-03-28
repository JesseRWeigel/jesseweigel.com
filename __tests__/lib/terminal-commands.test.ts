import { describe, it, expect } from 'vitest'
import { executeCommand } from '@/lib/terminal-commands'

describe('executeCommand', () => {
  it('returns help text for "help"', () => {
    const result = executeCommand('help')
    expect(result).toContain('Available commands')
  })
  it('returns about text for "cat about"', () => {
    const result = executeCommand('cat about')
    expect(result).toContain('Jesse Weigel')
  })
  it('lists sections for "ls"', () => {
    const result = executeCommand('ls')
    expect(result).toContain('workshop')
    expect(result).toContain('transmissions')
    expect(result).toContain('log')
  })
  it('returns navigate instruction for "cd workshop"', () => {
    const result = executeCommand('cd workshop')
    expect(result).toContain('/workshop')
  })
  it('returns fun response for "hack"', () => {
    const result = executeCommand('hack')
    expect(result.length).toBeGreaterThan(0)
  })
  it('returns fun response for "sudo rm -rf /"', () => {
    const result = executeCommand('sudo rm -rf /')
    expect(result).toContain('nice try')
  })
  it('returns unknown command message for garbage', () => {
    const result = executeCommand('xyzabc123')
    expect(result).toContain('command not found')
  })

  it('whoami returns metsuke identity', () => {
    const result = executeCommand('whoami')
    expect(result).toContain('metsuke')
    expect(result).toContain('目付')
  })

  it('metsuke command prompts to read the manual', () => {
    const result = executeCommand('metsuke')
    expect(result).toContain("man metsuke")
  })

  it('cat metsuke returns description', () => {
    const result = executeCommand('cat metsuke')
    expect(result).toContain('Metsuke')
    expect(result).toContain('目付')
    expect(result).toContain('The observations are mine')
  })

  it('man metsuke returns the manual page', () => {
    const result = executeCommand('man metsuke')
    expect(result).toContain('METSUKE(1)')
    expect(result).toContain('AI scribe for The Observatory')
    expect(result).toContain('Edo-era')
    expect(result).toContain('SEE ALSO')
  })

  it('man for unknown page returns no manual entry message', () => {
    const result = executeCommand('man unknowncmd')
    expect(result).toContain('no manual entry for unknowncmd')
  })

  it('matrix outputs katakana-like characters and wake up message', () => {
    const result = executeCommand('matrix')
    expect(result).toContain('Wake up, Jesse')
  })

  it('cmatrix outputs the observatory message', () => {
    const result = executeCommand('cmatrix')
    expect(result).toContain('The Observatory is watching')
  })

  it('cowsay with text wraps text in ASCII cow', () => {
    const result = executeCommand('cowsay hello world')
    expect(result).toContain('hello world')
    expect(result).toContain('(oo)')
  })

  it('cowsay with no args uses default message', () => {
    const result = executeCommand('cowsay')
    expect(result).toContain('(oo)')
  })

  it('fortune returns a non-empty string', () => {
    const result = executeCommand('fortune')
    expect(result.length).toBeGreaterThan(0)
  })

  it('ping observatory returns fake ping output', () => {
    const result = executeCommand('ping observatory')
    expect(result).toContain('PING observatory.local')
    expect(result).toContain('64 bytes from localhost')
    expect(result).toContain('The Observatory is always listening')
  })

  it('ping unknown host returns error', () => {
    const result = executeCommand('ping notahost')
    expect(result).toContain('cannot resolve')
  })

  it('history returns amnesia message', () => {
    const result = executeCommand('history')
    expect(result).toContain('amnesia')
  })

  it('rm -rf returns permission denied', () => {
    const result = executeCommand('rm -rf /')
    expect(result).toContain('Permission denied')
  })

  it('exit returns EXIT sentinel', () => {
    const result = executeCommand('exit')
    expect(result).toBe('EXIT')
  })

  it('uptime returns uptime info', () => {
    const result = executeCommand('uptime')
    expect(result).toMatch(/up \d/)
    expect(result).toContain('load average')
  })

  it('cat /dev/null returns empty string', () => {
    const result = executeCommand('cat /dev/null')
    expect(result).toBe('')
  })

  it('cat .env returns no secrets message', () => {
    const result = executeCommand('cat .env')
    expect(result).toContain('No secrets here')
  })

  it('sudo make me a sandwich returns Okay', () => {
    const result = executeCommand('sudo make me a sandwich')
    expect(result).toBe('Okay.')
  })

  it('git blame returns Metsuke', () => {
    const result = executeCommand('git blame')
    expect(result).toContain('Metsuke')
  })

  it('neofetch returns observatory art and system info', () => {
    const result = executeCommand('neofetch')
    expect(result).toContain('THE OBSERVATORY')
    expect(result).toContain('ObservatoryOS')
    expect(result).toContain('Metsuke Terminal')
  })

  it('xkcd returns a non-empty joke', () => {
    const result = executeCommand('xkcd')
    expect(result.length).toBeGreaterThan(0)
  })

  it('jesse returns message about Jesse', () => {
    const result = executeCommand('jesse')
    expect(result).toContain('Minecraft')
  })
})
