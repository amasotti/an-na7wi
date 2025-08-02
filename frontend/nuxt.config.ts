import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
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
