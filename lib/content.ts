import { prisma } from './prisma'

// Fetch a single SiteContent value by key
// Returns the raw value string or a fallback
export async function getSiteContent(key: string, fallback = ''): Promise<string> {
  try {
    const item = await prisma.siteContent.findUnique({ where: { key } })
    return item?.value ?? fallback
  } catch {
    return fallback
  }
}

// Fetch multiple SiteContent values as a key→value map
// Usage: const content = await getSiteContentMap(['hero.headline', 'hero.subtext'])
export async function getSiteContentMap(keys: string[]): Promise<Record<string, string>> {
  try {
    const items = await prisma.siteContent.findMany({ where: { key: { in: keys } } })
    const map: Record<string, string> = {}
    for (const item of items) {
      map[item.key] = item.value
    }
    // Fill in missing keys with empty string
    for (const key of keys) {
      if (!(key in map)) map[key] = ''
    }
    return map
  } catch {
    const map: Record<string, string> = {}
    for (const key of keys) map[key] = ''
    return map
  }
}

// Parse a JSON-type SiteContent value (e.g., instructor.credentials)
export async function getSiteContentJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const item = await prisma.siteContent.findUnique({ where: { key } })
    if (!item?.value) return fallback
    return JSON.parse(item.value) as T
  } catch {
    return fallback
  }
}
