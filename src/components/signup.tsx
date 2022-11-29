import React, { useEffect, useState } from 'react'
import {
  Flex,
  Box,
  FormControl,
  Input,
  Button,
  Image,
  Link,
  useToast,
  Alert,
  AlertDescription,
  CloseButton,
  AlertTitle,
  AlertIcon
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { AI4BelgiumIcon } from './navbar'
import { defaultFetchOptions } from '@/util/api'
import isEmpty from 'lodash.isempty'

const validEmail = /^[a-zA-Z0-9._:$!%-+]+@[a-zA-Z0-9.-]+.[a-zA-Z]$/
const validPassword = /^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$/

const SignUp = (): JSX.Element => {
  const router = useRouter()
  const toast = useToast()
  const email = router.query.email as string
  const token = router.query.token as string
  const [values, setValues] = useState({
    email: email ?? '',
    password: '',
    fullName: '',
    confirmPassword: ''
  })
  const [isCreating, setIsCreatingStatus] = useState(false)
  const [hasError, setErrorState] = useState(false)
  const [emailErr, setEmailErr] = useState(false)
  const [passwordErr, setPasswordErr] = useState(false)
  const [isButtonDisabled, setButtonState] = useState(true)

  useEffect(() => {
    validate()
    const isMissingFields = isEmpty(values.password) || isEmpty(values.confirmPassword) || isEmpty(values.email) || isEmpty(values.fullName)
    const isInValidPassword = values.password !== values.confirmPassword
    const isErrorFields = emailErr || passwordErr
    const disabled = isInValidPassword || isMissingFields || isErrorFields
    setButtonState(disabled)
  }, [values.email, values.password, values.confirmPassword, values.fullName, passwordErr, emailErr])

  const validate = (): void => {
    setEmailErr(!validEmail.test(values.email))
    setPasswordErr(!validPassword.test(values.password))
  }

  const showToast = (): void => {
    toast({
      position: 'top',
      title: 'Account created.',
      description: "We've created your account. Redirecting you to login page in 3 seconds ",
      status: 'success',
      duration: 2500,
      isClosable: true
    })
  }

  const registerUser = async (e): Promise<void> => {
    e.preventDefault()
    setIsCreatingStatus(true)
    const { email, password, confirmPassword, fullName } = values
    const data: any = {
      email,
      password,
      confirmPassword,
      fullName
    }
    if (token != null) data.token = token

    const url = '/api/auth/signup'

    const response = await fetch(url, {
      ...defaultFetchOptions,
      method: 'POST',
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (response.status === 404) {
      setErrorState(true)
    }

    setIsCreatingStatus(false)
    if (result.message === 'success') {
      redirectToLoginPage()
    }
  }

  const redirectToLoginPage = (path = '/login'): void => {
    showToast()
    setTimeout(async () => await router.push({
      pathname: path,
      query: {
        email: values.email
      }
    }), 3000)
  }

  const showSignUpError = (): JSX.Element => {
    if (!hasError) return (<></>)

    return (
      <Alert status='error'>
        <AlertIcon />
        <AlertTitle mr={2}>Error</AlertTitle>
        <AlertDescription>Email already in use</AlertDescription>
        <CloseButton
          position='absolute'
          right='8px'
          top='8px'
          onClick={() => setErrorState(!hasError)}
        />
      </Alert>
    )
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value
    })
  }

  return (
    <>
      <Box display='flex' alignItems='center' justifyContent='center'>
        <AI4BelgiumIcon />
      </Box>
      <Flex
        alignItems='center'
        flexDirection={['column', 'column', 'row', 'row']}
        justifyContent='center'
      >
        <Image
          position='absolute'
          bottom='5%'
          left='5%'
          src='/signup/sign-up-left.svg'
          alt=' team work illustration'
          width={[0, '25%']}
        />
        <Image
          position='absolute'
          bottom='5%'
          right='5%'
          src='/signup/sign-up-right.svg'
          alt='work together illustration'
          width={[0, '25%']}
          borderRadius='3px'
        />
        <Box
          p='25px 40px'
          width={['80%', '60%', '45%', '25%']}
          borderRadius='3px'
          bg='white'
          boxShadow='rgb(0 0 0 / 10%) 0 0 10px'
        >
          <Box
            textAlign='center'
            color='#5E6C84'
            mt='5'
            mb='25'
            fontSize={['10px', '10px', '15px', '15px']}
            fontWeight='semibold'
            lineHeight='normal'
          >
            <h1>Sign up</h1>
          </Box>
          <Box my={4} textAlign='left'>
            <FormControl isRequired>
              <Input
                type='email'
                name='email'
                value={values.email}
                placeholder='Enter Email'
                onChange={handleChange}
                autoComplete='off'
              />
              {emailErr && <p color='red'>Invalid email.</p>}
            </FormControl>
            <FormControl my='4' isRequired>
              <Input
                type='text'
                name='fullName'
                value={values.fullName}
                placeholder='Full name'
                onChange={handleChange}
                autoComplete='off'
              />
            </FormControl>
            <FormControl my='4'>
              <Input
                type='password'
                name='password'
                value={values.password}
                placeholder='Create password'
                onChange={handleChange}
              />
              {passwordErr && <p color='red'>Invalid password.</p>}
            </FormControl>
            <FormControl my='4'>
              <Input
                type='password'
                name='confirmPassword'
                value={values.confirmPassword}
                placeholder='Confirm password'
                onChange={handleChange}
              />
            </FormControl>
            <Button
              fontWeight='semibold'
              width='full'
              mt={4}
              disabled={isButtonDisabled}
              bg='success'
              color='white'
              onClick={registerUser}
              isLoading={isCreating}
              loadingText='Registering'
            >
              Sign up
            </Button>
            <Box m='5' textAlign='center'>
              <Link href='/login' color='brand' p='2'>
                Already have an account? Log in.
              </Link>
            </Box>
            {showSignUpError()}
          </Box>
        </Box>
      </Flex>
    </>
  )
}

export default SignUp
