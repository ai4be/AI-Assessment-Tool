import React from 'react'
import {
  Flex
} from '@chakra-ui/react'
import PasswordSettings from './password'
import Profile from './profile'

const Settings = (): JSX.Element => {
  return (
    <Flex ml='3'>
      <PasswordSettings />
      <Profile />
    </Flex>
  )
}

export default Settings
