import { Box } from '@chakra-ui/react'
import React from 'react'
import { Content } from './content'
import { Footer } from './footer'
import { AI4BelgiumHeader } from './header'

const FrontPage = (): JSX.Element => {
  const css = `body {
    background-color: rgba(14,16,18)
  }`
  return (
    <>
      <style>
        {css}
      </style>
      <AI4BelgiumHeader />
      <Box height='100%'>
        <Content />
        <Footer />
      </Box>
    </>
  )
}

export default FrontPage
