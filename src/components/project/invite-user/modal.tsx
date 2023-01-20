import React, { SyntheticEvent, useState, BaseSyntheticEvent, useContext } from 'react'
import {
  Box,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from '@chakra-ui/react'
import { defaultFetchOptions } from '@/util/api'
import ToastContext from '@/src/store/toast-context'

const InviteModal = ({ project, callback }): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { showToast } = useContext(ToastContext)
  const [email, setEmail] = useState('')
  const [emailErr, setEmailErr] = useState(false)
  const [isMailSending, setMailSending] = useState(false)

  const validEmail = /^[a-zA-Z0-9._:$!%-+]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/

  const handleClick = async (e: SyntheticEvent): Promise<void> => {
    if (e?.preventDefault != null) e.preventDefault()
    if (e.nativeEvent instanceof KeyboardEvent && e.nativeEvent.key !== 'Enter') return
    setMailSending(true)
    await sendEmail()
    setMailSending(false)
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    setEmail(e.target.value)
    validate()
  }

  const validate = (): void => {
    if (!validEmail.test(email)) {
      setEmailErr(true)
    } else {
      setEmailErr(false)
    }
  }

  const sendEmail = async (): Promise<void> => {
    const url = '/api/mail'
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'POST',
      body: JSON.stringify({ email, projectId: project._id })
    })
    if (response.ok) {
      setEmail('')
      onClose()
      if (callback != null && typeof callback === 'function') await callback()
    } else {
      try {
        const error = await response.json()
        if (error.message != null) showToast({ title: 'Something went wrong', description: error.message, status: 'error' })
        else showToast({ title: 'Something went wrong', status: 'error' })
      } catch (err) {
        showToast({ title: 'Something went wrong', status: 'error' })
      }
    }
  }

  return (
    <>
      <Box align='right'>
        <Button
          backgroundColor='success'
          color='white'
          onClick={onOpen}
        >
          Invite
        </Button>
      </Box>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type='email'
              value={email}
              onChange={handleChange}
              placeholder='Enter the email'
              onKeyUp={handleClick}
              ref={el => el?.focus()}
            />
          </ModalBody>
          {emailErr && <p>{emailErr}</p>}
          <ModalFooter>
            <Button
              disabled={!validEmail.test(email)}
              colorScheme='blue'
              mr={3}
              onClick={handleClick}
              isLoading={isMailSending}
              loadingText='Sending'
            >
              Invite
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default InviteModal
