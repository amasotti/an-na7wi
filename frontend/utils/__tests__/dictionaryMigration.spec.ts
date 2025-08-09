import { DictionaryType } from '@/types/enums'
import { describe, expect, it } from 'vitest'
import type { DictionaryLink, Word } from '~/types'
import {
  detectDictionaryType,
  dictionaryLinksToString,
  ensureModernDictionaryLinks,
  extractDomainName,
  getDisplayNameForUrl,
  migrateDictionaryLinks,
  validateDictionaryLinks,
} from '../dictionaryMigration'

// Mock crypto.randomUUID for consistent test results
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-123',
  },
})

describe('dictionaryMigration', () => {
  describe('migrateDictionaryLinks', () => {
    it('returns empty array for undefined input', () => {
      expect(migrateDictionaryLinks(undefined)).toEqual([])
    })

    it('returns empty array for empty string', () => {
      expect(migrateDictionaryLinks('')).toEqual([])
    })

    it('returns empty array for whitespace-only string', () => {
      expect(migrateDictionaryLinks('   ')).toEqual([])
    })

    it('migrates single URL correctly', () => {
      const result = migrateDictionaryLinks('https://www.almaany.com/test')

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({
        id: 'test-uuid-123',
        type: DictionaryType.ALMANY,
        url: 'https://www.almaany.com/test',
        displayName: undefined,
      })
    })

    it('migrates multiple URLs correctly', () => {
      const input =
        'https://www.almaany.com/test, https://derja.ninja/word, https://example.com/custom'
      const result: DictionaryLink[] = migrateDictionaryLinks(input)

      expect(result).toHaveLength(3)
      expect(result[0]!.type).toBe(DictionaryType.ALMANY)
      expect(result[1]!.type).toBe(DictionaryType.DERJA_NINJA)
      expect(result[2]!.type).toBe(DictionaryType.CUSTOM)
    })

    it('filters out empty URLs after splitting', () => {
      const input = 'https://www.almaany.com/test,, ,https://derja.ninja/word'
      const result = migrateDictionaryLinks(input)

      expect(result).toHaveLength(2)
    })

    it('trims whitespace from URLs', () => {
      const input = '  https://www.almaany.com/test  ,  https://derja.ninja/word  '
      const result = migrateDictionaryLinks(input)

      expect(result).toHaveLength(2)
      expect(result[0]!.url).toBe('https://www.almaany.com/test')
      expect(result[1]!.url).toBe('https://derja.ninja/word')
    })
  })

  describe('detectDictionaryType', () => {
    it('detects AlMaany URLs', () => {
      expect(detectDictionaryType('https://www.almaany.com/test')).toBe(DictionaryType.ALMANY)
      expect(detectDictionaryType('http://almaany.com/test')).toBe(DictionaryType.ALMANY)
    })

    it('detects Living Arabic URLs', () => {
      expect(detectDictionaryType('https://livingarabic.com/test')).toBe(
        DictionaryType.LIVING_ARABIC
      )
      expect(detectDictionaryType('http://www.livingarabic.com/test')).toBe(
        DictionaryType.LIVING_ARABIC
      )
    })

    it('detects Derja Ninja URLs', () => {
      expect(detectDictionaryType('https://derja.ninja/test')).toBe(DictionaryType.DERJA_NINJA)
    })

    it('detects Reverso URLs', () => {
      expect(detectDictionaryType('https://context.reverso.net/test')).toBe(DictionaryType.REVERSO)
      expect(detectDictionaryType('https://reverso.com/test')).toBe(DictionaryType.REVERSO)
    })

    it('detects Wiktionary URLs', () => {
      expect(detectDictionaryType('https://en.wiktionary.org/test')).toBe(DictionaryType.WIKTIONARY)
      expect(detectDictionaryType('https://ar.wiktionary.org/test')).toBe(DictionaryType.WIKTIONARY)
    })

    it('returns CUSTOM for unknown URLs', () => {
      expect(detectDictionaryType('https://example.com/test')).toBe(DictionaryType.CUSTOM)
      expect(detectDictionaryType('https://unknown-dictionary.com/test')).toBe(
        DictionaryType.CUSTOM
      )
    })

    it('returns CUSTOM for invalid URLs', () => {
      expect(detectDictionaryType('not-a-url')).toBe(DictionaryType.CUSTOM)
      expect(detectDictionaryType('ftp://example.com')).toBe(DictionaryType.CUSTOM)
    })

    it('is case insensitive', () => {
      expect(detectDictionaryType('https://WWW.ALMAANY.COM/test')).toBe(DictionaryType.ALMANY)
      expect(detectDictionaryType('HTTPS://DERJA.NINJA/test')).toBe(DictionaryType.DERJA_NINJA)
    })
  })

  describe('getDisplayNameForUrl', () => {
    it('returns undefined for known dictionary types', () => {
      expect(getDisplayNameForUrl('https://www.almaany.com/test')).toBeUndefined()
      expect(getDisplayNameForUrl('https://derja.ninja/test')).toBeUndefined()
    })

    it('returns domain name for custom dictionary types', () => {
      expect(getDisplayNameForUrl('https://example.com/test')).toBe('example.com')
      expect(getDisplayNameForUrl('https://www.custom-dict.org/test')).toBe('custom-dict.org')
    })

    it('handles invalid URLs for custom type', () => {
      expect(getDisplayNameForUrl('not-a-url')).toBe('Custom Dictionary')
    })
  })

  describe('extractDomainName', () => {
    it('extracts domain name from valid URLs', () => {
      expect(extractDomainName('https://example.com/path')).toBe('example.com')
      expect(extractDomainName('http://www.test.org/long/path')).toBe('test.org')
    })

    it('removes www prefix', () => {
      expect(extractDomainName('https://www.example.com')).toBe('example.com')
    })

    it('handles URLs without www', () => {
      expect(extractDomainName('https://example.com')).toBe('example.com')
    })

    it('returns fallback for invalid URLs', () => {
      expect(extractDomainName('not-a-url')).toBe('Custom Dictionary')
      expect(extractDomainName('')).toBe('Custom Dictionary')
    })
  })

  describe('dictionaryLinksToString', () => {
    it('converts dictionary links to comma-separated string', () => {
      const links = [
        {
          id: '1',
          type: DictionaryType.ALMANY,
          url: 'https://www.almaany.com/test',
          displayName: 'AlMaany',
        },
        {
          id: '2',
          type: DictionaryType.CUSTOM,
          url: 'https://example.com/test',
          displayName: 'Custom',
        },
      ]

      const result = dictionaryLinksToString(links)
      expect(result).toBe('https://www.almaany.com/test, https://example.com/test')
    })

    it('returns empty string for empty array', () => {
      expect(dictionaryLinksToString([])).toBe('')
    })

    it('handles single link', () => {
      const links = [
        {
          id: '1',
          type: DictionaryType.ALMANY,
          url: 'https://www.almaany.com/test',
          displayName: 'AlMaany',
        },
      ]

      expect(dictionaryLinksToString(links)).toBe('https://www.almaany.com/test')
    })
  })

  describe('validateDictionaryLinks', () => {
    it('returns valid for empty array', () => {
      const result = validateDictionaryLinks([])
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('validates URLs correctly', () => {
      const links = [
        {
          id: '1',
          type: DictionaryType.ALMANY,
          url: 'https://www.almaany.com/test',
          displayName: 'AlMaany',
        },
      ]

      const result = validateDictionaryLinks(links)
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('reports error for missing URL', () => {
      const links = [
        {
          id: '1',
          type: DictionaryType.ALMANY,
          url: '',
          displayName: 'AlMaany',
        },
      ]

      const result = validateDictionaryLinks(links)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Dictionary link 1: URL is required')
    })

    it('reports error for invalid URL format', () => {
      const links = [
        {
          id: '1',
          type: DictionaryType.ALMANY,
          url: 'not-a-url',
          displayName: 'AlMaany',
        },
      ]

      const result = validateDictionaryLinks(links)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Dictionary link 1: Invalid URL format')
    })

    it('reports error for custom dictionary without display name', () => {
      const links = [
        {
          id: '1',
          type: DictionaryType.CUSTOM,
          url: 'https://example.com/test',
          displayName: '',
        },
      ]

      const result = validateDictionaryLinks(links)
      expect(result.valid).toBe(false)
      expect(result.errors).toContain(
        'Dictionary link 1: Display name is required for custom dictionaries'
      )
    })

    it('reports multiple errors for different links', () => {
      const links = [
        {
          id: '1',
          type: DictionaryType.ALMANY,
          url: '',
          displayName: 'AlMaany',
        },
        {
          id: '2',
          type: DictionaryType.CUSTOM,
          url: 'not-a-url',
          displayName: '',
        },
      ]

      const result = validateDictionaryLinks(links)
      expect(result.valid).toBe(false)
      expect(result.errors).toHaveLength(3)
      expect(result.errors).toContain('Dictionary link 1: URL is required')
      expect(result.errors).toContain('Dictionary link 2: Invalid URL format')
      expect(result.errors).toContain(
        'Dictionary link 2: Display name is required for custom dictionaries'
      )
    })
  })

  describe('ensureModernDictionaryLinks', () => {
    it('migrates old string format to new array format', () => {
      const oldWord = {
        id: '1',
        arabic: 'كتاب',
        dictionaryLinks: 'https://www.almaany.com/test, https://example.com/custom',
      } as unknown as Partial<Word>

      const result = ensureModernDictionaryLinks(oldWord)
      const dictionaryLinks = result.dictionaryLinks as DictionaryLink[]

      expect(Array.isArray(dictionaryLinks)).toBe(true)
      expect(dictionaryLinks).toHaveLength(2)
      expect(dictionaryLinks[0]!.type).toBe(DictionaryType.ALMANY)
      expect(dictionaryLinks[1]!.type).toBe(DictionaryType.CUSTOM)
    })

    it('ensures empty array when dictionaryLinks is missing', () => {
      const word = {
        id: '1',
        arabic: 'كتاب',
      }

      const result = ensureModernDictionaryLinks(word)

      expect(Array.isArray(result.dictionaryLinks)).toBe(true)
      expect(result.dictionaryLinks).toHaveLength(0)
    })

    it('ensures empty array when dictionaryLinks is null', () => {
      const word = {
        id: '1',
        arabic: 'كتاب',
        dictionaryLinks: null,
      } as unknown as Partial<Word>

      const result = ensureModernDictionaryLinks(word)

      expect(Array.isArray(result.dictionaryLinks)).toBe(true)
      expect(result.dictionaryLinks).toHaveLength(0)
    })

    it('preserves existing array format', () => {
      const modernWord = {
        id: '1',
        arabic: 'كتاب',
        dictionaryLinks: [
          {
            id: 'dict-1',
            type: DictionaryType.ALMANY,
            url: 'https://www.almaany.com/test',
            displayName: 'AlMaany',
          },
        ],
      }

      const result = ensureModernDictionaryLinks(modernWord)

      expect(result.dictionaryLinks).toEqual(modernWord.dictionaryLinks)
    })

    it('preserves other word properties', () => {
      const word = {
        id: '1',
        arabic: 'كتاب',
        translation: 'book',
        difficulty: 'BEGINNER',
        dictionaryLinks: 'https://www.almaany.com/test',
      } as unknown as Partial<Word>

      const result = ensureModernDictionaryLinks(word)

      expect(result.id).toBe('1')
      expect(result.arabic).toBe('كتاب')
      expect(result.translation).toBe('book')
      expect(result.difficulty).toBe('BEGINNER')
    })
  })
})
