import React, { FC, useState, useEffect } from 'react'
import {
  Button,
  Box,
  Spacer,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  Text
} from '@chakra-ui/react'
import Link from 'next/link'
import PropTypes from 'prop-types'
import { signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import { AiOutlineHome } from 'react-icons/ai'
import { SiTrello } from 'react-icons/si'
import { useSession } from 'next-auth/react'

const UserNavBar: FC = () => {
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
        <>
          <Menu>
            <MenuButton size='xs' mr='5px'>
              <Avatar
                size='sm'
                name={session.user.email}
                color='white'
                src='https://bit.ly/tioluwani-kolawole'
              />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={logout}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </>
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
    <Box boxShadow='sm' bg='rgba(0,0,0,0.2)' display='flex'>
      <Link href='/home'>
        <Button size='xs' ml='5px' my='5px'>
          <AiOutlineHome />
        </Button>
      </Link>
      <Link href='/boards'>
        <Button size='xs' ml='5px' mr='10px' my='5px'>
          Boards
        </Button>
      </Link>
      <Spacer />
      <Box size='md' m='10px' color='white'>
        <SiTrello />
      </Box>
      <Text fontWeight='bold' fontSize='20px' mt='2px' color='white'>
        Trello clone
      </Text>
      <Spacer />
      {renderButtons()}
    </Box>
  )
}

UserNavBar.propTypes = {
  bg: PropTypes.string
}

export default UserNavBar
