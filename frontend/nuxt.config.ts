import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  app: {
    head: {
      title: 'An-Nahwi Learning Arabic',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'An-Nahwi Learning Arabic Help tools' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
  sourcemap: false,
  ssr: false,
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-08-02',
  srcDir: '.',
  imports: {
    autoImport: true,
  },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxt/test-utils/module'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8080/api/v1',
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    server: {
      strictPort: true,
      watch: {
        usePolling: true,
      },
    },
  },
})
