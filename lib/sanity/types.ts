export interface SanityImage {
  asset: { _ref: string }
  hotspot?: { x: number; y: number }
  crop?: { top: number; bottom: number; left: number; right: number }
}

export interface SanityButton {
  text?: string
  url?: string
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export interface HeroData {
  badgeText?: string
  headline?: string
  subtext?: string
  bulletPoints?: string[]
  primaryButton?: SanityButton
  secondaryButton?: SanityButton
  profileImage?: SanityImage
  youtubeVideoId?: string
  youtubeNote?: string
}

// ── Stats ─────────────────────────────────────────────────────────────────────
export interface StatItem {
  _key?: string
  value?: string
  label?: string
}

// ── About ─────────────────────────────────────────────────────────────────────
export interface CredentialItem {
  _key?: string
  text?: string
}

export interface AboutData {
  name?: string
  title?: string
  profileImage?: SanityImage
  ratingBadge?: string
  credentialBadge?: string
  bio1?: string
  bio2?: string
  bio3?: string
  pullQuote?: string
  credentials?: CredentialItem[]
  badges?: CredentialItem[]
}

// ── Teaching Philosophy ───────────────────────────────────────────────────────
export interface PhilosophyCard {
  _key?: string
  icon?: string
  title?: string
  description?: string
}

export interface TeachingPhilosophyData {
  sectionLabel?: string
  heading?: string
  cards?: PhilosophyCard[]
}

// ── YouTube Section ───────────────────────────────────────────────────────────
export interface YouTubeTopicCard {
  _key?: string
  title?: string
  description?: string
}

export interface YouTubeSectionData {
  sectionLabel?: string
  heading?: string
  subtext?: string
  featuredVideoId?: string
  channelUrl?: string
  playlistNote?: string
  ctaButton?: SanityButton
  topics?: YouTubeTopicCard[]
}

// ── Video Grid ────────────────────────────────────────────────────────────────
export interface VideoItem {
  _key?: string
  videoId?: string
  title?: string
  duration?: string
}

export interface VideoGridData {
  heading?: string
  videos?: VideoItem[]
}

// ── About Series ──────────────────────────────────────────────────────────────
export interface AboutSeriesData {
  heading?: string
  subtext?: string
  topics?: string[]
}

// ── Who Is It For ─────────────────────────────────────────────────────────────
export interface WhoCard {
  _key?: string
  title?: string
  description?: string
}

export interface WhoIsItForData {
  sectionLabel?: string
  heading?: string
  cards?: WhoCard[]
}

// ── Testimonials ──────────────────────────────────────────────────────────────
export interface TestimonialItem {
  _key?: string
  name?: string
  college?: string
  initials?: string
  color?: string
  quote?: string
}

export interface TestimonialsData {
  sectionLabel?: string
  heading?: string
  subtext?: string
  overallRating?: string
  items?: TestimonialItem[]
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
export interface FAQItem {
  _key?: string
  question?: string
  answer?: string
}

export interface FAQData {
  sectionLabel?: string
  heading?: string
  subtext?: string
  emailLinkText?: string
  email?: string
  items?: FAQItem[]
}

// ── Contact ───────────────────────────────────────────────────────────────────
export interface ContactData {
  whatsappNumber?: string
  whatsappMessage?: string
  email?: string
  location?: string
}

// ── Footer ────────────────────────────────────────────────────────────────────
export interface FooterData {
  tagline?: string
  youtubeUrl?: string
  instagramUrl?: string
  linkedinUrl?: string
}

// ── YouTube Subscribe Banner ──────────────────────────────────────────────────
export interface YouTubeSubscribeBannerData {
  text?: string
  button?: SanityButton
}

// ── Full site content document ────────────────────────────────────────────────
export interface SiteContent {
  hero?: HeroData
  stats?: StatItem[]
  about?: AboutData
  teachingPhilosophy?: TeachingPhilosophyData
  youtubeSection?: YouTubeSectionData
  videoGrid?: VideoGridData
  aboutSeries?: AboutSeriesData
  whoIsItFor?: WhoIsItForData
  testimonials?: TestimonialsData
  faq?: FAQData
  contact?: ContactData
  footer?: FooterData
  youtubeSubscribeBanner?: YouTubeSubscribeBannerData
}
