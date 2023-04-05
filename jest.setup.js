// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { createConfig } from 'next-i18next/dist/commonjs/config/createConfig'
import i18NextConfig from './next-i18next.config'
const locale = i18NextConfig.i18n.defaultLocale

console.log(i18NextConfig)

const i18Config = createConfig({ i18NextConfig, lng: locale })

console.log(i18Config)

i18n.use(initReactI18next).init({
  ...i18Config,
  debug: false
})
