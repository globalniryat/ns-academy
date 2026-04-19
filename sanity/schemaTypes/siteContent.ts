import { defineField, defineType, defineArrayMember } from 'sanity'
import {
  HomeIcon,
  UserIcon,
  PlayIcon,
  ThLargeIcon,
  BulbOutlineIcon,
  StarIcon,
  HelpCircleIcon,
  EnvelopeIcon,
  LinkIcon,
  TagIcon,
  BellIcon,
  ImageIcon,
} from '@sanity/icons'

// ─── Reusable sub-types ────────────────────────────────────────────────────────

const buttonFields = [
  defineField({
    name: 'text',
    title: 'Button Label',
    type: 'string',
    description: 'Text shown on the button, e.g. "Join Free Now"',
    validation: (R) => R.max(40).warning('Keep button labels under 40 characters'),
  }),
  defineField({
    name: 'url',
    title: 'Button Link (URL)',
    type: 'url',
    description: 'Full URL the button opens — must start with https://',
    validation: (R) =>
      R.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }).warning('Enter a valid URL'),
  }),
]

// ─── Main Document ─────────────────────────────────────────────────────────────

export const siteContent = defineType({
  name: 'siteContent',
  title: 'Site Content',
  type: 'document',

  // Top-level section tabs — one click to jump to any section
  groups: [
    { name: 'hero',         title: 'Hero',             icon: HomeIcon,       default: true },
    { name: 'stats',        title: 'Stats Bar',        icon: ThLargeIcon },
    { name: 'about',        title: 'About Educator',   icon: UserIcon },
    { name: 'philosophy',   title: 'Philosophy',       icon: BulbOutlineIcon },
    { name: 'youtube',      title: 'YouTube Section',  icon: PlayIcon },
    { name: 'videos',       title: 'Video Grid',       icon: PlayIcon },
    { name: 'series',       title: 'Series Info',      icon: TagIcon },
    { name: 'whoFor',       title: 'Who Is It For',    icon: UserIcon },
    { name: 'testimonials', title: 'Testimonials',     icon: StarIcon },
    { name: 'faq',          title: 'FAQ',              icon: HelpCircleIcon },
    { name: 'contact',      title: 'Contact',          icon: EnvelopeIcon },
    { name: 'footer',       title: 'Footer',           icon: LinkIcon },
    { name: 'banner',       title: 'Subscribe Banner', icon: BellIcon },
  ],

  fields: [

    // ── HERO ────────────────────────────────────────────────────────────────────
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      description: 'The very first thing visitors see. Keep the headline punchy and the CTA clear.',
      options: { collapsible: false },
      groups: [
        { name: 'text',    title: 'Text Content', default: true },
        { name: 'buttons', title: 'Buttons' },
        { name: 'media',   title: 'Images & Video' },
      ],
      fields: [
        defineField({
          name: 'badgeText',
          title: 'Top Badge Text',
          type: 'string',
          group: 'text',
          description: 'Small badge above the headline, e.g. "🎓 Free CA Final Series"',
          validation: (R) => R.max(60).warning('Keep badge text under 60 characters'),
        }),
        defineField({
          name: 'headline',
          title: 'Main Headline',
          type: 'text',
          rows: 2,
          group: 'text',
          description: 'The bold heading visitors read first. 1–2 lines. Use line breaks sparingly.',
          validation: (R) => R.required().max(120).error('Headline is required and must be under 120 characters'),
        }),
        defineField({
          name: 'subtext',
          title: 'Subtext / Description',
          type: 'text',
          rows: 3,
          group: 'text',
          description: 'Supporting paragraph below the headline. 2–3 sentences is ideal.',
          validation: (R) => R.max(300).warning('Keep subtext under 300 characters for best display'),
        }),
        defineField({
          name: 'bulletPoints',
          title: 'Bullet Points',
          type: 'array',
          group: 'text',
          description: 'Short feature highlights shown below the subtext. Add 3–5 points.',
          of: [
            defineArrayMember({
              type: 'string',
              validation: (R) => R.max(80).warning('Each bullet should be under 80 characters'),
            }),
          ],
        }),
        defineField({
          name: 'primaryButton',
          title: 'Primary (Main) Button',
          type: 'object',
          group: 'buttons',
          description: 'The main call-to-action button — use a strong action verb.',
          fields: buttonFields,
        }),
        defineField({
          name: 'secondaryButton',
          title: 'Secondary Button',
          type: 'object',
          group: 'buttons',
          description: 'Optional second button — typically a softer action like "Watch Free Lectures".',
          fields: buttonFields,
        }),
        defineField({
          name: 'profileImage',
          title: 'Educator Profile Photo',
          type: 'image',
          group: 'media',
          description: 'Photo shown next to the headline. Use a high-quality portrait (min 640×640 px).',
          options: { hotspot: true },
        }),
        defineField({
          name: 'youtubeVideoId',
          title: 'YouTube Video ID',
          type: 'string',
          group: 'media',
          description: 'Paste only the video ID from YouTube URL — the part after "?v=". E.g. for https://youtube.com/watch?v=dQw4w9WgXcQ enter: dQw4w9WgXcQ',
          validation: (R) =>
            R.regex(/^[a-zA-Z0-9_-]{11}$/).warning('YouTube Video IDs are exactly 11 characters'),
        }),
        defineField({
          name: 'youtubeNote',
          title: 'Note Below Video',
          type: 'string',
          group: 'media',
          description: 'Small text shown under the embedded video, e.g. "New lectures every Tuesday"',
          validation: (R) => R.max(100).warning('Keep this under 100 characters'),
        }),
      ],
    }),

    // ── STATS BAR ───────────────────────────────────────────────────────────────
    defineField({
      name: 'stats',
      title: 'Stats Bar',
      type: 'array',
      group: 'stats',
      description: 'Numbers shown in the horizontal strip, e.g. "5,000+ Students". Add 3–5 stats.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Number / Value',
              type: 'string',
              description: 'E.g. "5,000+" or "98%"',
              validation: (R) => R.required().max(20),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'E.g. "Students Enrolled" or "Success Rate"',
              validation: (R) => R.required().max(40),
            }),
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
            prepare({ title, subtitle }) {
              return { title: title ?? '—', subtitle }
            },
          },
        }),
      ],
    }),

    // ── ABOUT ───────────────────────────────────────────────────────────────────
    defineField({
      name: 'about',
      title: 'About / Educator Section',
      type: 'object',
      group: 'about',
      description: 'Builds trust by introducing the educator — keep it personal and credential-backed.',
      options: { collapsible: false },
      groups: [
        { name: 'identity', title: 'Name & Title',    default: true },
        { name: 'bio',      title: 'Bio Text' },
        { name: 'photo',    title: 'Photo',           icon: ImageIcon },
        { name: 'badges',   title: 'Badges & Credentials' },
      ],
      fields: [
        defineField({
          name: 'name',
          title: 'Full Name',
          type: 'string',
          group: 'identity',
          description: 'Educator\'s full name as it appears on the site',
          validation: (R) => R.required(),
        }),
        defineField({
          name: 'title',
          title: 'Title / Designation',
          type: 'string',
          group: 'identity',
          description: 'E.g. "CA Final Faculty | SFM Specialist"',
          validation: (R) => R.max(80).warning('Keep designation short'),
        }),
        defineField({
          name: 'ratingBadge',
          title: 'Rating Badge',
          type: 'string',
          group: 'identity',
          description: 'E.g. "⭐ 4.9 Rated Educator"',
        }),
        defineField({
          name: 'credentialBadge',
          title: 'Credential Badge',
          type: 'string',
          group: 'identity',
          description: 'E.g. "Chartered Accountant | Symbiosis Faculty"',
        }),
        defineField({
          name: 'profileImage',
          title: 'Educator Photo',
          type: 'image',
          group: 'photo',
          description: 'Main photo shown in the About section. Use a clear, professional headshot.',
          options: { hotspot: true },
        }),
        defineField({
          name: 'bio1',
          title: 'Bio — Paragraph 1',
          type: 'text',
          rows: 4,
          group: 'bio',
          description: 'Opening paragraph — who they are and why they teach.',
        }),
        defineField({
          name: 'bio2',
          title: 'Bio — Paragraph 2',
          type: 'text',
          rows: 4,
          group: 'bio',
          description: 'Teaching experience, qualifications, background.',
        }),
        defineField({
          name: 'bio3',
          title: 'Bio — Paragraph 3',
          type: 'text',
          rows: 4,
          group: 'bio',
          description: 'Personal touch — teaching philosophy or motivating story.',
        }),
        defineField({
          name: 'pullQuote',
          title: 'Pull Quote',
          type: 'text',
          rows: 2,
          group: 'bio',
          description: 'A standout quote or philosophy shown in a highlighted block',
          validation: (R) => R.max(200).warning('Keep pull quotes under 200 characters'),
        }),
        defineField({
          name: 'credentials',
          title: 'Credentials List',
          type: 'array',
          group: 'badges',
          description: 'Each credential shown with a ✓ or icon. E.g. "Chartered Accountant (ICAI)"',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'text', title: 'Credential', type: 'string', validation: (R) => R.required() }),
              ],
              preview: { select: { title: 'text' } },
            }),
          ],
        }),
        defineField({
          name: 'badges',
          title: 'Trust Badges',
          type: 'array',
          group: 'badges',
          description: 'Short badge labels shown as pills, e.g. "100% Free", "No Registration Needed"',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'text', title: 'Badge Text', type: 'string', validation: (R) => R.required().max(40) }),
              ],
              preview: { select: { title: 'text' } },
            }),
          ],
        }),
      ],
    }),

    // ── TEACHING PHILOSOPHY ─────────────────────────────────────────────────────
    defineField({
      name: 'teachingPhilosophy',
      title: 'Teaching Philosophy',
      type: 'object',
      group: 'philosophy',
      description: 'Explains the teaching approach through 2–4 feature cards.',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Section Label (small text above heading)',
          type: 'string',
          description: 'E.g. "Our Approach" — shown as a small label above the main heading',
        }),
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          description: 'Main heading of this section, e.g. "Why Students Love This Method"',
          validation: (R) => R.max(80),
        }),
        defineField({
          name: 'cards',
          title: 'Philosophy Cards',
          type: 'array',
          description: 'Each card has an icon, title and short description. Add 2–4 cards.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'icon',
                  title: 'Icon Name',
                  type: 'string',
                  description: 'One of: Lightbulb / Users / BookOpen / Target / Star / CheckCircle',
                }),
                defineField({
                  name: 'title',
                  title: 'Card Title',
                  type: 'string',
                  validation: (R) => R.required().max(50),
                }),
                defineField({
                  name: 'description',
                  title: 'Card Description',
                  type: 'text',
                  rows: 2,
                  validation: (R) => R.max(200).warning('Keep card descriptions under 200 characters'),
                }),
              ],
              preview: { select: { title: 'title', subtitle: 'icon' } },
            }),
          ],
        }),
      ],
    }),

    // ── YOUTUBE SECTION ─────────────────────────────────────────────────────────
    defineField({
      name: 'youtubeSection',
      title: 'YouTube Featured Section',
      type: 'object',
      group: 'youtube',
      description: 'Highlights the YouTube channel with a featured video and topic overview.',
      options: { collapsible: false },
      groups: [
        { name: 'text',   title: 'Text',   default: true },
        { name: 'video',  title: 'Video & Links' },
        { name: 'topics', title: 'Topic Cards' },
      ],
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
          group: 'text',
          description: 'Small label above heading, e.g. "Free on YouTube"',
        }),
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          group: 'text',
          validation: (R) => R.max(80),
        }),
        defineField({
          name: 'subtext',
          title: 'Subtext',
          type: 'text',
          rows: 2,
          group: 'text',
          description: 'Brief description below the heading',
          validation: (R) => R.max(250),
        }),
        defineField({
          name: 'featuredVideoId',
          title: 'Featured YouTube Video ID',
          type: 'string',
          group: 'video',
          description: 'Only the 11-character ID from the video URL. E.g. dQw4w9WgXcQ',
          validation: (R) =>
            R.regex(/^[a-zA-Z0-9_-]{11}$/).warning('YouTube Video IDs are exactly 11 characters'),
        }),
        defineField({
          name: 'channelUrl',
          title: 'YouTube Channel URL',
          type: 'url',
          group: 'video',
          description: 'Full URL of the YouTube channel — must start with https://',
        }),
        defineField({
          name: 'playlistNote',
          title: 'Playlist Note',
          type: 'string',
          group: 'video',
          description: 'Small text shown near the video, e.g. "Full playlist: 40+ lectures"',
          validation: (R) => R.max(80),
        }),
        defineField({
          name: 'ctaButton',
          title: 'CTA Button',
          type: 'object',
          group: 'video',
          description: 'Button linking to the channel or playlist',
          fields: buttonFields,
        }),
        defineField({
          name: 'topics',
          title: 'Topic Cards',
          type: 'array',
          group: 'topics',
          description: 'Cards showing what topics are covered. Add 3–6 cards.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'title', title: 'Topic Title', type: 'string', validation: (R) => R.required().max(60) }),
                defineField({ name: 'description', title: 'Brief Description', type: 'text', rows: 2, validation: (R) => R.max(150) }),
              ],
              preview: { select: { title: 'title' } },
            }),
          ],
        }),
      ],
    }),

    // ── VIDEO GRID ──────────────────────────────────────────────────────────────
    defineField({
      name: 'videoGrid',
      title: 'Video Grid — Latest Lectures',
      type: 'object',
      group: 'videos',
      description: 'Grid of recent YouTube lecture thumbnails. Add up to 8 videos.',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          description: 'E.g. "Latest Free Lectures"',
          validation: (R) => R.max(60),
        }),
        defineField({
          name: 'videos',
          title: 'Videos',
          type: 'array',
          description: 'Each video shows a YouTube thumbnail, title and duration.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'videoId',
                  title: 'YouTube Video ID',
                  type: 'string',
                  description: '11-character ID from the video URL',
                  validation: (R) =>
                    R.required().regex(/^[a-zA-Z0-9_-]{11}$/).error('Must be a valid 11-character YouTube video ID'),
                }),
                defineField({
                  name: 'title',
                  title: 'Video Title',
                  type: 'string',
                  validation: (R) => R.required().max(100),
                }),
                defineField({
                  name: 'duration',
                  title: 'Duration',
                  type: 'string',
                  description: 'E.g. "45 min" or "1h 20min"',
                  validation: (R) => R.max(15),
                }),
              ],
              preview: {
                select: { title: 'title', subtitle: 'duration' },
                prepare({ title, subtitle }) {
                  return { title: title ?? 'Untitled video', subtitle: subtitle ?? '' }
                },
              },
            }),
          ],
        }),
      ],
    }),

    // ── ABOUT SERIES ────────────────────────────────────────────────────────────
    defineField({
      name: 'aboutSeries',
      title: 'About This Series',
      type: 'object',
      group: 'series',
      description: 'Overview of the course series with topic chips.',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          validation: (R) => R.max(80),
        }),
        defineField({
          name: 'subtext',
          title: 'Subtext',
          type: 'text',
          rows: 2,
          description: 'A sentence or two describing the series',
          validation: (R) => R.max(300),
        }),
        defineField({
          name: 'topics',
          title: 'Topic Chips',
          type: 'array',
          description: 'Short labels shown as pills, e.g. "Derivatives", "Forex", "Leasing"',
          of: [
            defineArrayMember({
              type: 'string',
              validation: (R) => R.max(40).warning('Keep topic chips short'),
            }),
          ],
        }),
      ],
    }),

    // ── WHO IS IT FOR ───────────────────────────────────────────────────────────
    defineField({
      name: 'whoIsItFor',
      title: 'Who Is This Series For',
      type: 'object',
      group: 'whoFor',
      description: 'Cards describing the target audience — helps visitors self-qualify.',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'sectionLabel',
          title: 'Section Label',
          type: 'string',
          description: 'Small label above heading, e.g. "Is This For Me?"',
        }),
        defineField({
          name: 'heading',
          title: 'Section Heading',
          type: 'string',
          validation: (R) => R.max(80),
        }),
        defineField({
          name: 'cards',
          title: 'Audience Cards',
          type: 'array',
          description: 'Each card describes one audience type. Add 2–4 cards.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'title', title: 'Audience Title', type: 'string', validation: (R) => R.required().max(60) }),
                defineField({ name: 'description', title: 'Description', type: 'text', rows: 2, validation: (R) => R.max(200) }),
              ],
              preview: { select: { title: 'title' } },
            }),
          ],
        }),
      ],
    }),

    // ── TESTIMONIALS ────────────────────────────────────────────────────────────
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'object',
      group: 'testimonials',
      description: 'Student reviews that build social proof.',
      options: { collapsible: false },
      groups: [
        { name: 'header', title: 'Section Header', default: true },
        { name: 'items',  title: 'Testimonial Items' },
      ],
      fields: [
        defineField({ name: 'sectionLabel', title: 'Section Label', type: 'string', group: 'header', description: 'E.g. "What Students Say"' }),
        defineField({ name: 'heading', title: 'Section Heading', type: 'string', group: 'header', validation: (R) => R.max(80) }),
        defineField({ name: 'subtext', title: 'Subtext', type: 'text', rows: 2, group: 'header', validation: (R) => R.max(200) }),
        defineField({
          name: 'overallRating',
          title: 'Overall Rating',
          type: 'string',
          group: 'header',
          description: 'E.g. "4.9" — shown as a star rating summary',
          validation: (R) => R.regex(/^\d(\.\d)?$/).warning('Enter a number like 4.9'),
        }),
        defineField({
          name: 'items',
          title: 'Testimonials',
          type: 'array',
          group: 'items',
          description: 'Individual student reviews. Each one shows name, college, and quote.',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'name', title: 'Student Name', type: 'string', validation: (R) => R.required() }),
                defineField({ name: 'college', title: 'College / Role', type: 'string', description: 'E.g. "CA Final Student, Delhi"' }),
                defineField({ name: 'initials', title: 'Avatar Initials', type: 'string', description: '2 characters shown in the avatar circle if no photo, e.g. "AS"', validation: (R) => R.max(2).warning('Use max 2 characters') }),
                defineField({ name: 'color', title: 'Avatar Background Color', type: 'string', description: 'Tailwind color class, e.g. bg-green-600 / bg-blue-600 / bg-purple-600' }),
                defineField({ name: 'quote', title: 'Testimonial Quote', type: 'text', rows: 3, validation: (R) => R.required().max(400) }),
              ],
              preview: {
                select: { title: 'name', subtitle: 'college' },
                prepare({ title, subtitle }) {
                  return { title: title ?? 'Unnamed', subtitle }
                },
              },
            }),
          ],
        }),
      ],
    }),

    // ── FAQ ─────────────────────────────────────────────────────────────────────
    defineField({
      name: 'faq',
      title: 'FAQ Section',
      type: 'object',
      group: 'faq',
      description: 'Frequently asked questions shown as an accordion. Add as many as needed.',
      options: { collapsible: false },
      groups: [
        { name: 'header', title: 'Section Header', default: true },
        { name: 'items',  title: 'Questions & Answers' },
      ],
      fields: [
        defineField({ name: 'sectionLabel', title: 'Section Label', type: 'string', group: 'header' }),
        defineField({ name: 'heading', title: 'Section Heading', type: 'string', group: 'header', validation: (R) => R.max(80) }),
        defineField({ name: 'subtext', title: 'Subtext / Intro', type: 'string', group: 'header', validation: (R) => R.max(200) }),
        defineField({ name: 'emailLinkText', title: 'Email Link Label', type: 'string', group: 'header', description: 'Text shown before the email link, e.g. "Still have questions? Email us at"' }),
        defineField({ name: 'email', title: 'Contact Email', type: 'string', group: 'header', validation: (R) => R.email().warning('Enter a valid email address') }),
        defineField({
          name: 'items',
          title: 'FAQ Items',
          type: 'array',
          group: 'items',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'question', title: 'Question', type: 'string', validation: (R) => R.required().max(150) }),
                defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (R) => R.required().max(600) }),
              ],
              preview: { select: { title: 'question' } },
            }),
          ],
        }),
      ],
    }),

    // ── CONTACT ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'contact',
      title: 'Contact Info',
      type: 'object',
      group: 'contact',
      description: 'Used by the WhatsApp button, contact page, and footer.',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'whatsappNumber',
          title: 'WhatsApp Number',
          type: 'string',
          description: 'Country code + number, no spaces or dashes. E.g. 919876543210 (91 = India)',
          validation: (R) =>
            R.regex(/^\d{10,15}$/).error('Must be digits only, 10–15 characters. E.g. 919876543210'),
        }),
        defineField({
          name: 'whatsappMessage',
          title: 'WhatsApp Pre-filled Message',
          type: 'text',
          rows: 2,
          description: 'Message automatically typed when a student clicks the WhatsApp button',
          validation: (R) => R.max(300),
        }),
        defineField({
          name: 'email',
          title: 'Email Address',
          type: 'string',
          validation: (R) => R.email().warning('Enter a valid email address'),
        }),
        defineField({
          name: 'location',
          title: 'Location',
          type: 'string',
          description: 'E.g. "Pune, Maharashtra"',
          validation: (R) => R.max(80),
        }),
      ],
    }),

    // ── FOOTER ──────────────────────────────────────────────────────────────────
    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      group: 'footer',
      description: 'Tagline and social media links shown in the site footer.',
      options: { collapsible: false },
      groups: [
        { name: 'text',   title: 'Tagline',       default: true },
        { name: 'social', title: 'Social Links' },
      ],
      fields: [
        defineField({
          name: 'tagline',
          title: 'Footer Tagline',
          type: 'text',
          rows: 2,
          group: 'text',
          description: 'Short mission statement in the footer, e.g. "Making CA Final SFM free for every student."',
          validation: (R) => R.max(200),
        }),
        defineField({ name: 'youtubeUrl',  title: 'YouTube Channel URL',  type: 'url', group: 'social', description: 'Full URL starting with https://youtube.com/' }),
        defineField({ name: 'instagramUrl', title: 'Instagram Profile URL', type: 'url', group: 'social', description: 'Full URL starting with https://instagram.com/' }),
        defineField({ name: 'linkedinUrl',  title: 'LinkedIn Profile URL',  type: 'url', group: 'social', description: 'Full URL starting with https://linkedin.com/' }),
      ],
    }),

    // ── YOUTUBE SUBSCRIBE BANNER ────────────────────────────────────────────────
    defineField({
      name: 'youtubeSubscribeBanner',
      title: 'YouTube Subscribe Banner',
      type: 'object',
      group: 'banner',
      description: 'Full-width banner encouraging visitors to subscribe to the YouTube channel.',
      options: { collapsible: false },
      fields: [
        defineField({
          name: 'text',
          title: 'Banner Text',
          type: 'string',
          description: 'Main message, e.g. "Join 5,000+ students learning CA Final SFM for free"',
          validation: (R) => R.max(120),
        }),
        defineField({
          name: 'button',
          title: 'Subscribe Button',
          type: 'object',
          description: 'Button linking to the YouTube channel',
          fields: buttonFields,
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Site Content', subtitle: 'NS Academy' }
    },
  },
})
