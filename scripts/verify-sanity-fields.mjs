/**
 * Sanity field verification script.
 * For each CMS field: patches the value → triggers revalidation → checks localhost → restores original.
 * Run: node scripts/verify-sanity-fields.mjs
 */

import { createClient } from '@sanity/client'

const PROJECT_ID = 'i9bqo0t1'
const DATASET = 'production'
const API_VERSION = '2024-01-01'
const TOKEN = 'skTaEbP35PTHdRlfTYB2KZQVgrbAZTo1lBoAtQ5bfBA23fZUJwUirb54SlgtHeHKIOUXbHbLXpTmev0dFum5XYE3hNxJ0wwfwrKHeFKY5OyJHqxQgC10mrHMUT0YUZ5BbRhXHxkzmmXnJS2ZlVPuMwf6D2corNd9vlydnBwWHasoQV19gt3U'
const REVALIDATE_SECRET = 'NsAcademy'
const BASE_URL = 'http://localhost:3000'
const DOC_ID = 'siteContent'

const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, token: TOKEN, useCdn: false })

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function revalidate() {
  const res = await fetch(`${BASE_URL}/api/revalidate?secret=${REVALIDATE_SECRET}`, { method: 'POST' })
  if (!res.ok) throw new Error(`Revalidate failed: ${res.status}`)
}

