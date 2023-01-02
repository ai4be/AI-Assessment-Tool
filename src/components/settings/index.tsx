import React from 'react'
import {
  Flex
} from '@chakra-ui/react'
import PasswordSettings from './password'
import Profile from './profile'
import Email from './email'

const Settings = (): JSX.Element => {
  return (
    <Flex ml='3'>
      <PasswordSettings />
      <Profile />
      <Email />
    </Flex>
  )
}

export default Settings
