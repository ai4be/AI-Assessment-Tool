import React from 'react'
import NavBar from '@/src/components/navbar'
import { Box, Image, Flex, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'

const WelcomeScreen = (): JSX.Element => {
  const { t } = useTranslation()
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
            <Text fontSize={['40px', '40px', '50px', '50px']} fontWeight='bold' lineHeight='50px'>
              AI Assessment Tool
            </Text>
            <Text
              fontSize={['1rem', '1rem', '1.5rem', '1.5rem']}
              width={['100%', '100%', '50%', '50%']}
            >{t('welcome:description-ai-assessment-tool-1')}
            </Text>
            <Text
              fontSize={['1rem', '1rem', '1.5rem', '1.5rem']}
              width={['100%', '100%', '50%', '50%']}
            >{t('welcome:description-ai-assessment-tool-2')}
            </Text>

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
