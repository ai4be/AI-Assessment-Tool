import { renderWithTheme, renderWithThemeAndTranslations } from '@/util/test-utils'
import Index from '@/pages/index'
// use in memory mongodb
// TODO https://dev.to/remrkabledev/testing-with-mongodb-memory-server-4ja2

import { logRoles } from '@testing-library/dom'
// need to mock next-auth/react
// https://github.com/nextauthjs/next-auth/issues/775
import { useSession } from 'next-auth/react'

jest.mock('next-auth/react')
jest.mock('next/router', () => require('next-router-mock'))
// how to setup jest with next-i18next
// https://stackoverflow.com/questions/66973857/next-i18next-jest-testing-with-usetranslation
// jest.mock('react-i18next', () => ({
//   useTranslation: () => ({ t: (key: any) => key })
// }))

describe('Index page', () => {
  it('Renders the paragraphs', () => {
    (useSession as any).mockReturnValueOnce([false, false])
    const res = renderWithTheme(<Index />)
    logRoles(res.container)
    const { container } = res
    console.log(container.childNodes)
    console.log(container.innerHTML)
    const elements = container.querySelectorAll('p')
    const strings = []
    for (const e of elements) {
      console.log(e.innerHTML)
      strings.push(e.innerHTML)
    }
    // expect(strings).toContain('welcome:description-ai-assessment-tool-1')
    // expect(strings).toContain('welcome:description-ai-assessment-tool-2')
    // expect(strings).toContain('AI Assessment Tool')
  })

  // it('Translates the keys', () => {
  //   (useSession as any).mockReturnValueOnce([false, false])
  //   const res = renderWithThemeAndTranslations(<Index />)
  //   logRoles(res.container)
  //   const { container } = res
  //   const elements = container.querySelectorAll('p')
  //   const strings = []
  //   for (const e of elements) {
  //     console.log(e.innerHTML)
  //     strings.push(e.innerHTML)
  //   }
  //   expect(strings).toContain('welcome:description-ai-assessment-tool-1')
  //   expect(strings).toContain('welcome:description-ai-assessment-tool-2')
  //   expect(strings).toContain('AI Assessment Tool')
  // })
})
