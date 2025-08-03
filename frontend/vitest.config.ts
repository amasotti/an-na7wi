import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
    test: {
        environment: 'nuxt',
        globals: true,
        coverage: {
            provider: 'v8',
            enabled: false,
            thresholds: {
                statements: 80,
                branches: 80,
                functions: 80,
                lines: 80,
            },
            exclude: [
                '**/node_modules/**',
                '**/dist/**',
                '**/coverage/**',
                '**/tests/**',
                '**/test-utils/**',
                '**/vitest.config.ts',
                '**/vitest.setup.ts',
        ]
        },
    },
})
