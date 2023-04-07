// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'

// https://stackoverflow.com/questions/69578860/referenceerror-textencoder-is-not-defined-in-github-actions-jest-script
global.TextEncoder = require('util').TextEncoder
global.TextDecoder = require('util').TextDecoder

jest.mock('nodemailer', () => require('nodemailer-mock'))