async function getPage(path = '/') {
  // First fetch triggers ISR rebuild (stale-while-revalidate); second gets the rebuilt page
  await fetch(`${BASE_URL}${path}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
  await sleep(800)
  const res = await fetch(`${BASE_URL}${path}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
  if (!res.ok) throw new Error(`Page fetch failed: ${res.status} ${path}`)
  return res.text()
}

async function patch(fields) {
  await client.patch(DOC_ID).set(fields).commit()
}

function check(html, testValue, fieldName) {
  if (html.includes(testValue)) {
    console.log(`  ✅ ${fieldName}`)
    return true
  } else {
    console.log(`  ❌ ${fieldName} — "${testValue}" not found in page`)
    return false
  }
}

// ── Fetch & backup entire document ────────────────────────────────────────────

console.log('\n📦 Fetching current Sanity document...')
const original = await client.fetch(`*[_type == "siteContent"][0]`)
if (!original?._id) { console.error('No siteContent document found'); process.exit(1) }
console.log(`   _id: ${original._id}`)

const results = []
let passed = 0
let failed = 0

async function run(label, patchFields, verifyFn, restoreFields) {
  try {
    await patch(patchFields)
    await revalidate()
    await sleep(2500) // wait for ISR rebuild
    const html = await getPage('/')
    const contactHtml = await getPage('/contact')
    const ok = await verifyFn(html, contactHtml)
    results.push({ label, ok })
    if (ok) passed++; else failed++
  } catch (err) {
    console.log(`  💥 ${label} — ERROR: ${err.message}`)
    results.push({ label, ok: false, error: err.message })
    failed++
  } finally {
    if (restoreFields) {
      try { await patch(restoreFields) } catch { }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔍 HERO SECTION')

await run('hero.badgeText',
  { 'hero.badgeText': 'VERIFY-BADGE-XYZ' },
  (html) => check(html, 'VERIFY-BADGE-XYZ', 'hero.badgeText'),
  { 'hero.badgeText': original.hero?.badgeText }
)

await run('hero.headline',
  { 'hero.headline': 'VERIFY-HEADLINE-XYZ' },
  (html) => check(html, 'VERIFY-HEADLINE-XYZ', 'hero.headline'),
  { 'hero.headline': original.hero?.headline }
)

await run('hero.subtext',
  { 'hero.subtext': 'VERIFY-SUBTEXT-XYZ' },
  (html) => check(html, 'VERIFY-SUBTEXT-XYZ', 'hero.subtext'),
  { 'hero.subtext': original.hero?.subtext }
)

await run('hero.bulletPoints',
  { 'hero.bulletPoints': ['VERIFY-BULLET-ONE', 'VERIFY-BULLET-TWO'] },
  (html) => check(html, 'VERIFY-BULLET-ONE', 'hero.bulletPoints[0]') && check(html, 'VERIFY-BULLET-TWO', 'hero.bulletPoints[1]'),
  { 'hero.bulletPoints': original.hero?.bulletPoints }
)

await run('hero.primaryButton.text',
  { 'hero.primaryButton': { text: 'VERIFY-PRIMARY-BTN', url: original.hero?.primaryButton?.url } },
  (html) => check(html, 'VERIFY-PRIMARY-BTN', 'hero.primaryButton.text'),
  { 'hero.primaryButton': original.hero?.primaryButton }
)

await run('hero.secondaryButton.text',
  { 'hero.secondaryButton': { text: 'VERIFY-SECONDARY-BTN', url: original.hero?.secondaryButton?.url } },
  (html) => check(html, 'VERIFY-SECONDARY-BTN', 'hero.secondaryButton.text'),
  { 'hero.secondaryButton': original.hero?.secondaryButton }
)

await run('hero.youtubeVideoId',
  { 'hero.youtubeVideoId': 'VERIFYVID9XY' },
  (html) => check(html, 'VERIFYVID9XY', 'hero.youtubeVideoId'),
  { 'hero.youtubeVideoId': original.hero?.youtubeVideoId }
)

await run('hero.youtubeNote',
  { 'hero.youtubeNote': 'VERIFY-YT-NOTE-XYZ' },
  (html) => check(html, 'VERIFY-YT-NOTE-XYZ', 'hero.youtubeNote'),
  { 'hero.youtubeNote': original.hero?.youtubeNote }
)

// ─────────────────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔍 STATS BAR')

const testStats = [
  { _key: 's1', value: 'VERIFY-VAL1', label: 'VERIFY-LBL1' },
  { _key: 's2', value: 'VERIFY-VAL2', label: 'VERIFY-LBL2' },
]
await run('stats[].value + label',
  { stats: testStats },
  (html) =>
    check(html, 'VERIFY-VAL1', 'stats[0].value') &&
    check(html, 'VERIFY-LBL1', 'stats[0].label') &&
    check(html, 'VERIFY-VAL2', 'stats[1].value'),
  { stats: original.stats }
)

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔍 ABOUT / EDUCATOR SECTION')

await run('about.name',
  { 'about.name': 'VERIFY-NAME-XYZ' },
  (html) => check(html, 'VERIFY-NAME-XYZ', 'about.name'),
  { 'about.name': original.about?.name }
)

await run('about.title',
  { 'about.title': 'VERIFY-TITLE-XYZ' },
  (html) => check(html, 'VERIFY-TITLE-XYZ', 'about.title'),
  { 'about.title': original.about?.title }
)

await run('about.credentialBadge',
  { 'about.credentialBadge': 'VERIFY-CRED-BADGE-XYZ' },
  (html) => check(html, 'VERIFY-CRED-BADGE-XYZ', 'about.credentialBadge'),
  { 'about.credentialBadge': original.about?.credentialBadge }
)

await run('about.bio1',
  { 'about.bio1': 'VERIFY-BIO1-XYZ' },
  (html) => check(html, 'VERIFY-BIO1-XYZ', 'about.bio1'),
  { 'about.bio1': original.about?.bio1 }
)

await run('about.bio2',
  { 'about.bio2': 'VERIFY-BIO2-XYZ' },
  (html) => check(html, 'VERIFY-BIO2-XYZ', 'about.bio2'),
  { 'about.bio2': original.about?.bio2 }
)

await run('about.bio3',
  { 'about.bio3': 'VERIFY-BIO3-XYZ' },
  (html) => check(html, 'VERIFY-BIO3-XYZ', 'about.bio3'),
  { 'about.bio3': original.about?.bio3 }
)

await run('about.pullQuote',
  { 'about.pullQuote': 'VERIFY-PULLQUOTE-XYZ' },
  (html) => check(html, 'VERIFY-PULLQUOTE-XYZ', 'about.pullQuote'),
  { 'about.pullQuote': original.about?.pullQuote }
)

await run('about.credentials[]',
  { 'about.credentials': [{ _key: 'c1', text: 'VERIFY-CRED-ONE' }, { _key: 'c2', text: 'VERIFY-CRED-TWO' }] },
  (html) => check(html, 'VERIFY-CRED-ONE', 'about.credentials[0]') && check(html, 'VERIFY-CRED-TWO', 'about.credentials[1]'),
  { 'about.credentials': original.about?.credentials }
)

await run('about.badges[]',
  { 'about.badges': [{ _key: 'b1', text: 'VERIFY-BADGE-ONE' }] },
  (html) => check(html, 'VERIFY-BADGE-ONE', 'about.badges[0]'),
  { 'about.badges': original.about?.badges }
)

// ─────────────────────────────────────────────────────────────────────────────
// TEACHING PHILOSOPHY
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔍 TEACHING PHILOSOPHY')

await run('teachingPhilosophy.sectionLabel',
  { 'teachingPhilosophy.sectionLabel': 'VERIFY-PHIL-LABEL' },
  (html) => check(html, 'VERIFY-PHIL-LABEL', 'teachingPhilosophy.sectionLabel'),
  { 'teachingPhilosophy.sectionLabel': original.teachingPhilosophy?.sectionLabel }
)

await run('teachingPhilosophy.heading',
  { 'teachingPhilosophy.heading': 'VERIFY-PHIL-HEADING' },
  (html) => check(html, 'VERIFY-PHIL-HEADING', 'teachingPhilosophy.heading'),
  { 'teachingPhilosophy.heading': original.teachingPhilosophy?.heading }
)

await run('teachingPhilosophy.cards[].title + description',
  { 'teachingPhilosophy.cards': [{ _key: 'p1', icon: 'Lightbulb', title: 'VERIFY-CARD-TITLE', description: 'VERIFY-CARD-DESC' }] },
  (html) => check(html, 'VERIFY-CARD-TITLE', 'teachingPhilosophy.cards[0].title') && check(html, 'VERIFY-CARD-DESC', 'teachingPhilosophy.cards[0].description'),
  { 'teachingPhilosophy.cards': original.teachingPhilosophy?.cards }
)

// ─────────────────────────────────────────────────────────────────────────────
// YOUTUBE SECTION
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔍 YOUTUBE SECTION')

await run('youtubeSection.sectionLabel',
  { 'youtubeSection.sectionLabel': 'VERIFY-YTS-LABEL' },
  (html) => check(html, 'VERIFY-YTS-LABEL', 'youtubeSection.sectionLabel'),
  { 'youtubeSection.sectionLabel': original.youtubeSection?.sectionLabel }
)

await run('youtubeSection.heading',
  { 'youtubeSection.heading': 'VERIFY-YTS-HEADING' },
  (html) => check(html, 'VERIFY-YTS-HEADING', 'youtubeSection.heading'),
  { 'youtubeSection.heading': original.youtubeSection?.heading }
)

await run('youtubeSection.subtext',
  { 'youtubeSection.subtext': 'VERIFY-YTS-SUBTEXT' },
  (html) => check(html, 'VERIFY-YTS-SUBTEXT', 'youtubeSection.subtext'),
  { 'youtubeSection.subtext': original.youtubeSection?.subtext }
)

await run('youtubeSection.featuredVideoId',
  { 'youtubeSection.featuredVideoId': 'VERIFYVIDSYT1' },
  (html) => check(html, 'VERIFYVIDSYT1', 'youtubeSection.featuredVideoId'),
  { 'youtubeSection.featuredVideoId': original.youtubeSection?.featuredVideoId }
)

await run('youtubeSection.playlistNote',
  { 'youtubeSection.playlistNote': 'VERIFY-PLAYLIST-NOTE' },
  (html) => check(html, 'VERIFY-PLAYLIST-NOTE', 'youtubeSection.playlistNote'),
  { 'youtubeSection.playlistNote': original.youtubeSection?.playlistNote }
)

await run('youtubeSection.ctaButton.text',
  { 'youtubeSection.ctaButton': { text: 'VERIFY-YT-CTA-BTN', url: original.youtubeSection?.ctaButton?.url } },
  (html) => check(html, 'VERIFY-YT-CTA-BTN', 'youtubeSection.ctaButton.text'),
  { 'youtubeSection.ctaButton': original.youtubeSection?.ctaButton }
)

await run('youtubeSection.topics[].title + description',
  { 'youtubeSection.topics': [{ _key: 't1', title: 'VERIFY-TOPIC-TITLE', description: 'VERIFY-TOPIC-DESC' }] },
  (html) => check(html, 'VERIFY-TOPIC-TITLE', 'youtubeSection.topics[0].title') && check(html, 'VERIFY-TOPIC-DESC', 'youtubeSection.topics[0].description'),
  { 'youtubeSection.topics': original.youtubeSection?.topics }
)

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO GRID
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔍 VIDEO GRID')

await run('videoGrid.heading',
  { 'videoGrid.heading': 'VERIFY-VG-HEADING' },
  (html) => check(html, 'VERIFY-VG-HEADING', 'videoGrid.heading'),
  { 'videoGrid.heading': original.videoGrid?.heading }
)

await run('videoGrid.videos[].title + duration',
  { 'videoGrid.videos': [{ _key: 'v1', videoId: 'dQw4w9WgXcQ', title: 'VERIFY-VID-TITLE', duration: 'VERIFY-VID-DUR' }] },
  (html) => check(html, 'VERIFY-VID-TITLE', 'videoGrid.videos[0].title') && check(html, 'VERIFY-VID-DUR', 'videoGrid.videos[0].duration'),
  { 'videoGrid.videos': original.videoGrid?.videos }
)

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT SERIES
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔍 ABOUT SERIES')

await run('aboutSeries.heading',
  { 'aboutSeries.heading': 'VERIFY-SERIES-HEADING' },
  (html) => check(html, 'VERIFY-SERIES-HEADING', 'aboutSeries.heading'),
  { 'aboutSeries.heading': original.aboutSeries?.heading }
)

await run('aboutSeries.subtext',
  { 'aboutSeries.subtext': 'VERIFY-SERIES-SUBTEXT' },
  (html) => check(html, 'VERIFY-SERIES-SUBTEXT', 'aboutSeries.subtext'),
  { 'aboutSeries.subtext': original.aboutSeries?.subtext }
)

await run('aboutSeries.topics[]',
  { 'aboutSeries.topics': ['VERIFY-SERIES-TOPIC-A', 'VERIFY-SERIES-TOPIC-B'] },
  (html) => check(html, 'VERIFY-SERIES-TOPIC-A', 'aboutSeries.topics[0]') && check(html, 'VERIFY-SERIES-TOPIC-B', 'aboutSeries.topics[1]'),
  { 'aboutSeries.topics': original.aboutSeries?.topics }
)

// ─────────────────────────────────────────────────────────────────────────────
// WHO IS IT FOR
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔍 WHO IS IT FOR')

await run('whoIsItFor.sectionLabel',
  { 'whoIsItFor.sectionLabel': 'VERIFY-WHO-LABEL' },
  (html) => check(html, 'VERIFY-WHO-LABEL', 'whoIsItFor.sectionLabel'),
  { 'whoIsItFor.sectionLabel': original.whoIsItFor?.sectionLabel }
)

await run('whoIsItFor.heading',
  { 'whoIsItFor.heading': 'VERIFY-WHO-HEADING' },
  (html) => check(html, 'VERIFY-WHO-HEADING', 'whoIsItFor.heading'),
  { 'whoIsItFor.heading': original.whoIsItFor?.heading }
)

await run('whoIsItFor.cards[].title + description',
  { 'whoIsItFor.cards': [{ _key: 'w1', title: 'VERIFY-WHO-CARD-TITLE', description: 'VERIFY-WHO-CARD-DESC' }] },
  (html) => check(html, 'VERIFY-WHO-CARD-TITLE', 'whoIsItFor.cards[0].title') && check(html, 'VERIFY-WHO-CARD-DESC', 'whoIsItFor.cards[0].description'),
  { 'whoIsItFor.cards': original.whoIsItFor?.cards }
)

// ─────────────────────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔍 TESTIMONIALS')

await run('testimonials.sectionLabel',
  { 'testimonials.sectionLabel': 'VERIFY-TEST-LABEL' },
  (html) => check(html, 'VERIFY-TEST-LABEL', 'testimonials.sectionLabel'),
  { 'testimonials.sectionLabel': original.testimonials?.sectionLabel }
)

await run('testimonials.heading',
  { 'testimonials.heading': 'VERIFY-TEST-HEADING' },
  (html) => check(html, 'VERIFY-TEST-HEADING', 'testimonials.heading'),
  { 'testimonials.heading': original.testimonials?.heading }
)

await run('testimonials.overallRating',
  { 'testimonials.overallRating': '9.9' },
  (html) => check(html, '9.9', 'testimonials.overallRating'),
  { 'testimonials.overallRating': original.testimonials?.overallRating }
)

const testTestimonial = { _key: 'tv1', name: 'VERIFY-STUDENT-NAME', college: 'VERIFY-COLLEGE', initials: 'VT', color: 'bg-blue-600', quote: 'VERIFY-QUOTE-TEXT' }
await run('testimonials.items[].name + college + quote',
  { 'testimonials.items': [testTestimonial] },
  (html) =>
    check(html, 'VERIFY-STUDENT-NAME', 'testimonials.items[0].name') &&
    check(html, 'VERIFY-COLLEGE', 'testimonials.items[0].college') &&
    check(html, 'VERIFY-QUOTE-TEXT', 'testimonials.items[0].quote'),
  { 'testimonials.items': original.testimonials?.items }
)

// ─────────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔍 FAQ SECTION')

await run('faq.sectionLabel',
  { 'faq.sectionLabel': 'VERIFY-FAQ-LABEL' },
  (html) => check(html, 'VERIFY-FAQ-LABEL', 'faq.sectionLabel'),
  { 'faq.sectionLabel': original.faq?.sectionLabel }
)

await run('faq.heading',
  { 'faq.heading': 'VERIFY-FAQ-HEADING' },
  (html) => check(html, 'VERIFY-FAQ-HEADING', 'faq.heading'),
  { 'faq.heading': original.faq?.heading }
)

await run('faq.subtext',
  { 'faq.subtext': 'VERIFY-FAQ-SUBTEXT' },
  (html) => check(html, 'VERIFY-FAQ-SUBTEXT', 'faq.subtext'),
  { 'faq.subtext': original.faq?.subtext }
)

await run('faq.emailLinkText',
  { 'faq.emailLinkText': 'VERIFY-FAQ-EMAILTEXT' },
  (html) => check(html, 'VERIFY-FAQ-EMAILTEXT', 'faq.emailLinkText'),
  { 'faq.emailLinkText': original.faq?.emailLinkText }
)

await run('faq.email (mailto href)',
  { 'faq.email': 'verify-faq@nsacademy.test' },
  (html) => check(html, 'verify-faq@nsacademy.test', 'faq.email'),
  { 'faq.email': original.faq?.email }
)

await run('faq.items[].question + answer',
  { 'faq.items': [{ _key: 'fq1', question: 'VERIFY-FAQ-QUESTION?', answer: 'VERIFY-FAQ-ANSWER.' }] },
  (html) => check(html, 'VERIFY-FAQ-QUESTION?', 'faq.items[0].question') && check(html, 'VERIFY-FAQ-ANSWER.', 'faq.items[0].answer'),
  { 'faq.items': original.faq?.items }
)

// ─────────────────────────────────────────────────────────────────────────────
// YOUTUBE SUBSCRIBE BANNER
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔍 YOUTUBE SUBSCRIBE BANNER')

await run('youtubeSubscribeBanner.text',
  { 'youtubeSubscribeBanner.text': 'VERIFY-BANNER-TEXT' },
  (html) => check(html, 'VERIFY-BANNER-TEXT', 'youtubeSubscribeBanner.text'),
  { 'youtubeSubscribeBanner.text': original.youtubeSubscribeBanner?.text }
)

await run('youtubeSubscribeBanner.button.text',
  { 'youtubeSubscribeBanner.button': { text: 'VERIFY-BANNER-BTN', url: original.youtubeSubscribeBanner?.button?.url } },
  (html) => check(html, 'VERIFY-BANNER-BTN', 'youtubeSubscribeBanner.button.text'),
  { 'youtubeSubscribeBanner.button': original.youtubeSubscribeBanner?.button }
)

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT (verified on /contact page)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔍 CONTACT (on /contact page)')

await run('contact.whatsappNumber',
  { 'contact.whatsappNumber': '911234567890' },
  async (_html, contactHtml) => check(contactHtml, '911234567890', 'contact.whatsappNumber'),
  { 'contact.whatsappNumber': original.contact?.whatsappNumber }
)

await run('contact.email',
  { 'contact.email': 'verify@nsacademy.test' },
  async (_html, contactHtml) => check(contactHtml, 'verify@nsacademy.test', 'contact.email'),
  { 'contact.email': original.contact?.email }
)

await run('contact.location',
  { 'contact.location': 'VERIFY-LOCATION-XYZ' },
  async (_html, contactHtml) => check(contactHtml, 'VERIFY-LOCATION-XYZ', 'contact.location'),
  { 'contact.location': original.contact?.location }
)

// ─────────────────────────────────────────────────────────────────────────────
// FINAL RESTORE (belt-and-suspenders)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🔄 Final restore of all original values...')
try {
  await client.patch(DOC_ID).set({
    hero: original.hero,
    stats: original.stats,
    about: original.about,
    teachingPhilosophy: original.teachingPhilosophy,
    youtubeSection: original.youtubeSection,
    videoGrid: original.videoGrid,
    aboutSeries: original.aboutSeries,
    whoIsItFor: original.whoIsItFor,
    testimonials: original.testimonials,
    faq: original.faq,
    youtubeSubscribeBanner: original.youtubeSubscribeBanner,
    contact: original.contact,
    footer: original.footer,
  }).commit()
  await revalidate()
  console.log('   ✅ All original values restored')
} catch (err) {
  console.error('   ⚠️  Restore failed:', err.message)
}

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(60))
console.log(`📊 RESULTS: ${passed} passed  /  ${failed} failed  /  ${results.length} total`)
console.log('─'.repeat(60))
if (failed > 0) {
  console.log('\n❌ FAILED FIELDS:')
  results.filter(r => !r.ok).forEach(r => console.log(`   • ${r.label}${r.error ? ' — ' + r.error : ''}`))
}
console.log('')
process.exit(failed > 0 ? 1 : 0)
