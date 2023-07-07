module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/tests/**'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.*\\.ts$': 'ts-jest'
  },
  setupFiles: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1'
  }
}
