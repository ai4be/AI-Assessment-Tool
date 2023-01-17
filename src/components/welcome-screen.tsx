import React from 'react'
import NavBar from '@/src/components/navbar'
import { Box, Image, Flex, Text } from '@chakra-ui/react'

const WelcomeScreen = (): JSX.Element => {
  return (
    <>
      <Box bgGradient='linear(darkblue, white)' height='100vh'>
        <NavBar bg='white' />
        <Flex
          alignItems='center'
          flexDirection={['column', 'column', 'row', 'row']}
          justifyContent='center'
          p='4rem'
        >
          <Box>
            <Title fontSize={['40px', '40px', '50px', '50px']} fontWeight='bold' lineHeight='50px'>
              AI Assessment Tool
            </Title>
            <Header
              fontSize={['1rem', '1rem', '1.5rem', '1.5rem']}
              width={['100%', '100%', '50%', '50%']}
            >
              Is your AI system Racists|Fair|Trustworthy|Safe|Secure|Privacy preserving|Ethical?
              Collaborate with your team to assess if your AI implementation follows ethical guidelines.
            </Header>
          </Box>
          <Box>
            <Image
              height={['200px', '300px', '400px', '500px']}
              src='/homepage/home-illustration.svg'
              alt='brand logo'
            />
          </Box>
        </Flex>
      </Box>
    </>
  )
}

export default WelcomeScreen
