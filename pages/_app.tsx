import React from 'react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import '@/src/styles/default.css'
import PropTypes from 'prop-types'
import Head from 'next/head'
import NextNprogress from 'nextjs-progressbar'
import { SessionProvider } from 'next-auth/react'
import { ToastContextProvider } from '@/src/store/toast-context'

import 'nprogress/nprogress.css'

const theme = extendTheme({
  colors: {
    brand: '#0079bf',
    success: '#70b500',
    danger: '#eb5a46',
    info: '#ff9f1a',
    warning: '#f2d600',
    darkblue: '#eae6ff',
    lightblue: '#f2faf9',
    performance: '#0079bf',
    bug: '#eb5a46',
    feature: '#61bd4f',
    information: '#ff9f1a'
  }
})

const App = ({ Component, pageProps }): JSX.Element => {
  return (
    <>
      <Head>
        <title>AI Assessment Tool</title>
        <link rel='icon' href='/favicon.ico' />
        <link rel='manifest' type='image/x-icon' href='/site.webmanifest' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
      </Head>
      <NextNprogress color='#0079bf' startPosition={0.3} stopDelayMs={200} height={4} />
      <ChakraProvider theme={theme}>
        <ToastContextProvider>
          <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
          </SessionProvider>
        </ToastContextProvider>
      </ChakraProvider>
    </>
  )
}

App.propTypes = {
  pageProps: PropTypes.object
}

export default App
