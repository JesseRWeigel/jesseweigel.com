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
})
