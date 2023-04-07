import React from 'react'
import { render, renderHook, act, RenderResult, Queries } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from '@/pages/_app'
import { I18nextProvider, useTranslation, initReactI18next } from 'react-i18next'
import i18n from 'i18next'
import { createConfig } from 'next-i18next/dist/commonjs/config/createConfig'
// import CreateClient from 'next-i18next/dist/commonjs/createClient'
import i18NextConfig from '../../next-i18next.config'
import i18nextFSBackend from 'i18next-fs-backend'
import { faker } from '@faker-js/faker'
import { createUser } from '@/src/models/user'
import { User } from '@/src/types/user'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { connectToDatabase } from '@/src/models/mongodb'
import { MongoClient } from 'mongodb'
import { hashPassword } from '@/util/auth'

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
    initTranslationPromise = new Promise(resolve => {
      void i18n.loadNamespaces(namespaces, resolve)
    })
    return await initTranslationPromise
  }
}

export const renderWithThemeAndTranslations = async (ui: JSX.Element, locale = 'en'): Promise<RenderResult<Queries, HTMLElement, HTMLElement>> => {
  await initTranslations()
  const t = renderHook(() => useTranslation())
  await act(async () => {
    await t.result.current.i18n.changeLanguage(locale)
  })
  const Wrapper = ({ children }: { children: any }): JSX.Element => {
    return (
      <ChakraProvider theme={theme}><I18nextProvider i18n={t.result.current.i18n}>{children}</I18nextProvider></ChakraProvider>
    )
  }
  return render(ui, { wrapper: Wrapper })
}

export const setupMongoDB = (): { mongoServer: MongoMemoryServer | null, client: MongoClient | null } => {
  const context: { mongoServer: MongoMemoryServer | null, client: MongoClient | null } = {
    mongoServer: null,
    client: null
  }
  beforeEach(async () => {
    // https://dev.to/remrkabledev/testing-with-mongodb-memory-server-4ja2
    context.mongoServer = await MongoMemoryServer.create()
    const uri = context.mongoServer.getUri()
    const clientAndDB = await connectToDatabase(uri, faker.random.word())
    context.client = clientAndDB.client
  })
  afterEach(async () => {
    await context.client?.close()
    await context.mongoServer?.stop()
  })
  return context
}

export const givenAUser = async (data = {}): Promise<Partial<User>> => {
  const user = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password()
  }
  await createUser({ ...user, password: await hashPassword(user.password) })
  return user
}
