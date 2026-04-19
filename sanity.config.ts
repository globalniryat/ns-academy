import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { defineLocations, presentationTool } from 'sanity/presentation'
import { schemaTypes } from './sanity/schemaTypes'
import { EarthGlobeIcon } from '@sanity/icons'

export default defineConfig({
  name: 'ns-academy',
  title: 'NS Academy',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',

  plugins: [
    // ── Content Editor sidebar ─────────────────────────────────────────────
    structureTool({
      title: 'Content Editor',
      structure: (S) =>
        S.list()
          .title('NS Academy')
          .items([
            S.listItem()
              .title('Website Content')
              .icon(EarthGlobeIcon)
              .id('siteContent')
              .child(
                S.document()
                  .schemaType('siteContent')
                  .documentId('siteContent')
                  .title('Website Content')
              ),
          ]),
    }),

    // ── Live Preview ───────────────────────────────────────────────────────
    presentationTool({
      name: 'preview',
      title: '👁 Live Preview',
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
        origin:
          process.env.NEXT_PUBLIC_APP_URL ??
          (process.env.NODE_ENV === 'production'
            ? 'https://your-production-domain.com'
            : 'http://localhost:3000'),
      },
      resolve: {
        locations: {
          siteContent: defineLocations({
            locations: [{ title: 'Home Page', href: '/' }],
          }),
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
