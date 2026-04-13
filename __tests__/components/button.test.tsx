// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button component', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders children text', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument()
  })

  it('renders as a <button> element by default', () => {
    render(<Button>Submit</Button>)
    expect(screen.getByRole('button')).toBeInstanceOf(HTMLButtonElement)
  })

  // ── Variants ───────────────────────────────────────────────────────────────

  it('applies default variant classes', () => {
    render(<Button variant="default">Default</Button>)
    const btn = screen.getByRole('button')
    // Default variant should have blue background
    expect(btn.className).toMatch(/bg-blue/)
  })

  it('applies outline variant classes', () => {
    render(<Button variant="outline">Outline</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toMatch(/border/)
  })

  it('applies destructive variant classes', () => {
    render(<Button variant="destructive">Delete</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toMatch(/bg-red/)
  })

  // ── Sizes ─────────────────────────────────────────────────────────────────

  it('applies sm size classes', () => {
    render(<Button size="sm">Small</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toMatch(/h-8|text-xs/)
  })

  it('applies lg size classes', () => {
    render(<Button size="lg">Large</Button>)
    const btn = screen.getByRole('button')
    // lg size uses h-13 in this design system
    expect(btn.className).toMatch(/h-13/)
  })

  // ── Loading state ──────────────────────────────────────────────────────────

  it('is disabled while loading', () => {
    render(<Button loading>Pay Now</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loadingText while loading when provided', () => {
    render(<Button loading loadingText="Processing…">Pay Now</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Processing…')
  })

  it('shows a spinner SVG while loading', () => {
    const { container } = render(<Button loading>Submit</Button>)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    // ButtonSpinner uses inline style animation (not Tailwind animate-spin class)
    // because Tailwind v4 JIT may not generate the keyframe — see globals.css @keyframes spin
    const style = svg?.getAttribute('style') ?? ''
    expect(style).toMatch(/animation/)
  })

  it('is not disabled when loading is false', () => {
    render(<Button loading={false}>Active</Button>)
    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  // ── Interaction ────────────────────────────────────────────────────────────

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when loading', () => {
    const handleClick = vi.fn()
    render(<Button loading onClick={handleClick}>Loading</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  // ── Custom className ───────────────────────────────────────────────────────

  it('merges custom className with variant classes', () => {
    render(<Button className="custom-class">Styled</Button>)
    expect(screen.getByRole('button').className).toMatch(/custom-class/)
  })

  // ── Accessibility ──────────────────────────────────────────────────────────

  it('has accessible button role', () => {
    render(<Button>Accessible</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('passes type attribute through', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('forwards arbitrary HTML attributes', () => {
    render(<Button id="my-btn" data-testid="cta">CTA</Button>)
    expect(screen.getByTestId('cta')).toHaveAttribute('id', 'my-btn')
  })
})
