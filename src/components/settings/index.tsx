import React from 'react'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import PasswordSettings from '@/src/components/settings/password'
import Profile from '@/src/components/settings/profile'
import Email from '@/src/components/settings/email'

const Settings = (): JSX.Element => {
  return (
    <Tabs m="3" variant="enclosed">
      <TabList>
        <Tab>Profile</Tab>
        <Tab>Password</Tab>
        <Tab>E-mail</Tab>
      </TabList>
      <TabPanels>
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
    </Tabs>
  )
}

export default Settings
