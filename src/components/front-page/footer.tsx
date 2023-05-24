import React, { ReactNode } from 'react'
import { Box, Flex, Text, Image, Button, useColorModeValue, VisuallyHidden } from '@chakra-ui/react'
import { FaGithub } from 'react-icons/fa'

const Logo = (): JSX.Element => {
  return (
    <>
      <div className='px-3 py-5 flex font-semibold text-lg cursor-pointer'>
        <a href='https://bosa.belgium.be' target='_blank' rel='noreferrer'>
          <Image src='/frontpage/bosa-logo.svg' alt='BOSA logo' height='30px' mr='2vh' />
        </a>
        <a href='https://ai4belgium.be' target='_blank' rel='noreferrer'>
          <Text> AI<sub className='icon-blue-color text-lg'>4</sub>Belgium</Text>
        </a>
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
    <Flex flexDirection='column' bgColor='transparent' color='white' pb='30%' mt='3em' alignItems='center'>
      <Logo />
      <Text textAlign='center'>With the support of <a href='https://michel.belgium.be/fr/cellule-strat%C3%A9gique-et-secr%C3%A9tariat' target='blank' className='text-pink-600'>cabinet Michel</a> and <a href='https://desutter.belgium.be/fr/contact' target='blank' className='text-pink-600'>cabinet De Sutter</a>.</Text>
      <Box mt='1em' />
      <SocialButton label='GitHub' href='https://github.com/ai4be/AI-Assessment-Tool'>
        <FaGithub />
      </SocialButton>
    </Flex>
  )
}
