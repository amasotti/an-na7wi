import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import router from '../index'

describe('router', () => {
  describe('route configuration', () => {
    it('should have correct number of routes', () => {
      expect(router.options.routes).toHaveLength(7)
    })

    it('should have home route configured correctly', () => {
      const homeRoute = router.options.routes.find(route => route.name === 'home')

      expect(homeRoute).toBeDefined()
      expect(homeRoute?.path).toBe('/')
      expect(homeRoute?.name).toBe('home')
      expect(homeRoute?.component).toBeDefined()
    })

    it('should have texts route configured correctly', () => {
      const textsRoute = router.options.routes.find(route => route.name === 'texts')

      expect(textsRoute).toBeDefined()
      expect(textsRoute?.path).toBe('/texts')
      expect(textsRoute?.name).toBe('texts')
      expect(typeof textsRoute?.component).toBe('function') // lazy-loaded
    })

    it('should have text-detail route configured correctly', () => {
      const textDetailRoute = router.options.routes.find(route => route.name === 'text-detail')

      expect(textDetailRoute).toBeDefined()
      expect(textDetailRoute?.path).toBe('/texts/:id')
      expect(textDetailRoute?.name).toBe('text-detail')
      expect(textDetailRoute?.props).toBe(true)
      expect(typeof textDetailRoute?.component).toBe('function') // lazy-loaded
    })

    it('should have vocabulary route configured correctly', () => {
      const vocabularyRoute = router.options.routes.find(route => route.name === 'vocabulary')

      expect(vocabularyRoute).toBeDefined()
      expect(vocabularyRoute?.path).toBe('/vocabulary')
      expect(vocabularyRoute?.name).toBe('vocabulary')
      expect(typeof vocabularyRoute?.component).toBe('function') // lazy-loaded
    })

    it('should have search route configured correctly', () => {
      const searchRoute = router.options.routes.find(route => route.name === 'search')

      expect(searchRoute).toBeDefined()
      expect(searchRoute?.path).toBe('/search')
      expect(searchRoute?.name).toBe('search')
      expect(typeof searchRoute?.component).toBe('function') // lazy-loaded
    })

    it('should have analytics route configured correctly', () => {
      const analyticsRoute = router.options.routes.find(route => route.name === 'analytics')

      expect(analyticsRoute).toBeDefined()
      expect(analyticsRoute?.path).toBe('/analytics')
      expect(analyticsRoute?.name).toBe('analytics')
      expect(typeof analyticsRoute?.component).toBe('function') // lazy-loaded
    })

    it('should have not-found route configured correctly', () => {
      const notFoundRoute = router.options.routes.find(route => route.name === 'not-found')

      expect(notFoundRoute).toBeDefined()
      expect(notFoundRoute?.path).toBe('/:pathMatch(.*)*')
      expect(notFoundRoute?.name).toBe('not-found')
      expect(typeof notFoundRoute?.component).toBe('function') // lazy-loaded
    })
  })

  describe('route navigation', () => {
    it('should navigate to home route', async () => {
      const testRouter = createRouter({
        history: createMemoryHistory(),
        routes: router.options.routes,
      })

      await testRouter.push('/')
      expect(testRouter.currentRoute.value.name).toBe('home')
      expect(testRouter.currentRoute.value.path).toBe('/')
    })

    it('should navigate to texts route', async () => {
      const testRouter = createRouter({
        history: createMemoryHistory(),
        routes: router.options.routes,
      })

      await testRouter.push('/texts')
      expect(testRouter.currentRoute.value.name).toBe('texts')
      expect(testRouter.currentRoute.value.path).toBe('/texts')
    })

    it('should navigate to text detail route with params', async () => {
      const testRouter = createRouter({
        history: createMemoryHistory(),
        routes: router.options.routes,
      })

      await testRouter.push('/texts/123')
      expect(testRouter.currentRoute.value.name).toBe('text-detail')
      expect(testRouter.currentRoute.value.path).toBe('/texts/123')
      expect(testRouter.currentRoute.value.params.id).toBe('123')
    })

    it('should navigate to vocabulary route', async () => {
      const testRouter = createRouter({
        history: createMemoryHistory(),
        routes: router.options.routes,
      })

      await testRouter.push('/vocabulary')
      expect(testRouter.currentRoute.value.name).toBe('vocabulary')
      expect(testRouter.currentRoute.value.path).toBe('/vocabulary')
    })

    it('should navigate to search route', async () => {
      const testRouter = createRouter({
        history: createMemoryHistory(),
        routes: router.options.routes,
      })

      await testRouter.push('/search')
      expect(testRouter.currentRoute.value.name).toBe('search')
      expect(testRouter.currentRoute.value.path).toBe('/search')
    })

    it('should navigate to analytics route', async () => {
      const testRouter = createRouter({
        history: createMemoryHistory(),
        routes: router.options.routes,
      })

      await testRouter.push('/analytics')
      expect(testRouter.currentRoute.value.name).toBe('analytics')
      expect(testRouter.currentRoute.value.path).toBe('/analytics')
    })

    it('should handle unknown routes with not-found', async () => {
      const testRouter = createRouter({
        history: createMemoryHistory(),
        routes: router.options.routes,
      })

      await testRouter.push('/unknown-route')
      expect(testRouter.currentRoute.value.name).toBe('not-found')
      expect(testRouter.currentRoute.value.path).toBe('/unknown-route')
    })

    it('should handle nested unknown routes with not-found', async () => {
      const testRouter = createRouter({
        history: createMemoryHistory(),
        routes: router.options.routes,
      })

      await testRouter.push('/some/deeply/nested/unknown/path')
      expect(testRouter.currentRoute.value.name).toBe('not-found')
      expect(testRouter.currentRoute.value.path).toBe('/some/deeply/nested/unknown/path')
    })
  })

  describe('route parameters', () => {
    it('should pass props to text-detail route', async () => {
      const testRouter = createRouter({
        history: createMemoryHistory(),
        routes: router.options.routes,
      })

      await testRouter.push('/texts/abc-123')

      const textDetailRoute = router.options.routes.find(route => route.name === 'text-detail')
      expect(textDetailRoute?.props).toBe(true)
      expect(testRouter.currentRoute.value.params.id).toBe('abc-123')
    })

    it('should handle special characters in text ID', async () => {
      const testRouter = createRouter({
        history: createMemoryHistory(),
        routes: router.options.routes,
      })

      await testRouter.push('/texts/text-with-dashes-123')
      expect(testRouter.currentRoute.value.name).toBe('text-detail')
      expect(testRouter.currentRoute.value.params.id).toBe('text-with-dashes-123')
    })
  })
})
