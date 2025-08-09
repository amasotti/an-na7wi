import type { DictionaryLink, Word } from '@/types'
import { DictionaryType } from '@/types/enums'

/**
 * Migrates old comma-separated dictionary links string to new DictionaryLink array format
 */
export function migrateDictionaryLinks(oldLinks: string | undefined): DictionaryLink[] {
  if (!oldLinks?.trim()) {
    return []
  }

  // Split by comma and clean up URLs
  const urls = oldLinks
    .split(',')
    .map(url => url.trim())
    .filter(url => url.length > 0)

  return urls.map(url => ({
    id: crypto.randomUUID(),
    type: detectDictionaryType(url),
    url,
    displayName: getDisplayNameForUrl(url),
  }))
}

/**
 * Detects dictionary type based on URL patterns
 */
export function detectDictionaryType(url: string): DictionaryType {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    if (hostname.includes('almaany.com')) {
      return DictionaryType.ALMANY
    }
    if (hostname.includes('livingarabic.com')) {
      return DictionaryType.LIVING_ARABIC
    }
    if (hostname.includes('derja.ninja')) {
      return DictionaryType.DERJA_NINJA
    }
    if (hostname.includes('reverso.net') || hostname.includes('reverso.com')) {
      return DictionaryType.REVERSO
    }
    if (hostname.includes('wiktionary.org')) {
      return DictionaryType.WIKTIONARY
    }

    return DictionaryType.CUSTOM
  } catch {
    return DictionaryType.CUSTOM
  }
}

/**
 * Gets display name for a URL based on detected type
 */
export function getDisplayNameForUrl(url: string): string | undefined {
  const type = detectDictionaryType(url)
  return type === DictionaryType.CUSTOM ? extractDomainName(url) : undefined
}

/**
 * Extracts a clean domain name for custom dictionary links
 */
export function extractDomainName(url: string): string {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname
    // Remove 'www.' prefix if present
    return hostname.replace(/^www\./, '')
  } catch {
    return 'Custom Dictionary'
  }
}

/**
 * Converts new DictionaryLink array back to old comma-separated string format
 * (for backward compatibility if needed)
 */
export function dictionaryLinksToString(links: DictionaryLink[]): string {
  return links.map(link => link.url).join(', ')
}

/**
 * Validates that all dictionary links have valid URLs
 */
export function validateDictionaryLinks(links: DictionaryLink[]): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  links.forEach((link, index) => {
    if (!link.url?.trim()) {
      errors.push(`Dictionary link ${index + 1}: URL is required`)
      return
    }

    try {
      new URL(link.url)
    } catch {
      errors.push(`Dictionary link ${index + 1}: Invalid URL format`)
    }

    if (link.type === DictionaryType.CUSTOM && !link.displayName?.trim()) {
      errors.push(`Dictionary link ${index + 1}: Display name is required for custom dictionaries`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Helper to ensure Word entities have the new dictionary links format
 */
export function ensureModernDictionaryLinks(word: Partial<Word>): Partial<Word> {
  // If word has old string format, migrate it
  if (typeof word.dictionaryLinks === 'string') {
    word.dictionaryLinks = migrateDictionaryLinks(word.dictionaryLinks)
    return word
  }

  // If word has new format but missing, ensure empty array
  if (!word.dictionaryLinks || !Array.isArray(word.dictionaryLinks)) {
    return {
      ...word,
      dictionaryLinks: [],
    }
  }

  return word
}
