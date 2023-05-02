import React, { ReactNode } from 'react'
import { Box, Text, Image, Stack, Button, useColorModeValue, Container, VisuallyHidden } from '@chakra-ui/react'
import { FaGithub, FaNewspaper } from 'react-icons/fa'

const Logo = (): JSX.Element => {
  return (
    <>
      <div className='px-3 py-5 flex font-semibold text-lg cursor-pointer'>
        <Image src='/frontpage/bosa-logo.svg' alt='BOSA logo' height='30px' mr='2vh' />
        <Text> AI<sub className='icon-blue-color text-lg'>4</sub>Belgium</Text>
      </div>
    </>
  )
}

const SocialButton = ({ children, label, href }: { children: ReactNode, label: string, href: string }): JSX.Element => {
  return (
    <Button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded='full'
      w={16}
      h={16}
      cursor='pointer'
      as='a'
      href={href}
      display='inline-flex'
      alignItems='center'
      justifyContent='center'
      transition='background 0.3s ease'
      variant='outline'
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Button>
  )
}

export const Footer = (): JSX.Element => {
  return (
    <Box bgColor='rgba(20, 17, 24)' color='white'>
      <Container
        as={Stack}
        maxW='6xl'
        py={4}
        direction={{ base: 'column', md: 'row' }}
        spacing={4}
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'center', md: 'center' }}
      >
        <Logo />
        <Text>Made with love ❤️ in Belgium</Text>
        <Stack direction='row' spacing={8}>
          <SocialButton label='GitHub' href='https://github.com/AI4Belgium/AI-Assessment-Tool'>
            <FaGithub />
          </SocialButton>
          <SocialButton label='Docs' href='#'>
            <FaNewspaper />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  )
}
