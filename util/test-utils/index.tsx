import React from 'react'
import { render, renderHook, act, RenderResult } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@/pages/_app'
import { I18nextProvider, useTranslation, initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import { createConfig } from 'next-i18next/dist/commonjs/config/createConfig'
// import CreateClient from 'next-i18next/dist/commonjs/createClient'
import i18NextConfig from '../../next-i18next.config'
import i18nextFSBackend from 'i18next-fs-backend'

const namespaces = [
  'api-messages',
  'buttons',
  'column-dashboard',
  'common',
  'dialogs',
  'exceptions',
  'filter-sort',
  'img-input',
  'links',
  'login',
  'navbar',
  'placeholders',
  'project-settings',
  'projects',
  'reset-password',
  'settings',
  'sidebar',
  'signup',
  'titles',
  'validations',
  'welcome'
]

let initTranslationPromise: Promise<void> | null = null

export const initTranslations = async (): Promise<void> => {
  if (initTranslationPromise != null) return await initTranslationPromise
  else {
    const locale = i18NextConfig.i18n.defaultLocale
    const i18Config = createConfig({ i18NextConfig, lng: locale })
    await i18n.use(initReactI18next).use(i18nextFSBackend).init({
      ...i18Config,
      debug: false,
      preload: ['en', 'fr', 'nl']
    })
    await new Promise(resolve => i18n.loadResources(resolve))
    initTranslationPromise = new Promise(async (resolve) => await i18n.loadNamespaces(namespaces, resolve))
    return await initTranslationPromise
  }
}

export const renderWithThemeAndTranslations = async (ui: JSX.Element, locale = 'en'): Promise<RenderResult> => {
  await initTranslations()
  const t = renderHook(() => useTranslation())
  await act(async () => {
    // console.log("t", t)
    await t.result.current.i18n.changeLanguage(locale)
    // console.log(t.result.current.i18n.getResourceBundle(locale, 'welcome'))
  })
  const Wrapper = ({ children }: { children: any }): JSX.Element => {
    return (
      <ChakraProvider theme={theme}><I18nextProvider i18n={t.result.current.i18n}>{children}</I18nextProvider></ChakraProvider>
    )
  }
  return render(ui, { wrapper: Wrapper })
}
