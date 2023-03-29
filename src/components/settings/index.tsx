import React from 'react'
import { Tabs, TabList, Tab, TabPanels, TabPanel, Center } from '@chakra-ui/react'
import PasswordSettings from '@/src/components/settings/password'
import Profile from '@/src/components/settings/profile'
import Email from '@/src/components/settings/email'
import NotificationSettings from './notification'
import { useTranslation } from 'next-i18next'

const Settings = (): JSX.Element => {
  const { t } = useTranslation()
  return (
    <Tabs m='3'>
      <TabList>
        <Tab>{t('settings:profile')}</Tab>
        <Tab>{t('settings:password')}</Tab>
        <Tab>{t('settings:email')}</Tab>
        <Tab>{t('settings:notifications')}</Tab>
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
          <TabPanel>
            <NotificationSettings />
          </TabPanel>
        </TabPanels>
      </Center>
    </Tabs>
  )
}

export default Settings
