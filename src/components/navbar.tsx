import React, { FC, useContext } from 'react'
import { Button, Flex, Box, Spacer,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  Divider
} from '@chakra-ui/react'
import Link from 'next/link'
// import { GrLogout } from 'react-icons/gr'
// import { BiUser } from 'react-icons/bi'
import { IoIosNotificationsOutline } from 'react-icons/io'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import UserContext, { UserContextProvider } from '../store/user-context'
import { User } from '../../util/user'

interface Props {
  bg?: string
}

export const AI4BelgiumIcon = (): JSX.Element => (
  <div className='px-3 py-5 flex flex-col justify-center icon-grey-color font-semibold text-lg cursor-pointer'>
    <span>AI<sub className='icon-blue-color text-lg'>4</sub>Belgium</span>
  </div>
)

const RenderButtons = ({ user }: { user: User | null }): JSX.Element => {
  const router = useRouter()
  if (user != null) {
    const logout = async (): Promise<void> => {
      // const response =
      await signOut({ redirect: false })
      await router.push('/')
    }

    return (
      <>
        <Flex flexDirection='column' justifyContent='center'>
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
                name={`${user?.firstName} ${user?.lastName}`}
                src={user?.xsAvatar}
                // backgroundColor='#F0EEF9'
                // icon={<BiUser size='20' className='icon-blue-color' />}
              />
              <RiArrowDropDownLine color='#F0EEF9' size='20' />
            </Flex>
          </MenuButton>
          <MenuList backgroundColor='white'>
            <MenuItem onClick={() => void router.push('/settings')} className='icon-blue-color' color='#0000E6'>Settings</MenuItem>
            <MenuItem onClick={logout} className='icon-blue-color' color='#0000E6'>Log out</MenuItem>
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

const NavaBarInner = ({ bg }: Props): JSX.Element => {
  const router = useRouter()
  const { user } = useContext(UserContext)
  return (
    <Box bg={bg} boxShadow='md'>
      <Flex>
        <Box href='/' onClick={() => router.push('/home')}>
          <AI4BelgiumIcon />
        </Box>
        <Spacer />
        <RenderButtons user={user} />
      </Flex>
    </Box>
  )
}

const NavBar: FC<Props> = (props) => {
  return (
    <UserContextProvider>
      <NavaBarInner {...props} />
    </UserContextProvider>
  )
}

export default NavBar
