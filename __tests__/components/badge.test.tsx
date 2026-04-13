// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge component', () => {
  it('renders children text', () => {
    render(<Badge>Foundation</Badge>)
    expect(screen.getByText('Foundation')).toBeInTheDocument()
  })

  it('renders as a div element', () => {
    const { container } = render(<Badge>Test</Badge>)
    expect(container.firstChild?.nodeName).toBe('DIV')
  })

  it('applies foundation variant classes', () => {
    const { container } = render(<Badge variant="foundation">Foundation</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toMatch(/text-blue/)
  })

  it('applies intermediate variant classes', () => {
    const { container } = render(<Badge variant="intermediate">Intermediate</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toMatch(/text-teal/)
  })

  it('applies final variant classes', () => {
    const { container } = render(<Badge variant="final">Final</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toMatch(/text-navy/)
  })

  it('applies success variant classes', () => {
    const { container } = render(<Badge variant="success">Completed</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toMatch(/text-green/)
  })

  it('applies free variant for free preview badge', () => {
    const { container } = render(<Badge variant="free">Free Preview</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toMatch(/bg-green-500/)
    expect(badge.className).toMatch(/text-white/)
  })

  it('defaults to default variant when no variant specified', () => {
    const { container } = render(<Badge>Default</Badge>)
    const badge = container.firstChild as HTMLElement
    expect(badge.className).toMatch(/text-blue/)
  })

  it('merges custom className', () => {
    const { container } = render(<Badge className="custom-badge">Custom</Badge>)
    expect((container.firstChild as HTMLElement).className).toMatch(/custom-badge/)
  })

  it('passes through arbitrary HTML attributes', () => {
    render(<Badge data-testid="level-badge">CA Final</Badge>)
    expect(screen.getByTestId('level-badge')).toBeInTheDocument()
  })

  it('renders all three CA levels with correct visual distinction', () => {
    const { rerender, container } = render(<Badge variant="foundation">Foundation</Badge>)
    const foundationClass = (container.firstChild as HTMLElement).className

    rerender(<Badge variant="intermediate">Intermediate</Badge>)
    const intermediateClass = (container.firstChild as HTMLElement).className

    rerender(<Badge variant="final">Final</Badge>)
    const finalClass = (container.firstChild as HTMLElement).className

    // All three must have distinct class strings
    expect(foundationClass).not.toBe(intermediateClass)
    expect(intermediateClass).not.toBe(finalClass)
    expect(foundationClass).not.toBe(finalClass)
  })
})
