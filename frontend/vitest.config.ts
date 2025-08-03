import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      enabled: true,
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.output/**',
        '**/coverage/**',
        '**/test/**',
        '**/tests/**',
        '**/test-utils/**',
        '**/*.config.ts',
        '**/*.config.js',
        '**/vitest.config.ts',
        '**/vitest.setup.ts',
        '**/*.d.ts',
        'types/**',
        'plugins/**',
        'middleware/**',
        'layouts/**',
        'pages/**',
        'error.vue',
        'app.vue',
        'nuxt.config.ts',
        '.nuxt/**',
      ],
    },
  },
})
