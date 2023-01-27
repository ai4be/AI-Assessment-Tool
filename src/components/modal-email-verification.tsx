import React, { useState, useContext, useEffect } from 'react'
import {
  Button,
  Input,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalFooter
} from '@chakra-ui/react'
import { defaultFetchOptions, getResponseHandler, HTTP_METHODS } from '@/util/api'
import UserContext from '@/src/store/user-context'
import ToastContext from '@/src/store/toast-context'
import { isEmpty } from '@/util/index'

interface EmailVerificationModalProps {
  email?: string
  isUpdate?: boolean
  openModal?: boolean
  getTokenAtInit?: boolean
  canAskForNewToken?: boolean
  successCb?: () => void
  cancelCb?: () => void
  failCb?: () => void
  onCloseCb?: () => void
}

export const EmailVerificationModal = ({
  email, isUpdate = false, getTokenAtInit = false, successCb, cancelCb, failCb, onCloseCb, canAskForNewToken = false
}: EmailVerificationModalProps): JSX.Element => {
  const { user, triggerReloadUser } = useContext(UserContext)
  const { showToast } = useContext(ToastContext)
  const [isLoading, setIsLoading] = useState(false)
  const { onClose } = useDisclosure()

  const responseHandler = getResponseHandler(showToast)

  useEffect(() => {
    if (getTokenAtInit) {
      setIsLoading(true)
      void initiateEmailVerificationRequest().catch(() => setIsLoading(false))
    }
  }, [])

  useEffect(() => {
    if (isEmpty(values.email) && !isEmpty(user?.email)) {
      setValues({ ...values, email: user?.email })
    }
  }, [user?.email])

  const [values, setValues] = useState({
    email: email ?? user?.email ?? '',
    token: null
  })
  const [touched, setTouched] = useState({
    email: false,
    token: false
  })

  const closeFn = (): void => {
    onClose()
    if (onCloseCb != null) onCloseCb()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
    setTouchedWrapper(name, 800)
  }

  const setTouchedWrapper = (field: string, waitTimeMS = 0): void => {
    if (touched[field] !== true) {
      waitTimeMS > 0
        ? setTimeout(() => setTouchedWrapper(field, 0), waitTimeMS)
        : setTouched({ ...touched, [field]: true })
    }
  }

  const invalidateToken = async (): Promise<void> => {
    const { email } = values
    const url = `/api/users/${String(user?._id)}/email`
    await fetch(url, {
      ...defaultFetchOptions,
      method: HTTP_METHODS.DELETE,
      body: JSON.stringify({ email })
    })
  }

  const cancelTokenVerification = async (e): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    if (getTokenAtInit) await invalidateToken()
    setValues({ email: user?.email ?? '', token: null })
    closeFn()
    if (cancelCb != null) cancelCb()
    setIsLoading(false)
  }

  const finializeVerification = async (e): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    const { email, token } = values
    const data: any = {
      email,
      token
    }
    const url = `/api/users/${String(user?._id)}/email/validate`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data)
    })
    await responseHandler(response, isUpdate ? 'Email updated successfully' : 'Email verified successfully')
    if (response.ok) {
      await triggerReloadUser()
      closeFn()
      if (successCb != null) successCb()
    } else {
      if (failCb != null) failCb()
    }
    setIsLoading(false)
  }

  const initiateEmailVerificationRequest = async (e?): Promise<void> => {
    if (e?.preventDefault != null) e.preventDefault()
    setIsLoading(true)
    const { email } = values
    const data: any = {
      email
    }
    const url = `/api/users/${String(user?._id)}/email`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data)
    })
    await responseHandler(response)
    setIsLoading(false)
  }

  const askForNewToken = async (e): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    await invalidateToken()
    await initiateEmailVerificationRequest()
    setIsLoading(false)
  }

  return (
    <Modal onClose={closeFn} isOpen isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Email address verification</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            {isUpdate
              ? 'We have sent a verification code to your new email address. Please enter the code below to verify your new email address.'
              : 'We have sent a verification code to your email address. Please enter the code below to verify your email address.'}
          </Text>
          <Input placeholder='Code' name='token' onChange={handleChange} />
          {canAskForNewToken && (
            <Button onClick={askForNewToken} isLoading={isLoading} isDisabled={isLoading} mt='1.5' variant='link'>
              Ask for a new code
            </Button>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={finializeVerification} colorScheme='blue' isLoading={isLoading} isDisabled={isLoading || isEmpty(values.token)} mr='1.5'>
            Verify
          </Button>
          <Button onClick={cancelTokenVerification} isLoading={isLoading} isDisabled={isLoading}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default EmailVerificationModal
