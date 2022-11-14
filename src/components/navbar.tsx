import React, { FC, useEffect, useState } from 'react'
import { Button, Image, Flex, Box, Spacer } from '@chakra-ui/react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { GrLogout } from 'react-icons/gr'
import { useSession } from 'next-auth/react'
import { signOut } from "next-auth/react"
import { useRouter } from 'next/router'

interface IProps {
  bg?: string
}

const NavBar: FC<IProps> = ({ bg }) => {
  const [session, setSession] = useState(undefined)
  const { data } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (data != null) setSession(data)
  }, [data])

  const logout = async () => {
    const response = await signOut({ redirect: false })
    router.push('/')
  }

  const renderButtons = () => {
    if (session != null) {
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
        <Image height='8' src='/trello-logo.svg' alt='brand logo' m='5' />
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
