import React, { useState } from 'react'
import {
  Box, Heading, Button
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import DeleteAccountModal from '../project/modals/delete-account-modal'

const DeleteAccountSettings = (): JSX.Element => {
  const { t } = useTranslation()
  const [isLoading] = useState(false)
  const [isDisabled] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const cloaseModalCb = (): void => {
    setShowModal(false)
  }

  return (
    <>
      <Box p='2' height='fit-content' minW={300}>
        <Heading size='md'>{t('settings:delete-account')}</Heading>
        <Button
          fontWeight='semibold'
          width='full'
          mt={4}
          disabled={isDisabled}
          bg='danger'
          color='white'
          onClick={() => setShowModal(true)}
          isLoading={isLoading}
          loadingText={`${t('settings:deleting')}`}
        >
          {t('buttons:delete')}
        </Button>
      </Box>
      {showModal && <DeleteAccountModal onCloseCb={cloaseModalCb} />}
    </>
  )
}

export default DeleteAccountSettings
