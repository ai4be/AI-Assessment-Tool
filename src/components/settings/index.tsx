import React from 'react'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Center } from '@chakra-ui/react'
import PasswordSettings from '@/src/components/settings/password'
import Profile from '@/src/components/settings/profile'
import Email from '@/src/components/settings/email'

const Settings = (): JSX.Element => {
  return (
    <Tabs m="3">
      <TabList>
        <Tab>Profile</Tab>
        <Tab>Password</Tab>
        <Tab>E-mail</Tab>
      </TabList>
      <Center maxW={500}>
        <TabPanels boxShadow={0}>
          <TabPanel>
            <Profile />
          </TabPanel>
          <TabPanel>
            <PasswordSettings />
          </TabPanel>
          <TabPanel>
            <Email />
          </TabPanel>
        </TabPanels>
      </Center>
    </Tabs>
  )
}

export default Settings
