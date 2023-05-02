import { Box } from '@chakra-ui/react'
import React from 'react'
import { Content } from './content'
import { Footer } from './footer'
import { AI4BelgiumHeader } from './header'

const FrontPage = (): JSX.Element => {
  return (
    <>
      <AI4BelgiumHeader />
      <Box height='100%'>
        <Content />
        <Footer />
      </Box>
    </>
  )
}

export default FrontPage
