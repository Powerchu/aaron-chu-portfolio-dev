const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        module: 'commonjs',
        moduleResolution: 'node',
      },
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^#site/content$': '<rootDir>/.velite',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testMatch: ['<rootDir>/tests/unit/**/*.test.(ts|tsx)'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    // Pages are integration-tested via Playwright E2E, not unit tests.
    // Excluding them from coverage keeps the unit-test threshold meaningful.
    '!**/app/page.tsx',
    '!**/app/**/page.tsx',
    '!**/app/projects/[slug]/page.tsx',
    // Programmatic icons (OG image routes, favicons) are declarative.
    '!**/app/icon.tsx',
    '!**/app/apple-icon.tsx',
    '!**/app/og/**',
    // Sitemap, robots, API catch-all are declarative or tested via integration.
    '!**/app/sitemap.ts',
    '!**/app/robots.ts',
    '!**/app/api/**/route.ts',
    // Root layout wraps providers; tested via E2E.
    '!**/app/layout.tsx',
  ],
}

export default config
