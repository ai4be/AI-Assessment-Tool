import { renderWithThemeAndTranslations } from '@/util/test-utils'
import Index from '@/pages/index'
// TODO test API routes
// https://seanconnolly.dev/unit-testing-nextjs-api-routes
// https://www.paigeniedringhaus.com/blog/how-to-unit-test-next-js-api-routes-with-typescript
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

const TOOL_TITLE = 'AI Assessment Tool'

const renderIndexAndAssert = async (valuesInHtml: string[], locale = 'en'): Promise<void> => {
  (useSession as any).mockReturnValueOnce([false, false])
  const { container } = await renderWithThemeAndTranslations(<Index />, locale)
  const elements = container.querySelectorAll('p')
  const strings = []
  for (const e of elements) {
    strings.push(e.innerHTML)
  }
  expect(strings).toContain(TOOL_TITLE)
  for (const val of valuesInHtml) {
    expect(strings).toContain(val)
  }
}

describe('Index page', () => {
  it('Renders the paragraphs with the default locale text values', async () => {
    const vals = Object.values(enWelcomeJson)
    await renderIndexAndAssert(vals)
  })

  it('Renders the paragraphs with the "nl" locale text values', async () => {
    const vals = Object.values(nlWelcomeJson)
    await renderIndexAndAssert(vals, 'nl')
  })
})
