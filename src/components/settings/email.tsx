import React, { useState, useEffect, useContext } from 'react'
import {
  Box, Heading, FormControl, Button,
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
import { defaultFetchOptions } from '@/util/api'
import { isEmailValid } from '@/util/validator'
import UserContext from '@/src/store/user-context'
import ToastContext from '@/src/store/toast-context'
import { isEmpty } from '@/util/index'

const EmailSettings = (): JSX.Element => {
  const { user, triggerReloadUser } = useContext(UserContext)
  const { showToast } = useContext(ToastContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [emailErr, setEmailErr] = useState(false)

  const [values, setValues] = useState({
    email: user?.email ?? '',
    token: null
  })
  const [touched, setTouched] = useState({
    email: false,
    token: false
  })

  useEffect(() => {
    setValues({
      ...values,
      email: user?.email ?? ''
    })
  }, [user, user?.email])

  useEffect(() => {
    setIsDisabled(user?.email === values.email)
  }, [user?.email, values.email])

  useEffect(() => {
    if (!touched.email) return
    setEmailErr(!isEmailValid(values.email))
  }, [values.email, touched.email])

  const setTouchedWrapper = (field: string, waitTimeMS = 0): void => {
    if (touched[field] !== true) {
      waitTimeMS > 0
        ? setTimeout(() => setTouchedWrapper(field, 0), waitTimeMS)
        : setTouched({ ...touched, [field]: true })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
    setTouchedWrapper(name, 800)
  }

  const handleTouch = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name } = e.target
    setTouched({ ...touched, [name]: true })
  }

  const initiateEmailChangeRequest = async (e): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    const { email } = values
    const data: any = {
      email
    }
    const url = `/api/users/${String(user?._id)}/email`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'POST',
      body: JSON.stringify(data)
    })
    if (response.ok) {
      onOpen()
    } else {
      let msg = 'Something went wrong'
      try {
        const result = await response.json()
        msg = result.message ?? msg
      } catch (error) {}
      showToast({
        title: msg,
        status: 'error'
      })
    }
    setIsLoading(false)
  }

  const cancelEmailChangeRequest = async (e): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    const { email } = values
    const data: any = {
      email
    }
    const url = `/api/users/${String(user?._id)}/email`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'DELETE',
      body: JSON.stringify(data)
    })
    setValues({ email: user?.email ?? '', token: null })
    if (response.ok) {
      onClose()
      showToast({
        title: 'Email update cancelled',
        status: 'success'
      })
    } else {
      let msg = 'Something went wrong'
      try {
        const result = await response.json()
        msg = result.message ?? msg
      } catch (error) {}
      showToast({
        title: msg,
        status: 'error'
      })
    }
    setIsLoading(false)
  }

  const finializeEmailChangeRequest = async (e): Promise<void> => {
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
      method: 'POST',
      body: JSON.stringify(data)
    })
    if (response.ok) {
      await triggerReloadUser()
      onClose()
      showToast({
        title: 'Email updated successfully',
        status: 'success'
      })
    } else {
      let msg = 'Something went wrong'
      try {
        const result = await response.json()
        msg = result.message ?? msg
      } catch (error) {}
      showToast({
        title: msg,
        status: 'error'
      })
    }
    setIsLoading(false)
  }

  return (
    <>
      <Box shadow='md' p='2' height='fit-content' maxW={300}>
        <Heading size='md'>Change Email</Heading>
        <FormControl my='4' isRequired>
          <Input
            type='text'
            name='email'
            value={values.email}
            placeholder='email'
            onBlur={handleTouch}
            onChange={handleChange}
          />
          <Text noOfLines={3} fontSize='xs' color='red.500'>
            {emailErr && 'Email is invalid'}
          </Text>
        </FormControl>
        <Button
          fontWeight='semibold'
          width='full'
          mt={4}
          disabled={isDisabled}
          bg='success'
          color='white'
          onClick={initiateEmailChangeRequest}
          isLoading={isLoading}
          loadingText='Updating'
        >
          Change
        </Button>
      </Box>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Email address validation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              We have sent a validation code to your new email address. Please enter the code below to validate your new email address.
            </Text>
            <Input placeholder='Code' name='token' onChange={handleChange} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={finializeEmailChangeRequest} colorScheme='blue' isLoading={isLoading} isDisabled={isLoading || isEmpty(values.token)} mr='1.5'>
              Validate
            </Button>
            <Button onClick={cancelEmailChangeRequest} isLoading={isLoading} isDisabled={isLoading}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EmailSettings
