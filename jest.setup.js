import { jest, beforeAll, afterAll } from '@jest/globals'
// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'

// https://stackoverflow.com/questions/69578860/referenceerror-textencoder-is-not-defined-in-github-actions-jest-script
global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder

const originalWarn = console.warn
const originalNodeEnv = process.env.NODE_ENV
const originalSaltRounds = process.env.SALT_ROUNDS

beforeAll(() => {
  // @ts-expect-error
  process.env.NODE_ENV = 'test'
  process.env.NEXTAUTH_URL = 'http://localhost'
  process.env.SALT_ROUNDS = 2 // for bcrypt set very low to speed up tests
  console.warn = jest.fn()
})

afterAll(() => {
  // @ts-expect-error
  process.env.NODE_ENV = originalNodeEnv
  process.env.SALT_ROUNDS = originalSaltRounds
  delete process.env.NEXTAUTH_URL
  console.warn = originalWarn
})
