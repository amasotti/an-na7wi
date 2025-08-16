import { beforeEach, describe, expect, it, vi } from 'vitest'
import { openLink } from './linkUtils'

describe('linkUtils', () => {
  const mockWindowOpen = vi.fn()
  const mockLocationHref = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    Object.defineProperty(window, 'open', {
      value: mockWindowOpen,
      writable: true,
    })

    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
      configurable: true,
    })

    Object.defineProperty(window.location, 'href', {
      set: mockLocationHref,
      configurable: true,
    })

    // Mock console.error to avoid test output noise
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('openLink', () => {
    it('opens valid URL in new tab by default', () => {
      const url = 'https://example.com'
      openLink(url)

      expect(mockWindowOpen).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer')
    })

    it('opens valid URL in specified target', () => {
      const url = 'https://example.com'
      const target = 'custom-target'
      openLink(url, target)

      expect(mockWindowOpen).toHaveBeenCalledWith(url, target)
    })

    it('opens URL in same window when target is _self', () => {
      const url = 'https://example.com'
      openLink(url, '_self')

      expect(mockLocationHref).toHaveBeenCalledWith(url)
      expect(mockWindowOpen).not.toHaveBeenCalled()
    })

    it('opens URL in new tab when target is _blank', () => {
      const url = 'https://example.com'
      openLink(url, '_blank')

      expect(mockWindowOpen).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer')
    })

    it('does not open invalid URL and logs error', () => {
      const invalidUrl = 'not-a-url'
      openLink(invalidUrl)

      expect(console.error).toHaveBeenCalledWith('Invalid URL:', invalidUrl)
      expect(mockWindowOpen).not.toHaveBeenCalled()
      expect(mockLocationHref).not.toHaveBeenCalled()
    })

    it('handles empty URL gracefully', () => {
      openLink('')

      expect(mockWindowOpen).not.toHaveBeenCalled()
      expect(mockLocationHref).not.toHaveBeenCalled()
      expect(console.error).not.toHaveBeenCalled()
    })

    it('handles null/undefined URL gracefully', () => {
      // @ts-expect-error - Testing null and undefined handling
      // biome-ignore lint/suspicious/noExplicitAny: testing null and undefined handling
      openLink(null as any)
      // @ts-expect-error - Testing null and undefined handling
      // biome-ignore lint/suspicious/noExplicitAny: testing null and undefined handling
      openLink(undefined as any)

      expect(mockWindowOpen).not.toHaveBeenCalled()
      expect(mockLocationHref).not.toHaveBeenCalled()
      expect(console.error).not.toHaveBeenCalled()
    })

    it('handles relative URLs correctly', () => {
      const relativeUrl = '/path/to/page'
      openLink(relativeUrl)

      expect(console.error).toHaveBeenCalledWith('Invalid URL:', relativeUrl)
      expect(mockWindowOpen).not.toHaveBeenCalled()
    })

    it('handles URLs with different protocols', () => {
      const ftpUrl = 'ftp://files.example.com'
      const httpsUrl = 'https://secure.example.com'
      const httpUrl = 'http://example.com'

      openLink(ftpUrl)
      expect(mockWindowOpen).toHaveBeenCalledWith(ftpUrl, '_blank', 'noopener,noreferrer')

      openLink(httpsUrl)
      expect(mockWindowOpen).toHaveBeenCalledWith(httpsUrl, '_blank', 'noopener,noreferrer')

      openLink(httpUrl)
      expect(mockWindowOpen).toHaveBeenCalledWith(httpUrl, '_blank', 'noopener,noreferrer')
    })

    it('validates URL format before attempting to open', () => {
      const malformedUrl = 'https://malformed url with spaces'
      openLink(malformedUrl)

      expect(console.error).toHaveBeenCalledWith('Invalid URL:', malformedUrl)
      expect(mockWindowOpen).not.toHaveBeenCalled()
    })
  })
})
