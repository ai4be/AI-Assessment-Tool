import React, { useState, useEffect, useContext } from 'react'
import {
  Box, Heading, FormControl, Button,
  Input,
  Text
} from '@chakra-ui/react'
import { isEmailValid } from '@/util/validator'
import UserContext from '@/src/store/user-context'
import EmailVerificationModal from '@/src/components/modal-email-verification'

const EmailSettings = (): JSX.Element => {
  const { user } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [emailErr, setEmailErr] = useState(false)
  const [email, setEmail] = useState(user?.email ?? '')
  const [showModal, setShowModal] = useState(false)

  const [touched, setTouched] = useState({
    email: false
  })

  useEffect(() => {
    setEmail(user?.email ?? '')
  }, [user?.email])

  useEffect(() => {
    setIsDisabled(user?.email === email)
  }, [user?.email, email])

  useEffect(() => {
    if (!touched.email) return
    setEmailErr(!isEmailValid(email))
  }, [email, touched.email])

  const setTouchedWrapper = (field: string, waitTimeMS = 0): void => {
    if (touched[field] !== true) {
      waitTimeMS > 0
        ? setTimeout(() => setTouchedWrapper(field, 0), waitTimeMS)
        : setTouched({ ...touched, [field]: true })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setEmail(value)
    setTouchedWrapper(name, 800)
  }

  const handleTouch = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name } = e.target
    setTouched({ ...touched, [name]: true })
  }

  const cloaseModalCb = (): void => {
    setShowModal(false)
    setEmail(user?.email ?? '')
  }

  return (
    <>
      <Box shadow='md' p='2' height='fit-content' maxW={300}>
        <Heading size='md'>Change Email</Heading>
        <FormControl my='4' isRequired>
          <Input
            type='text'
            name='email'
            value={email}
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
          onClick={() => setShowModal(true)}
          isLoading={isLoading}
          loadingText='Updating'
        >
          Change
        </Button>
      </Box>
      {showModal && <EmailVerificationModal email={email} isUpdate onCloseCb={cloaseModalCb} getTokenAtInit />}
    </>
  )
}

export default EmailSettings
