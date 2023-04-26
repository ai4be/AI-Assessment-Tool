import React, { useState, useContext, MouseEventHandler } from 'react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalFooter,
  UnorderedList,
  ListItem
} from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import { signOut } from 'next-auth/react'
import { defaultFetchOptions, getResponseHandler, HTTP_METHODS } from '@/util/api'
import UserContext from '@/src/store/user-context'
import ToastContext from '@/src/store/toast-context'
import { useRouter } from 'next/router'

interface EmailVerificationModalProps {
  openModal?: boolean
  successCb?: () => void
  cancelCb?: () => void
  failCb?: () => void
  onCloseCb?: () => void
}

export const DeleteAccountModal = ({ successCb, cancelCb, failCb, onCloseCb }: EmailVerificationModalProps): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const { user } = useContext(UserContext)
  const { showToast } = useContext(ToastContext)
  const [isLoading, setIsLoading] = useState(false)
  const { onClose } = useDisclosure()

  const responseHandler = getResponseHandler(showToast, t)

  const closeFn = (): void => {
    onClose()
    if (onCloseCb != null) onCloseCb()
  }

  const cancelAccountDeletion: MouseEventHandler = (e: React.MouseEvent<Element, MouseEvent>): void => {
    e.preventDefault()
    setIsLoading(true)
    closeFn()
    if (cancelCb != null) cancelCb()
    setIsLoading(false)
  }

  const confirmAccountDeletion = async (e: React.MouseEvent<Element, MouseEvent>): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    const url = `/api/users/${String(user?._id)}/account`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: HTTP_METHODS.DELETE
    })
    await responseHandler(response, `${t('settings:account-deleted-successfully')}`)
    if (response.ok) {
      await signOut()
      await redirectToLoginPage()
      closeFn()
      if (successCb != null) successCb()
    } else {
      if (failCb != null) failCb()
    }
    setIsLoading(false)
  }

  const redirectToLoginPage = async (path = '/login'): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    await router.push({
      pathname: path
    })
  }

  return (
    <Modal onClose={closeFn} isOpen isCentered>
      <ModalOverlay />
      <ModalContent mr='2' ml='2'>
        <ModalHeader>{t('settings:about-to-delete-account')}</ModalHeader>
        <ModalCloseButton onClick={cancelAccountDeletion} />
        <ModalBody>
          <UnorderedList>
            <ListItem>{t('settings:delete-account-message1')}</ListItem>
            <ListItem>{t('settings:delete-account-message2')}</ListItem>
            <ListItem>{t('settings:delete-account-message3')}</ListItem>
          </UnorderedList>
        </ModalBody>
        <ModalFooter>
          <Button onClick={confirmAccountDeletion} colorScheme='red' isLoading={isLoading} isDisabled={isLoading} mr='1.5'>
            {t('buttons:delete')}
          </Button>
          <Button onClick={cancelAccountDeletion} isLoading={isLoading} isDisabled={isLoading}>
            {t('buttons:cancel')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteAccountModal
