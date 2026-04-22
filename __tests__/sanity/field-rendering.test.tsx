// @vitest-environment jsdom
/**
 * Sanity field-rendering tests — every CMS field must actually appear in the DOM.
 * These tests verify the component reads and renders the value from its prop,
 * not just that it doesn't crash. One test per Sanity schema field.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

// ── Global mocks ──────────────────────────────────────────────────────────────

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

vi.mock('next/image', () => ({
  default: ({ src, alt, fill: _fill, sizes: _s, priority: _p, ...rest }: Record<string, unknown>) =>
    React.createElement('img', { src: src as string, alt: alt as string, ...rest }),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children?: React.ReactNode; [k: string]: unknown }) =>
    React.createElement('a', { href, ...rest }, children),
}))

vi.mock('@/lib/sanity/image', () => ({
  urlFor: () => ({
    width: () => ({ url: () => 'https://cdn.sanity.io/mock-image.jpg' }),
    url: () => 'https://cdn.sanity.io/mock-image.jpg',
  }),
}))

beforeAll(() => {
  Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true })
})

// ── Imports ───────────────────────────────────────────────────────────────────
import HeroSection from '@/components/home/HeroSection'
import StatsBar from '@/components/home/StatsBar'
import AboutSection from '@/components/home/AboutSection'
import TeachingPhilosophy from '@/components/home/TeachingPhilosophy'
import YouTubeSection from '@/components/home/YouTubeSection'
import VideoGrid from '@/components/home/VideoGrid'
import AboutSeries from '@/components/home/AboutSeries'
import WhyUs from '@/components/home/WhyUs'
import Testimonials from '@/components/home/Testimonials'
import FAQSection from '@/components/home/FAQSection'
import YouTubeSubscribeBanner from '@/components/home/YouTubeSubscribeBanner'

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION  (schema group: hero)
// ─────────────────────────────────────────────────────────────────────────────
describe('HeroSection — Sanity field rendering', () => {
  it('renders badgeText from CMS', () => {
    render(<HeroSection data={{ badgeText: 'UNIQUE BADGE XYZ' }} />)
    expect(screen.getByText('UNIQUE BADGE XYZ')).toBeInTheDocument()
  })

  it('renders headline from CMS', () => {
    render(<HeroSection data={{ headline: 'Unique Headline ABC' }} />)
    expect(screen.getByText(/Unique Headline ABC/i)).toBeInTheDocument()
  })

  it('renders subtext from CMS', () => {
    render(<HeroSection data={{ subtext: 'CMS subtext paragraph here.' }} />)
    expect(screen.getByText(/CMS subtext paragraph here\./i)).toBeInTheDocument()
  })

  it('renders each bulletPoint from CMS', () => {
    render(<HeroSection data={{ bulletPoints: ['Bullet Alpha', 'Bullet Beta', 'Bullet Gamma'] }} />)
    expect(screen.getByText('Bullet Alpha')).toBeInTheDocument()
    expect(screen.getByText('Bullet Beta')).toBeInTheDocument()
    expect(screen.getByText('Bullet Gamma')).toBeInTheDocument()
  })

  it('renders primaryButton text from CMS', () => {
    render(<HeroSection data={{ primaryButton: { text: 'CMS Primary Btn', url: 'https://example.com' } }} />)
    expect(screen.getByText('CMS Primary Btn')).toBeInTheDocument()
  })

  it('renders primaryButton url as href from CMS', () => {
    const { container } = render(<HeroSection data={{ primaryButton: { text: 'Go', url: 'https://cms-link.test' } }} />)
    const link = container.querySelector('a[href="https://cms-link.test"]')
    expect(link).not.toBeNull()
  })

  it('renders secondaryButton text from CMS', () => {
    render(<HeroSection data={{ secondaryButton: { text: 'CMS Secondary Btn', url: '/contact' } }} />)
    expect(screen.getByText('CMS Secondary Btn')).toBeInTheDocument()
  })

  it('renders secondaryButton url as href from CMS', () => {
    const { container } = render(<HeroSection data={{ secondaryButton: { text: 'X', url: '/cms-secondary-path' } }} />)
    const link = container.querySelector('a[href="/cms-secondary-path"]')
    expect(link).not.toBeNull()
  })

  it('uses youtubeVideoId from CMS in iframe src', () => {
    const { container } = render(<HeroSection data={{ youtubeVideoId: 'CMSID12345A' }} />)
    const iframe = container.querySelector('iframe')
    expect(iframe?.src).toContain('CMSID12345A')
  })

  it('renders youtubeNote from CMS', () => {
    render(<HeroSection data={{ youtubeNote: 'CMS note below video' }} />)
    expect(screen.getByText(/CMS note below video/i)).toBeInTheDocument()
  })

  it('uses Sanity CDN URL for profileImage when asset._ref is present', () => {
    const { container } = render(
      <HeroSection data={{ profileImage: { asset: { _ref: 'image-abc-640x640-jpg' } } }} />
    )
    const img = container.querySelector('img')
    expect(img?.src).toContain('cdn.sanity.io')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// STATS BAR  (schema group: stats)
// ─────────────────────────────────────────────────────────────────────────────
describe('StatsBar — Sanity field rendering', () => {
  const stats = [
    { _key: 's1', value: '9,999+', label: 'CMS Students' },
    { _key: 's2', value: '15 yrs', label: 'CMS Experience' },
    { _key: 's3', value: '98%',    label: 'CMS Pass Rate' },
  ]

  it('renders stat value from CMS', () => {
    render(<StatsBar data={stats} />)
    expect(screen.getByText('9,999+')).toBeInTheDocument()
    expect(screen.getByText('15 yrs')).toBeInTheDocument()
    expect(screen.getByText('98%')).toBeInTheDocument()
  })

  it('renders stat label from CMS', () => {
    render(<StatsBar data={stats} />)
    expect(screen.getByText('CMS Students')).toBeInTheDocument()
    expect(screen.getByText('CMS Experience')).toBeInTheDocument()
    expect(screen.getByText('CMS Pass Rate')).toBeInTheDocument()
  })

  it('renders all stat items when multiple are provided', () => {
    render(<StatsBar data={stats} />)
    // All 3 value+label pairs appear
    expect(screen.getAllByText(/CMS/).length).toBe(3)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT SECTION  (schema group: about)
// ─────────────────────────────────────────────────────────────────────────────
describe('AboutSection — Sanity field rendering', () => {
  it('renders name from CMS', () => {
    render(<AboutSection data={{ name: 'CMS Educator Name' }} />)
    expect(screen.getAllByText(/CMS Educator Name/i).length).toBeGreaterThan(0)
  })

  it('renders title from CMS', () => {
    render(<AboutSection data={{ title: 'CMS Title & Designation' }} />)
    expect(screen.getByText('CMS Title & Designation')).toBeInTheDocument()
  })

  it('renders ratingBadge from CMS (first word only — component uses split(" ")[0])', () => {
    // Component renders only the first word of ratingBadge via .split(" ")[0]
    render(<AboutSection data={{ ratingBadge: 'CMS-RATING rest ignored' }} />)
    expect(screen.getByText('CMS-RATING')).toBeInTheDocument()
  })

  it('renders credentialBadge from CMS', () => {
    render(<AboutSection data={{ credentialBadge: 'CMS Credential Badge' }} />)
    expect(screen.getByText('CMS Credential Badge')).toBeInTheDocument()
  })

  it('renders bio1 from CMS', () => {
    render(<AboutSection data={{ bio1: 'CMS bio paragraph one.' }} />)
    expect(screen.getByText(/CMS bio paragraph one\./i)).toBeInTheDocument()
  })

  it('renders bio2 from CMS', () => {
    render(<AboutSection data={{ bio2: 'CMS bio paragraph two.' }} />)
    expect(screen.getByText(/CMS bio paragraph two\./i)).toBeInTheDocument()
  })

  it('renders bio3 from CMS', () => {
    render(<AboutSection data={{ bio3: 'CMS bio paragraph three.' }} />)
    expect(screen.getByText(/CMS bio paragraph three\./i)).toBeInTheDocument()
  })

  it('renders pullQuote from CMS', () => {
    render(<AboutSection data={{ pullQuote: 'CMS pull quote text here.' }} />)
    expect(screen.getByText(/CMS pull quote text here\./i)).toBeInTheDocument()
  })

  it('renders credentials as {_key, text} objects from CMS', () => {
    render(<AboutSection data={{ credentials: [{ _key: 'c1', text: 'CMS Credential One' }, { _key: 'c2', text: 'CMS Credential Two' }] }} />)
    expect(screen.getByText('CMS Credential One')).toBeInTheDocument()
    expect(screen.getByText('CMS Credential Two')).toBeInTheDocument()
  })

  it('renders badges as {_key, text} objects from CMS', () => {
    render(<AboutSection data={{ badges: [{ _key: 'b1', text: 'CMS Badge Alpha' }, { _key: 'b2', text: 'CMS Badge Beta' }] }} />)
    expect(screen.getByText('CMS Badge Alpha')).toBeInTheDocument()
    expect(screen.getByText('CMS Badge Beta')).toBeInTheDocument()
  })

  it('uses Sanity CDN URL for profileImage from CMS', () => {
    const { container } = render(
      <AboutSection data={{ profileImage: { asset: { _ref: 'image-xyz-800x800-jpg' } } }} />
    )
    const img = container.querySelector('img')
    expect(img?.src).toContain('cdn.sanity.io')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// TEACHING PHILOSOPHY  (schema group: philosophy)
// ─────────────────────────────────────────────────────────────────────────────
describe('TeachingPhilosophy — Sanity field rendering', () => {
  it('renders sectionLabel from CMS', () => {
    render(<TeachingPhilosophy data={{ sectionLabel: 'CMS SECTION LABEL' }} />)
    expect(screen.getByText('CMS SECTION LABEL')).toBeInTheDocument()
  })

  it('renders heading from CMS', () => {
    render(<TeachingPhilosophy data={{ heading: 'CMS Philosophy Heading' }} />)
    expect(screen.getByText('CMS Philosophy Heading')).toBeInTheDocument()
  })

  it('renders card title from CMS', () => {
    render(<TeachingPhilosophy data={{ cards: [{ title: 'CMS Card Title', description: 'desc', icon: 'Lightbulb' }] }} />)
    expect(screen.getByText('CMS Card Title')).toBeInTheDocument()
  })

  it('renders card description from CMS', () => {
    render(<TeachingPhilosophy data={{ cards: [{ title: 'T', description: 'CMS Card Description Text', icon: 'Target' }] }} />)
    expect(screen.getByText('CMS Card Description Text')).toBeInTheDocument()
  })

  it('renders all cards when multiple are provided', () => {
    render(<TeachingPhilosophy data={{ cards: [
      { title: 'CMS Card One', description: 'd1', icon: 'Lightbulb' },
      { title: 'CMS Card Two', description: 'd2', icon: 'Users' },
      { title: 'CMS Card Three', description: 'd3', icon: 'BookOpen' },
    ]}} />)
    expect(screen.getByText('CMS Card One')).toBeInTheDocument()
    expect(screen.getByText('CMS Card Two')).toBeInTheDocument()
    expect(screen.getByText('CMS Card Three')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// YOUTUBE SECTION  (schema group: youtube)
// ─────────────────────────────────────────────────────────────────────────────
describe('YouTubeSection — Sanity field rendering', () => {
  it('renders sectionLabel from CMS', () => {
    render(<YouTubeSection data={{ sectionLabel: 'CMS YOUTUBE LABEL' }} />)
    expect(screen.getByText('CMS YOUTUBE LABEL')).toBeInTheDocument()
  })

  it('renders heading from CMS', () => {
    render(<YouTubeSection data={{ heading: 'CMS YouTube Heading' }} />)
    expect(screen.getByText('CMS YouTube Heading')).toBeInTheDocument()
  })

  it('renders subtext from CMS', () => {
    render(<YouTubeSection data={{ subtext: 'CMS YouTube subtext here.' }} />)
    expect(screen.getByText(/CMS YouTube subtext here\./i)).toBeInTheDocument()
  })

  it('uses featuredVideoId from CMS in iframe src', () => {
    const { container } = render(<YouTubeSection data={{ featuredVideoId: 'CMSYT99xyzAB' }} />)
    const iframe = container.querySelector('iframe')
    expect(iframe?.src).toContain('CMSYT99xyzAB')
  })

  it('renders channelUrl from CMS as link href', () => {
    const { container } = render(<YouTubeSection data={{ channelUrl: 'https://cms-channel.test' }} />)
    const link = container.querySelector('a[href="https://cms-channel.test"]')
    expect(link).not.toBeNull()
  })

  it('renders playlistNote from CMS', () => {
    render(<YouTubeSection data={{ playlistNote: 'CMS playlist note text' }} />)
    expect(screen.getByText(/CMS playlist note text/i)).toBeInTheDocument()
  })

  it('renders ctaButton text from CMS', () => {
    render(<YouTubeSection data={{ ctaButton: { text: 'CMS CTA Button', url: 'https://x.test' } }} />)
    expect(screen.getByText('CMS CTA Button')).toBeInTheDocument()
  })

  it('renders ctaButton url as href from CMS', () => {
    const { container } = render(<YouTubeSection data={{ ctaButton: { text: 'CTA', url: 'https://cms-cta.test' } }} />)
    const link = container.querySelector('a[href="https://cms-cta.test"]')
    expect(link).not.toBeNull()
  })

  it('renders topic title from CMS', () => {
    render(<YouTubeSection data={{ topics: [{ _key: 't1', title: 'CMS Topic Title', description: 'desc' }] }} />)
    expect(screen.getByText('CMS Topic Title')).toBeInTheDocument()
  })

  it('renders topic description from CMS', () => {
    render(<YouTubeSection data={{ topics: [{ _key: 't1', title: 'T', description: 'CMS Topic Description' }] }} />)
    expect(screen.getByText('CMS Topic Description')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO GRID  (schema group: videos)
// ─────────────────────────────────────────────────────────────────────────────
describe('VideoGrid — Sanity field rendering', () => {
  it('renders heading from CMS', () => {
    render(<VideoGrid data={{ heading: 'CMS Video Grid Heading' }} />)
    expect(screen.getByText('CMS Video Grid Heading')).toBeInTheDocument()
  })

  it('renders video title from CMS', () => {
    render(<VideoGrid data={{ videos: [{ _key: 'v1', videoId: 'abc123', title: 'CMS Video Title', duration: '10 min' }] }} />)
    expect(screen.getByText('CMS Video Title')).toBeInTheDocument()
  })

  it('renders video duration from CMS', () => {
    render(<VideoGrid data={{ videos: [{ _key: 'v1', videoId: 'abc123', title: 'T', duration: '99 min CMS' }] }} />)
    expect(screen.getByText('99 min CMS')).toBeInTheDocument()
  })

  it('uses videoId from CMS in thumbnail image src', () => {
    const { container } = render(
      <VideoGrid data={{ videos: [{ _key: 'v1', videoId: 'CMS_VID_ID1', title: 'T', duration: '1 min' }] }} />
    )
    const img = container.querySelector('img')
    expect(img?.src).toContain('CMS_VID_ID1')
  })

  it('renders all videos when multiple are provided', () => {
    render(<VideoGrid data={{ videos: [
      { _key: 'v1', videoId: 'id1', title: 'CMS Video One', duration: '5 min' },
      { _key: 'v2', videoId: 'id2', title: 'CMS Video Two', duration: '8 min' },
    ]}} />)
    expect(screen.getByText('CMS Video One')).toBeInTheDocument()
    expect(screen.getByText('CMS Video Two')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT SERIES  (schema group: series)
// ─────────────────────────────────────────────────────────────────────────────
describe('AboutSeries — Sanity field rendering', () => {
  it('renders heading from CMS', () => {
    render(<AboutSeries data={{ heading: 'CMS Series Heading' }} />)
    expect(screen.getByText('CMS Series Heading')).toBeInTheDocument()
  })

  it('renders subtext from CMS', () => {
    render(<AboutSeries data={{ subtext: 'CMS series subtext.' }} />)
    expect(screen.getByText(/CMS series subtext\./i)).toBeInTheDocument()
  })

  it('renders each topic chip from CMS', () => {
    render(<AboutSeries data={{ topics: ['CMS Topic X', 'CMS Topic Y', 'CMS Topic Z'] }} />)
    expect(screen.getByText('CMS Topic X')).toBeInTheDocument()
    expect(screen.getByText('CMS Topic Y')).toBeInTheDocument()
    expect(screen.getByText('CMS Topic Z')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// WHO IS IT FOR / WHY US  (schema group: whoFor)
// ─────────────────────────────────────────────────────────────────────────────
describe('WhyUs (WhoIsItFor) — Sanity field rendering', () => {
  it('renders sectionLabel from CMS', () => {
    render(<WhyUs data={{ sectionLabel: 'CMS WHO LABEL' }} />)
    expect(screen.getByText('CMS WHO LABEL')).toBeInTheDocument()
  })

  it('renders heading from CMS', () => {
    render(<WhyUs data={{ heading: 'CMS Who Heading' }} />)
    expect(screen.getByText('CMS Who Heading')).toBeInTheDocument()
  })

  it('renders card title from CMS', () => {
    render(<WhyUs data={{ cards: [{ _key: 'c1', title: 'CMS Audience Title', description: 'desc' }] }} />)
    expect(screen.getByText('CMS Audience Title')).toBeInTheDocument()
  })

  it('renders card description from CMS', () => {
    render(<WhyUs data={{ cards: [{ _key: 'c1', title: 'T', description: 'CMS Audience Description' }] }} />)
    expect(screen.getByText('CMS Audience Description')).toBeInTheDocument()
  })

  it('renders all audience cards from CMS', () => {
    render(<WhyUs data={{ cards: [
      { _key: 'c1', title: 'CMS Card A', description: 'd' },
      { _key: 'c2', title: 'CMS Card B', description: 'd' },
      { _key: 'c3', title: 'CMS Card C', description: 'd' },
    ]}} />)
    expect(screen.getByText('CMS Card A')).toBeInTheDocument()
    expect(screen.getByText('CMS Card B')).toBeInTheDocument()
    expect(screen.getByText('CMS Card C')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS  (schema group: testimonials)
// ─────────────────────────────────────────────────────────────────────────────
describe('Testimonials — Sanity field rendering', () => {
  const item = {
    _key: 't1',
    name: 'CMS Student Name',
    college: 'CMS College, City',
    initials: 'CS',
    color: 'bg-blue-600',
    quote: 'CMS testimonial quote text here.',
  }

  it('renders sectionLabel from CMS', () => {
    render(<Testimonials data={{ sectionLabel: 'CMS TESTIMONIALS LABEL' }} />)
    expect(screen.getByText('CMS TESTIMONIALS LABEL')).toBeInTheDocument()
  })

  it('renders heading from CMS', () => {
    render(<Testimonials data={{ heading: 'CMS Testimonials Heading' }} />)
    expect(screen.getByText('CMS Testimonials Heading')).toBeInTheDocument()
  })

  it('renders subtext from CMS', () => {
    render(<Testimonials data={{ subtext: 'CMS testimonials subtext.' }} />)
    expect(screen.getByText(/CMS testimonials subtext\./i)).toBeInTheDocument()
  })

  it('renders overallRating from CMS', () => {
    render(<Testimonials data={{ overallRating: '5.0', items: [item] }} />)
    expect(screen.getByText('5.0')).toBeInTheDocument()
  })

  it('renders testimonial name from CMS', () => {
    render(<Testimonials data={{ items: [item] }} />)
    expect(screen.getByText('CMS Student Name')).toBeInTheDocument()
  })

  it('renders testimonial college from CMS', () => {
    render(<Testimonials data={{ items: [item] }} />)
    expect(screen.getByText('CMS College, City')).toBeInTheDocument()
  })

  it('renders testimonial initials from CMS', () => {
    render(<Testimonials data={{ items: [item] }} />)
    expect(screen.getByText('CS')).toBeInTheDocument()
  })

  it('renders testimonial quote from CMS', () => {
    render(<Testimonials data={{ items: [item] }} />)
    expect(screen.getByText(/CMS testimonial quote text here\./i)).toBeInTheDocument()
  })

  it('renders multiple testimonials from CMS', () => {
    render(<Testimonials data={{ items: [
      { ...item, _key: 't1', name: 'CMS Student One', initials: 'S1' },
      { ...item, _key: 't2', name: 'CMS Student Two', initials: 'S2' },
    ]}} />)
    expect(screen.getByText('CMS Student One')).toBeInTheDocument()
    expect(screen.getByText('CMS Student Two')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// FAQ SECTION  (schema group: faq)
// ─────────────────────────────────────────────────────────────────────────────
describe('FAQSection — Sanity field rendering', () => {
  it('renders sectionLabel from CMS', () => {
    render(<FAQSection data={{ sectionLabel: 'CMS FAQ LABEL' }} />)
    expect(screen.getByText('CMS FAQ LABEL')).toBeInTheDocument()
  })

  it('renders heading from CMS', () => {
    render(<FAQSection data={{ heading: 'CMS FAQ Heading' }} />)
    expect(screen.getByText('CMS FAQ Heading')).toBeInTheDocument()
  })

  it('renders subtext from CMS', () => {
    render(<FAQSection data={{ subtext: 'CMS FAQ subtext.' }} />)
    expect(screen.getByText(/CMS FAQ subtext\./i)).toBeInTheDocument()
  })

  it('renders emailLinkText from CMS', () => {
    render(<FAQSection data={{ emailLinkText: 'CMS email link text', email: 'test@test.com' }} />)
    expect(screen.getByText(/CMS email link text/i)).toBeInTheDocument()
  })

  it('renders email from CMS in the mailto href', () => {
    // Component puts email in href="mailto:..." — not as visible text
    const { container } = render(<FAQSection data={{ email: 'cms@nsacademy.test' }} />)
    const link = container.querySelector('a[href="mailto:cms@nsacademy.test"]')
    expect(link).not.toBeNull()
  })

  it('renders FAQ question from CMS', () => {
    render(<FAQSection data={{ items: [{ _key: 'f1', question: 'CMS FAQ Question?', answer: 'answer' }] }} />)
    expect(screen.getByText('CMS FAQ Question?')).toBeInTheDocument()
  })

  it('renders FAQ answer for the first (open) item from CMS', () => {
    render(<FAQSection data={{ items: [{ _key: 'f1', question: 'Q?', answer: 'CMS FAQ Answer here.' }] }} />)
    // First item starts open (useState(0))
    expect(screen.getByText('CMS FAQ Answer here.')).toBeInTheDocument()
  })

  it('shows FAQ answer after clicking the question', () => {
    render(<FAQSection data={{ items: [
      { _key: 'f1', question: 'First Question', answer: 'First Answer' },
      { _key: 'f2', question: 'CMS Second Question?', answer: 'CMS Second Answer.' },
    ]}} />)
    // Click the second question (initially closed)
    fireEvent.click(screen.getByText('CMS Second Question?'))
    expect(screen.getByText('CMS Second Answer.')).toBeInTheDocument()
  })

  it('renders multiple FAQ items from CMS', () => {
    render(<FAQSection data={{ items: [
      { _key: 'f1', question: 'CMS Q1?', answer: 'a1' },
      { _key: 'f2', question: 'CMS Q2?', answer: 'a2' },
      { _key: 'f3', question: 'CMS Q3?', answer: 'a3' },
    ]}} />)
    expect(screen.getByText('CMS Q1?')).toBeInTheDocument()
    expect(screen.getByText('CMS Q2?')).toBeInTheDocument()
    expect(screen.getByText('CMS Q3?')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// YOUTUBE SUBSCRIBE BANNER  (schema group: banner)
// ─────────────────────────────────────────────────────────────────────────────
describe('YouTubeSubscribeBanner — Sanity field rendering', () => {
  it('renders banner text from CMS', () => {
    render(<YouTubeSubscribeBanner data={{ text: 'CMS banner message text.' }} />)
    expect(screen.getByText('CMS banner message text.')).toBeInTheDocument()
  })

  it('renders button text from CMS', () => {
    render(<YouTubeSubscribeBanner data={{ button: { text: 'CMS Subscribe Btn', url: 'https://yt.test' } }} />)
    expect(screen.getByText('CMS Subscribe Btn')).toBeInTheDocument()
  })

  it('renders button url as href from CMS', () => {
    const { container } = render(
      <YouTubeSubscribeBanner data={{ button: { text: 'Sub', url: 'https://cms-yt-url.test' } }} />
    )
    const link = container.querySelector('a[href="https://cms-yt-url.test"]')
    expect(link).not.toBeNull()
  })
})
