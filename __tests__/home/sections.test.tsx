// @vitest-environment jsdom
/**
 * CMS resilience tests — every home section must render without crashing
 * when Sanity data is absent, null, empty, or partially populated.
 * This ensures a broken CMS never takes down the website.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// ── Global mocks ─────────────────────────────────────────────────────────────

// framer-motion: stub out all motion.* elements and hooks
vi.mock('framer-motion', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const makeEl = (tag: string) => { const C = ({ children, ...rest }: any) => React.createElement(tag, rest, children); C.displayName = tag; return C }
  const proxy = new Proxy({} as Record<string, ReturnType<typeof makeEl>>, {
    get: (_t, tag: string) => makeEl(tag),
  })
  return {
    motion: proxy,
    useInView: () => true,
    AnimatePresence: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  }
})

// next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, fill: _fill, sizes: _s, priority: _p, ...rest }: Record<string, unknown>) =>
    React.createElement('img', { src: src as string, alt: alt as string, ...rest }),
}))

// next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children?: React.ReactNode; [k: string]: unknown }) =>
    React.createElement('a', { href, ...rest }, children),
}))

// Sanity image builder
vi.mock('@/lib/sanity/image', () => ({
  urlFor: () => ({
    width: () => ({ url: () => 'https://cdn.sanity.io/mock.jpg' }),
    url: () => 'https://cdn.sanity.io/mock.jpg',
  }),
}))

// Suppress known jsdom scroll warning from framer-motion
beforeAll(() => {
  Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })
})

// ── Import components after mocks ─────────────────────────────────────────────
import HeroSection from '@/components/home/HeroSection'
import StatsBar from '@/components/home/StatsBar'
import AboutSection from '@/components/home/AboutSection'
import TeachingPhilosophy from '@/components/home/TeachingPhilosophy'
import YouTubeSection from '@/components/home/YouTubeSection'
import VideoGrid from '@/components/home/VideoGrid'
import AboutSeries from '@/components/home/AboutSeries'
import Testimonials from '@/components/home/Testimonials'
import FAQSection from '@/components/home/FAQSection'
import YouTubeSubscribeBanner from '@/components/home/YouTubeSubscribeBanner'
import WhyUs from '@/components/home/WhyUs'

// ── Helpers ───────────────────────────────────────────────────────────────────

function noThrow(jsx: React.ReactElement) {
  expect(() => render(jsx)).not.toThrow()
}

// ── HeroSection ───────────────────────────────────────────────────────────────
describe('HeroSection', () => {
  it('renders with no data (undefined)', () => {
    noThrow(<HeroSection />)
  })

  it('renders with empty data object', () => {
    noThrow(<HeroSection data={{}} />)
  })

  it('shows default headline when no CMS data', () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders CMS headline when provided', () => {
    render(<HeroSection data={{ headline: 'Custom Headline Text' }} />)
    expect(screen.getByText(/Custom Headline Text/i)).toBeInTheDocument()
  })

  it('renders CMS bullet points when provided', () => {
    render(<HeroSection data={{ bulletPoints: ['Point One', 'Point Two'] }} />)
    expect(screen.getByText('Point One')).toBeInTheDocument()
    expect(screen.getByText('Point Two')).toBeInTheDocument()
  })

  it('shows YouTube embed with default video ID when no CMS data', () => {
    const { container } = render(<HeroSection />)
    const iframe = container.querySelector('iframe')
    expect(iframe).not.toBeNull()
    expect(iframe?.src).toContain('youtube-nocookie.com')
  })

  it('uses CMS video ID in the iframe when provided', () => {
    const { container } = render(<HeroSection data={{ youtubeVideoId: 'abc123xyz99' }} />)
    const iframe = container.querySelector('iframe')
    expect(iframe?.src).toContain('abc123xyz99')
  })

  it('contains YouTube CTA button with correct id', () => {
    const { container } = render(<HeroSection />)
    expect(container.querySelector('#hero-youtube')).not.toBeNull()
  })

  it('does not contain enroll or pricing text', () => {
    render(<HeroSection />)
    expect(screen.queryByText(/enroll now/i)).toBeNull()
    expect(screen.queryByText(/₹/)).toBeNull()
  })
})

// ── StatsBar ──────────────────────────────────────────────────────────────────
describe('StatsBar', () => {
  it('renders with no data', () => {
    noThrow(<StatsBar />)
  })

  it('renders with empty array', () => {
    noThrow(<StatsBar data={[]} />)
  })

  it('renders with partial stat items', () => {
    noThrow(<StatsBar data={[{ _key: 'x', value: '1,000+' }]} />)
  })

  it('renders CMS stat values when provided', () => {
    render(<StatsBar data={[{ _key: 'a', value: '5,000+', label: 'Students' }]} />)
    expect(screen.getByText('5,000+')).toBeInTheDocument()
    expect(screen.getByText('Students')).toBeInTheDocument()
  })

  it('falls back to defaults when data is empty', () => {
    const { container } = render(<StatsBar data={[]} />)
    expect(container.textContent).toBeTruthy()
  })
})

// ── AboutSection ──────────────────────────────────────────────────────────────
describe('AboutSection', () => {
  it('renders with no data', () => {
    noThrow(<AboutSection />)
  })

  it('renders with empty data', () => {
    noThrow(<AboutSection data={{}} />)
  })

  it('shows default name when no CMS data', () => {
    render(<AboutSection />)
    // Component renders the name in multiple places — verify at least one exists
    expect(screen.getAllByText(/Nikesh Shah/i).length).toBeGreaterThan(0)
  })

  it('renders CMS name when provided', () => {
    render(<AboutSection data={{ name: 'John Doe' }} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('handles credentials as {_key, text} objects (Sanity format)', () => {
    noThrow(
      <AboutSection
        data={{
          credentials: [
            { _key: 'c1', text: 'CA (ICAI)' },
            { _key: 'c2', text: '10+ Years' },
          ],
        }}
      />
    )
  })

  it('handles credentials as plain strings', () => {
    noThrow(<AboutSection data={{ credentials: ['CA (ICAI)', '10+ Years'] }} />)
  })

  it('handles badges as {_key, text} objects', () => {
    noThrow(
      <AboutSection
        data={{ badges: [{ _key: 'b1', text: 'Top-Rated' }] }}
      />
    )
  })

  it('renders profile image from Sanity when _ref is present', () => {
    const { container } = render(
      <AboutSection data={{ profileImage: { asset: { _ref: 'image-abc123-640x640-jpg' } } }} />
    )
    const img = container.querySelector('img')
    expect(img?.src).toContain('cdn.sanity.io')
  })

  it('falls back to local image when no Sanity profileImage', () => {
    const { container } = render(<AboutSection />)
    const img = container.querySelector('img')
    expect(img?.src).toBeTruthy()
  })
})

// ── TeachingPhilosophy ────────────────────────────────────────────────────────
describe('TeachingPhilosophy', () => {
  it('renders with no data', () => {
    noThrow(<TeachingPhilosophy />)
  })

  it('renders with empty cards array', () => {
    noThrow(<TeachingPhilosophy data={{ cards: [] }} />)
  })

  it('renders CMS heading when provided', () => {
    render(<TeachingPhilosophy data={{ heading: 'Our Method' }} />)
    expect(screen.getByText('Our Method')).toBeInTheDocument()
  })

  it('renders CMS cards when provided', () => {
    render(
      <TeachingPhilosophy
        data={{
          cards: [
            { title: 'Card One', description: 'Desc one', icon: 'Lightbulb' },
          ],
        }}
      />
    )
    expect(screen.getByText('Card One')).toBeInTheDocument()
    expect(screen.getByText('Desc one')).toBeInTheDocument()
  })
})

// ── YouTubeSection ────────────────────────────────────────────────────────────
describe('YouTubeSection', () => {
  it('renders with no data', () => {
    noThrow(<YouTubeSection />)
  })

  it('renders with empty topics array', () => {
    noThrow(<YouTubeSection data={{ topics: [] }} />)
  })

  it('renders CMS heading', () => {
    render(<YouTubeSection data={{ heading: 'Free SFM Series' }} />)
    expect(screen.getByText('Free SFM Series')).toBeInTheDocument()
  })

  it('embeds featured video from CMS', () => {
    const { container } = render(
      <YouTubeSection data={{ featuredVideoId: 'xyz99abc12' }} />
    )
    const iframe = container.querySelector('iframe')
    expect(iframe?.src).toContain('xyz99abc12')
  })

  it('has correct id for nav anchor', () => {
    const { container } = render(<YouTubeSection />)
    expect(container.querySelector('#youtube')).not.toBeNull()
  })

  it('renders topic cards from CMS', () => {
    render(
      <YouTubeSection
        data={{
          topics: [
            { _key: 't1', title: 'CAPM', description: 'Risk and return' },
          ],
        }}
      />
    )
    expect(screen.getByText('CAPM')).toBeInTheDocument()
  })
})

// ── VideoGrid ─────────────────────────────────────────────────────────────────
describe('VideoGrid', () => {
  it('renders with no data', () => {
    noThrow(<VideoGrid />)
  })

  it('renders with empty videos array', () => {
    noThrow(<VideoGrid data={{ videos: [] }} />)
  })

  it('renders CMS video titles', () => {
    render(
      <VideoGrid
        data={{
          videos: [
            { _key: 'v1', videoId: 'abc123', title: 'Portfolio Theory Intro', duration: '45 min' },
          ],
        }}
      />
    )
    expect(screen.getByText('Portfolio Theory Intro')).toBeInTheDocument()
    expect(screen.getByText('45 min')).toBeInTheDocument()
  })
})

// ── AboutSeries ───────────────────────────────────────────────────────────────
describe('AboutSeries', () => {
  it('renders with no data', () => {
    noThrow(<AboutSeries />)
  })

  it('renders with empty topics array', () => {
    noThrow(<AboutSeries data={{ topics: [] }} />)
  })

  it('renders CMS topic chips', () => {
    render(<AboutSeries data={{ topics: ['Portfolio Theory', 'CAPM', 'Derivatives'] }} />)
    expect(screen.getByText('Portfolio Theory')).toBeInTheDocument()
    expect(screen.getByText('CAPM')).toBeInTheDocument()
  })

  it('renders CMS heading', () => {
    render(<AboutSeries data={{ heading: 'What You Will Learn' }} />)
    expect(screen.getByText('What You Will Learn')).toBeInTheDocument()
  })
})

// ── Testimonials ──────────────────────────────────────────────────────────────
describe('Testimonials', () => {
  it('renders with no data', () => {
    noThrow(<Testimonials />)
  })

  it('renders with empty items array', () => {
    noThrow(<Testimonials data={{ items: [] }} />)
  })

  it('shows default reviews when no CMS data provided', () => {
    render(<Testimonials />)
    // At least one review card should exist
    expect(screen.getAllByText(/CA Final/i).length).toBeGreaterThan(0)
  })

  it('renders CMS testimonial names when provided', () => {
    render(
      <Testimonials
        data={{
          items: [
            {
              _key: 't1',
              name: 'Rohan Test',
              college: 'CA Final · Mumbai',
              initials: 'RT',
              color: 'bg-blue-600',
              quote: 'Excellent teaching approach.',
            },
          ],
        }}
      />
    )
    expect(screen.getByText('Rohan Test')).toBeInTheDocument()
    // Quote is wrapped in curly-quote HTML entities — use partial match
    expect(screen.getByText(/Excellent teaching approach/i)).toBeInTheDocument()
  })

  it('does not show any pricing or enrollment text', () => {
    render(<Testimonials />)
    expect(screen.queryByText(/₹/)).toBeNull()
    expect(screen.queryByText(/enroll now/i)).toBeNull()
  })
})

// ── FAQSection ────────────────────────────────────────────────────────────────
describe('FAQSection', () => {
  it('renders with no data', () => {
    noThrow(<FAQSection />)
  })

  it('renders with empty items array', () => {
    noThrow(<FAQSection data={{ items: [] }} />)
  })

  it('shows default FAQs when no CMS data', () => {
    render(<FAQSection />)
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0)
  })

  it('renders CMS FAQ questions when provided', () => {
    render(
      <FAQSection
        data={{
          items: [
            { _key: 'f1', question: 'Is this really free?', answer: 'Yes, 100% free on YouTube.' },
          ],
        }}
      />
    )
    expect(screen.getByText('Is this really free?')).toBeInTheDocument()
  })
})

// ── YouTubeSubscribeBanner ────────────────────────────────────────────────────
describe('YouTubeSubscribeBanner', () => {
  it('renders with no data', () => {
    noThrow(<YouTubeSubscribeBanner />)
  })

  it('renders with empty data', () => {
    noThrow(<YouTubeSubscribeBanner data={{}} />)
  })

  it('renders CMS text when provided', () => {
    render(<YouTubeSubscribeBanner data={{ text: 'New lectures weekly', button: { text: 'Subscribe' } }} />)
    expect(screen.getByText('New lectures weekly')).toBeInTheDocument()
    expect(screen.getByText('Subscribe')).toBeInTheDocument()
  })
})

// ── WhyUs ─────────────────────────────────────────────────────────────────────
describe('WhyUs', () => {
  it('renders without props', () => {
    noThrow(<WhyUs />)
  })

  it('does not contain pricing or enrollment CTAs', () => {
    render(<WhyUs />)
    expect(screen.queryByText(/enroll now/i)).toBeNull()
    expect(screen.queryByText(/₹/)).toBeNull()
  })
})
