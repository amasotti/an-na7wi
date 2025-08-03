import { type RenderOptions, render } from '@testing-library/vue'
import { vi } from 'vitest'
import type { Component } from 'vue'

// Custom render function - Nuxt environment handles Pinia automatically
export function renderWithStore(component: Component, options: RenderOptions<Component> = {}) {
  return render(component, {
    global: {
      stubs: {
        NuxtLink: {
          template: '<a><slot /></a>',
        },
        ...options.global?.stubs,
      },
      ...options.global,
    },
    ...options,
  })
}

// Mock router composable
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
}

export const mockRoute = {
  path: '/',
  query: {},
  params: {},
  name: 'index',
}
