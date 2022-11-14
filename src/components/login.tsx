import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import {
  Flex,
  Box,
  FormControl,
  Input,
  Button,
  Image,
  Link,
  Text,
  Alert,
  AlertDescription,
  CloseButton,
  AlertTitle,
  AlertIcon
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import inviteUser from '@/util/invite-user'

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const [isFetching, setIsFetching] = useState(false)
  const [hasError, setErrorState] = useState(false)

  const router = useRouter()

  const loginUser = async (e) => {
    e.preventDefault()
    setIsFetching(true)

    const data = {
      email: values.email,
      password: values.password
    }

    const result = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    })

    setIsFetching(false)

    const { email: inviteEmail, token, boardId } = router.query
    const isInvitedUser = inviteEmail && token && boardId

    if (isInvitedUser && result?.ok === true) {
      const hasInvited = await inviteUser({ email: inviteEmail, boardId })
      if (hasInvited) router.push('/home')
    } else if (result?.ok === true) {
      router.push('/home')
    }

    if (result?.status === 404 || result?.status === 401) {
      setErrorState(true)
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value
    })
  }

  const showLoginError = () => {
    if (!hasError) return

    return (
      <Alert status='error'>
        <AlertIcon />
        <AlertTitle mr={2}>Error</AlertTitle>
        <AlertDescription>Invalid username or password</AlertDescription>
        <CloseButton
          position='absolute'
          right='8px'
          top='8px'
          onClick={() => setErrorState(!hasError)}
        />
      </Alert>
    )
  }

  return (
    <>
      <Box display='flex' justifyContent='center' alignItems='center' my='40px'>
        <Image height='20px' mt='2' src='/trello-icon.svg' alt='brand logo' />
        <Text fontWeight='bold' fontSize='28px' m='4px'>
          Trello
        </Text>
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
          src='/login/left.svg'
          alt=' new user illustration'
          width={[0, '30%']}
        />
        <Image
          position='absolute'
          bottom='5%'
          right='5%'
          src='/login/right.svg'
          alt='task scheduler illustration'
          width={[0, '30%']}
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
            fontSize={['16px', '16px', '20px', '20px']}
            fontWeight='semibold'
            lineHeight='normal'
          >
            <h1>Log in to Trello</h1>
          </Box>
          <Box my={4} textAlign='left'>
            <form>
              <FormControl>
                <Input
                  type='email'
                  name='email'
                  value={values.email}
                  placeholder='Enter Email '
                  onChange={handleChange}
                  autoComplete='off'
                />
              </FormControl>
              <FormControl mt={6}>
                <Input
                  type='password'
                  name='password'
                  value={values.password}
                  placeholder='Enter Password'
                  autoComplete='off'
                  onChange={handleChange}
                />
              </FormControl>
              <Button
                width='full'
                mt={4}
                bg='success'
                color='white'
                onClick={loginUser}
                isLoading={isFetching}
                loadingText='Logging'
              >
                Sign In
              </Button>
              <Box m='5' textAlign='center'>
                <Link href='/signup' color='brand' p='2'>
                  Sign up for an account
                </Link>
              </Box>
              {showLoginError()}
            </form>
          </Box>
        </Box>
      </Flex>
    </>
  )
}

export default Login