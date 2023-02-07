import React from 'react'
import {
  Flex
} from '@chakra-ui/react'
import PasswordSettings from '@/src/components/settings/password'
import Profile from '@/src/components/settings/profile'
import Email from '@/src/components/settings/email'

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
