import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn (className merge utility)', () => {
  it('merges simple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('deduplicates conflicting Tailwind classes — last one wins', () => {
    // Tailwind-merge: p-4 overrides p-2
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('handles conditional classes via objects', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active')
  })

  it('handles conditional classes via arrays', () => {
    expect(cn(['base', 'extra'])).toBe('base extra')
  })

  it('ignores falsy values (undefined, null, false)', () => {
    expect(cn('btn', undefined, null, false, 'primary')).toBe('btn primary')
  })

  it('returns empty string when no classes provided', () => {
    expect(cn()).toBe('')
  })

  it('handles deeply nested arrays', () => {
    expect(cn(['a', ['b', 'c']])).toBe('a b c')
  })

  it('merges Tailwind text color correctly', () => {
    // text-red-500 should override text-blue-500
    expect(cn('text-blue-500', 'text-red-500')).toBe('text-red-500')
  })

  it('does not strip non-conflicting classes', () => {
    const result = cn('flex', 'items-center', 'gap-4')
    expect(result).toContain('flex')
    expect(result).toContain('items-center')
    expect(result).toContain('gap-4')
  })
})
