import React, { useEffect, useState, useMemo } from 'react'
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
  AlertIcon,
  Text
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { AI4BelgiumIcon } from './navbar'
import { defaultFetchOptions } from '@/util/api'
import { isEmpty, debounce } from '@/util/index'
import { isEmailValid, isPasswordValid } from '@/util/validator'

const SignUp = (): JSX.Element => {
  const router = useRouter()
  const toast = useToast()
  const email = router.query.email as string
  const token = router.query.token as string
  const [values, setValues] = useState({
    email: email ?? '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  })
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    firstName: false,
    lastName: false,
    confirmPassword: false
  })
  const [isCreating, setIsCreatingStatus] = useState(false)
  const [hasError, setErrorState] = useState(false)
  const [emailErr, setEmailErr] = useState(false)
  const [passwordLengthErr, setPasswordLengthErr] = useState(false)
  const [passwordCharErr, setPasswordCharErr] = useState(false)
  const [confirmPasswordErr, setConfirmPasswordErr] = useState(false)
  const [isButtonDisabled, setButtonState] = useState(true)

  useEffect(() => {
    if (!touched.email) return
    setEmailErr(!isEmailValid(values.email))
  }, [values.email, touched.email])

  useEffect(() => {
    if (!touched.password || !touched.confirmPassword) return
    if (values.password?.length > 0 && values.confirmPassword?.length > 0 && values.confirmPassword !== values.password) {
      setConfirmPasswordErr(true)
    } else {
      setConfirmPasswordErr(false)
    }
  }, [values.password, values.confirmPassword, touched.password, touched.confirmPassword])

  useEffect(() => {
    if (!touched.password) return
    const isTooShort = values.password?.length < 8
    setPasswordLengthErr(isTooShort)
    setPasswordCharErr(!isPasswordValid(values.password))
  }, [values.password, touched.password])

  useEffect(() => {
    const hasErrors = emailErr || passwordLengthErr || passwordCharErr || confirmPasswordErr ||
      isEmpty(values.email) || isEmpty(values.password) || isEmpty(values.confirmPassword) ||
      isEmpty(values.firstName) || isEmpty(values.lastName)
    setButtonState(hasErrors)
  }, [values.password, values.confirmPassword, values.firstName, values.lastName, values.email, emailErr, passwordLengthErr, passwordCharErr, confirmPasswordErr])

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
    const { email, password, confirmPassword, firstName, lastName } = values
    const data: any = {
      email,
      password,
      confirmPassword,
      firstName,
      lastName
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

    if (result.message === 'success') {
      await redirectToLoginPage()
    }
    setIsCreatingStatus(false)
  }

  const redirectToLoginPage = async (path = '/login'): Promise<void> => {
    showToast()
    await new Promise((resolve) => setTimeout(resolve, 3000))
    await router.push({
      pathname: path,
      query: {
        email: values.email
      }
    })
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

  const setPropTouched = (prop: string): void => {
    setTouched({
      ...touched,
      [prop]: true
    })
  }
  const setPropTouchedDebounced = useMemo(() => debounce(setPropTouched, 1000), [touched])

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value
    })
    setPropTouchedDebounced(name)
  }

  return (
    <>
      <Box display='flex' alignItems='center' justifyContent='center'>
        <Link href='/'><AI4BelgiumIcon /></Link>
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
            <FormControl isRequired isInvalid={emailErr}>
              <Input
                type='email'
                name='email'
                value={values.email}
                placeholder='Enter Email'
                onChange={handleChange}
                onBlur={() => setTouched({ ...touched, email: true })}
                autoComplete='off'
              />
              {emailErr && <Text size='xs' color='red'>Invalid email.</Text>}
            </FormControl>
            <FormControl my='4' isRequired>
              <Input
                type='text'
                name='firstName'
                value={values.firstName}
                placeholder='First name'
                onChange={handleChange}
                onBlur={() => setTouched({ ...touched, firstName: true })}
                autoComplete='off'
              />
            </FormControl>
            <FormControl my='4' isRequired>
              <Input
                type='text'
                name='lastName'
                value={values.lastName}
                placeholder='Last name'
                onChange={handleChange}
                onBlur={() => setTouched({ ...touched, lastName: true })}
                autoComplete='off'
              />
            </FormControl>
            <FormControl my='4' isInvalid={passwordLengthErr || passwordCharErr} isRequired>
              <Input
                type='password'
                name='password'
                value={values.password}
                placeholder='Create password'
                onBlur={() => setTouched({ ...touched, password: true })}
                onChange={handleChange}
              />
              {passwordLengthErr && <Text size='xs' color='red'>Password is too short</Text>}
              {passwordCharErr && <Text size='xs' color='red'>Include a special character and number</Text>}
            </FormControl>
            <FormControl my='4' isInvalid={confirmPasswordErr} isRequired>
              <Input
                type='password'
                name='confirmPassword'
                value={values.confirmPassword}
                placeholder='Confirm password'
                onChange={handleChange}
                onBlur={() => setTouched({ ...touched, confirmPassword: true })}
              />
              {confirmPasswordErr && <Text size='xs' color='red'>Passwords don't match</Text>}
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
