import React, { FC, useEffect, useState } from 'react'
import { Button, Image, Flex, Box, Spacer } from '@chakra-ui/react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { GrLogout } from 'react-icons/gr'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

interface IProps {
  bg?: string
}

export const AI4BelgiumIcon = (): JSX.Element => (
  <div className='px-3 py-5 flex flex-col justify-center icon-grey-color font-semibold text-lg cursor-pointer'>
    <span>AI<sub className='icon-blue-color text-lg'>4</sub>Belgium</span>
  </div>
)

const NavBar: FC<IProps> = ({ bg }) => {
  const [session, setSession] = useState(undefined)
  const { data } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (data != null) setSession(data)
  }, [data])

  const logout = async (): Promise<void> => {
    const response = await signOut({ redirect: false })
    await router.push('/')
  }

  const renderButtons = (): JSX.Element => {
    console.log(data)
    if (data != null) {
      return (
        <Button
          fontSize='20'
          color='danger'
          variant='link'
          float='right'
          mr='2'
          pr='2'
          onClick={logout}
        >
          <GrLogout />
        </Button>
      )
    }

    return (
      <>
        <Button fontSize='20' color='brand' variant='link' float='right' mr='2' pr='2'>
          <Link href='/login'>Log in</Link>
        </Button>
        <Button fontSize='md' colorScheme='green' color='white' m='4'>
          <Link href='/signup'>Sign up</Link>
        </Button>
      </>
    )
  }

  return (
    <Box bg={bg} boxShadow='md'>
      <Flex>
        <Link href='/'>
          <AI4BelgiumIcon />
        </Link>
        <Spacer />
        {renderButtons()}
      </Flex>
    </Box>
  )
}

NavBar.propTypes = {
  bg: PropTypes.string
}

export default NavBar
