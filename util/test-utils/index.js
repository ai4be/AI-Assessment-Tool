import React from 'react'
import { render, renderHook, act } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@/pages/_app'
import { I18nextProvider, useTranslation } from 'react-i18next'
// import { appWithTranslation } from 'next-i18next'


// import i18n from 'i18next'
// import { initReactI18next } from 'react-i18next'
// import { createConfig } from 'next-i18next/dist/commonjs/config/createConfig'
// import i18NextConfig from '../../next-i18next.config'
// const locale = i18NextConfig.i18n.defaultLocale;

// console.log(i18NextConfig)

// const i18Config = createConfig({ i18NextConfig, lng: locale })

// console.log(i18Config)

// i18n.use(initReactI18next).init({
//   ...i18Config,
//   debug: false
// })

// export const renderWithTheme = ui => {
//   const Wrapper = ({ children }) => (
//     <ChakraProvider theme={theme}>{children}</ChakraProvider>
//   )
//   return render(ui, { wrapper: appWithTranslation(Wrapper, i18Config) })
// }

export const renderWithTheme = (ui, locale = 'en') => {
  const t = renderHook(() => useTranslation('welcome'))
  act(() => {
    console.log("t", t)
    t.result.current.i18n.changeLanguage(locale)
    console.log(t.result.current.i18n.getResourceBundle(locale))
  })
  const Wrapper = ({ children }) => {
    return (
      <ChakraProvider theme={theme}><I18nextProvider i18n={t.result.current.i18n}>{children}</I18nextProvider></ChakraProvider>
    )
  }
  return render(ui, { wrapper: Wrapper })
}
