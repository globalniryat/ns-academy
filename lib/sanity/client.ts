import { createClient } from 'next-sanity'

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
}

export const client = createClient({
  ...config,
  // CDN disabled in dev so changes in Sanity are immediately visible without waiting for CDN propagation
  useCdn: process.env.NODE_ENV === 'production',
})

// Used in draft mode — can see unpublished changes
export const draftClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'previewDrafts',
})
