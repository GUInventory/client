module.exports = {
  verbose: true,
  projects: [
    {
      displayName: 'e2e',
      preset: 'jest-playwright-preset',
      testMatch: ['<rootDir>/tests/**/*.test.js'],
    },
  ],
}
