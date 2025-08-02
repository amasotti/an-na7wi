import { describe, expect, it } from 'vitest'
import type {AxiosError, InternalAxiosRequestConfig} from 'axios'
import { isAxiosError } from '../axiosUtils'

describe('axiosUtils', () => {
  describe('isAxiosError', () => {
    it('should return true for valid AxiosError objects', () => {
      const axiosError: AxiosError = {
        isAxiosError: true,
        message: 'Request failed',
        name: 'AxiosError',
        config: {} as unknown as InternalAxiosRequestConfig,
        toJSON: () => ({}),
      }

      expect(isAxiosError(axiosError)).toBe(true)
    })

    it('should return false for regular Error objects', () => {
      const regularError = new Error('Regular error')

      expect(isAxiosError(regularError)).toBe(false)
    })

    it('should return false for objects without isAxiosError property', () => {
      const notAxiosError = {
        message: 'Some error',
        name: 'SomeError',
      }

      expect(isAxiosError(notAxiosError)).toBe(false)
    })

    it('should return false for null and undefined', () => {
      expect(isAxiosError(null)).toBe(false)
      expect(isAxiosError(undefined)).toBe(false)
    })

    it('should return false for primitive values', () => {
      expect(isAxiosError('string')).toBe(false)
      expect(isAxiosError(123)).toBe(false)
      expect(isAxiosError(true)).toBe(false)
    })

    it('should return false for objects with isAxiosError set to false', () => {
      const fakeAxiosError = {
        isAxiosError: false,
        message: 'Fake axios error',
      }

      expect(isAxiosError(fakeAxiosError)).toBe(false)
    })

    it('should handle objects with isAxiosError as truthy but not boolean true', () => {
      const ambiguousError = {
        isAxiosError: 'yes', // truthy but not boolean
        message: 'Ambiguous error',
      }

      expect(isAxiosError(ambiguousError)).toBe(true)
    })
  })
})
