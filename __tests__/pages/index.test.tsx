import { renderWithThemeAndTranslations } from '@/util/test-utils'
import Index from '@/pages/index'
// use in memory mongodb
// TODO https://dev.to/remrkabledev/testing-with-mongodb-memory-server-4ja2
// import { logRoles } from '@testing-library/dom'
import { useSession } from 'next-auth/react'
import enWelcomeJson from '@/public/locales/en/welcome.json'
import nlWelcomeJson from '@/public/locales/nl/welcome.json'

// need to mock next-auth/react
// https://github.com/nextauthjs/next-auth/issues/775
jest.mock('next-auth/react')
jest.mock('next/router', () => require('next-router-mock'))
// how to setup jest with next-i18next
// https://stackoverflow.com/questions/66973857/next-i18next-jest-testing-with-usetranslation
// jest.mock('react-i18next', () => ({
//   useTranslation: () => ({ t: (key: any) => key })
// }))

describe('Index page', () => {
  it('Renders the paragraphs', async () => {
    (useSession as any).mockReturnValueOnce([false, false])
    const { container } = await renderWithThemeAndTranslations(<Index />)
    const elements = container.querySelectorAll('p')
    const strings = []
    for (const e of elements) {
      strings.push(e.innerHTML)
    }
    expect(strings).toContain('AI Assessment Tool')
    const vals = Object.values(enWelcomeJson)
    for (const val of vals) {
      expect(strings).toContain(val)
    }
  })

  it('Translates the keys', async () => {
    (useSession as any).mockReturnValueOnce([false, false])
    const { container } = await renderWithThemeAndTranslations(<Index />, 'nl')
    const elements = container.querySelectorAll('p')
    const strings = []
    for (const e of elements) {
      strings.push(e.innerHTML)
    }
    expect(strings).toContain('AI Assessment Tool')
    const vals = Object.values(nlWelcomeJson)
    for (const val of vals) {
      expect(strings).toContain(val)
    }
  })
})
