import React, { FC, useEffect, useState } from 'react'
import { Button, Image, Flex, Box, Spacer,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  Divider
} from '@chakra-ui/react'
import Link from 'next/link'
import PropTypes from 'prop-types'
// import { GrLogout } from 'react-icons/gr'
import { BiUser } from 'react-icons/bi'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { RiArrowDropDownLine } from 'react-icons/ri'
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
        <>
          <Flex flexDirection='column' justifyContent='center' >
            <IoIosNotificationsOutline className='icon-blue-color' size='20' strokeWidth='20px' />
          </Flex>
          <Flex flexDirection='column' justifyContent='center' paddingX='2' >
            <Divider orientation='vertical' height='50%' color='#F0EEF9' />
          </Flex>
          <Menu>
            <MenuButton size='xs' mr='5px'>
              <Flex justifyContent='center' alignItems='center'>
                <Avatar
                  size='sm'
                  backgroundColor='#F0EEF9'
                  icon={<BiUser size='20' className='icon-blue-color' />}
                />
                <RiArrowDropDownLine color='#F0EEF9' size='20' />
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={logout}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </>
      )
      // return (
      //   <>
      //     <Button fontSize='20' variant='link'><BiUser className='icon-blue-color' /></Button>
      //     <Button
      //       fontSize='20'
      //       color='danger'
      //       variant='link'
      //       float='right'
      //       mr='2'
      //       pr='2'
      //       onClick={logout}
      //     >
      //       <GrLogout />
      //     </Button>
      //   </>
      // )
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
