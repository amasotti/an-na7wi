import { describe, expect, it } from 'vitest'
import { formatDate } from './dateUtils'

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats ISO date string correctly', () => {
      const dateString = '2024-01-15T10:30:00Z'
      const result = formatDate(dateString)
      expect(result).toBe('15 Jan 2024');
    })

    it('formats date with time correctly', () => {
      const dateString = '2023-12-25T18:45:30Z'
      const result = formatDate(dateString)
      expect(result).toBe('25 Dec 2023')
    })

    it('formats date without time correctly', () => {
      const dateString = '2024-06-01'
      const result = formatDate(dateString)
      expect(result).toBe('1 Jun 2024')
    })

    it('handles different month formats', () => {
      const february = '2024-02-29T00:00:00Z'
      const august = '2024-08-05T12:00:00Z'

      expect(formatDate(february)).toBe('29 Feb 2024')
      expect(formatDate(august)).toBe('5 Aug 2024')
    })

    it('handles leap year correctly', () => {
      const leapYear = '2024-02-29T00:00:00Z'
      const result = formatDate(leapYear)
      expect(result).toBe('29 Feb 2024')
    })

    it('formats single digit days correctly', () => {
      const singleDigitDay = '2024-03-05T00:00:00Z'
      const result = formatDate(singleDigitDay)
      expect(result).toBe('5 Mar 2024')
    })
  })
})
