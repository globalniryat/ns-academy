import type { SiteContent } from './types'

export const SITE_CONTENT_QUERY = `*[_type == "siteContent"][0]{
  hero,
  stats,
  about,
  teachingPhilosophy,
  youtubeSection,
  videoGrid,
  aboutSeries,
  whoIsItFor,
  testimonials,
  faq,
  contact,
  footer,
  youtubeSubscribeBanner
}`

export type { SiteContent }
