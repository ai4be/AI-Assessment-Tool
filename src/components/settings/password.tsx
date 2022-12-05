import React, { useState, useEffect, useContext } from 'react'
import {
  Box, Heading, FormControl, Button,
  Input,
  Text,
  useToast
} from '@chakra-ui/react'
import { defaultFetchOptions } from '@/util/api'
import isEmpty from 'lodash.isempty'
import { isPasswordValid } from '@/util/validator'
import UserContext from '../../store/user-context'

const PasswordSettings = (): JSX.Element => {
  const toast = useToast()
  const { user } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [passwordLengthErr, setPasswordLengthErr] = useState(false)
  const [passwordCharErr, setPasswordCharErr] = useState(false)
  const [confirmPasswordErr, setConfirmPasswordErr] = useState(false)
  const [touched, setTouched] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  })
  const [values, setValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!touched.newPassword) return
    setPasswordLengthErr(values.newPassword?.length < 8)
    setPasswordCharErr(!isPasswordValid(values.newPassword))
  }, [values.newPassword, touched.newPassword])

  useEffect(() => {
    if (!touched.newPassword || !touched.confirmPassword) return
    setConfirmPasswordErr(values.newPassword?.length > 0 && values.confirmPassword?.length > 0 && values.confirmPassword !== values.newPassword)
  }, [values.newPassword, touched.newPassword, values.confirmPassword, touched.confirmPassword])

  useEffect(() => {
    const isDisabled = isEmpty(values.confirmPassword) || isEmpty(values.currentPassword) || isEmpty(values.newPassword) ||
      passwordLengthErr || passwordCharErr || confirmPasswordErr
    setIsDisabled(isDisabled)
  }, [values.confirmPassword, values.currentPassword, values.newPassword, passwordLengthErr, passwordCharErr, confirmPasswordErr])

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

  const changePassword = async (e): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    const { currentPassword, confirmPassword, newPassword } = values
    const data: any = {
      currentPassword,
      confirmPassword,
      newPassword
    }
    const url = `/api/users/${String(user?._id)}/password`
    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'PATCH',
      body: JSON.stringify(data)
    })
    const toastDefaultOptions: any = {
      position: 'top',
      duration: 2500,
      isClosable: true
    }

    if (response.ok) {
      toast({
        ...toastDefaultOptions,
        title: 'Password changed successfully',
        status: 'success'
      })
      setValues({} as any)
    } else {
      toast({
        ...toastDefaultOptions,
        title: 'Password change failed',
        status: 'error'
      })
    }
    setIsLoading(false)
  }

  return (
    <Box shadow='md' p='2' height='fit-content' maxW={300}>
      <Heading size='md'>Change Password</Heading>
      <FormControl my='4' isRequired>
        <Input
          type='password'
          name='currentPassword'
          value={values.currentPassword}
          placeholder='Current password'
          onBlur={() => setTouched({ ...touched, currentPassword: true })}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl my='4' isInvalid={passwordLengthErr || passwordCharErr} isRequired>
        <Input
          type='password'
          name='newPassword'
          value={values.newPassword}
          placeholder='New password'
          onBlur={() => setTouched({ ...touched, newPassword: true })}
          onChange={handleChange}
        />
        <Text noOfLines={3} fontSize='xs' color='red.500'>
          {passwordLengthErr && 'Password must be at least 8 characters long'}
          {passwordCharErr && ' Password must contain at least one number and one special character'}
        </Text>
      </FormControl>
      <FormControl my='4' isInvalid={confirmPasswordErr} isRequired>
        <Input
          type='password'
          name='confirmPassword'
          value={values.confirmPassword}
          placeholder='Confirm password'
          onChange={handleChange}
          onBlur={() => setTouchedWrapper('confirmPassword', 0)}
        />
        <Text noOfLines={1} fontSize='xs' color='red.500'>
          {confirmPasswordErr && <p color='red'>Passwords don't match</p>}
        </Text>
      </FormControl>
      <Button
        fontWeight='semibold'
        width='full'
        mt={4}
        disabled={isDisabled}
        bg='success'
        color='white'
        onClick={changePassword}
        isLoading={isLoading}
        loadingText='Updating'
      >
        Update
      </Button>
    </Box>
  )
}

export default PasswordSettings
