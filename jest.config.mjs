// jest.config.mjs
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: 'jest-environment-jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // testTimeout: 10000,
  // other config settings
  // transform: {
  //   '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest'
  // }
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
