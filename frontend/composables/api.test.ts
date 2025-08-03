import { describe, expect, it, vi } from 'vitest'
import { useApiClient } from './api'

vi.mock('#app', () => ({
  useNuxtApp: () => ({ $apiClient: { get: vi.fn(), post: vi.fn() } }),
}))

describe('useApiClient', () => {
  it('returns the $apiClient from Nuxt app context', () => {
    const apiClient = useApiClient()
    expect(apiClient).toHaveProperty('get')
    expect(apiClient).toHaveProperty('post')
  })
})
