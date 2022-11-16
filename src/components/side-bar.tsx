import React from 'react'
import { Box, Button } from '@chakra-ui/react'
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineCreditCard,
  AiOutlineBuild
} from 'react-icons/ai'
import Link from 'next/link'
import NavBar from '@/src/components/navbar'

const SideBar = (props): JSX.Element => {
  const { page } = props

  const sidebarMenu = [
    { path: '/home', buttonName: 'Home', page: 'home', icon: AiOutlineHome },
    { path: '/projects', buttonName: 'Projects', page: 'project', icon: AiOutlineCreditCard },
    { path: '/templates', buttonName: 'Templates', page: 'templates', icon: AiOutlineBuild },
    { path: '/settings', buttonName: 'Settings', page: 'settings', icon: AiOutlineSetting }
  ]

  return (
    <>
      <NavBar bg='white' />
      <Box display='flex' mt='2%'>
        <Box height='80vh' width='20vw' boxShadow='base' rounded='lg' p='1em' ml='20px'>
          <Box display='flex' flexDirection='column'>
            {sidebarMenu.map((menu, index) => (
              <Link href={menu.path} key={index}>
                <Button
                  mt='5px'
                  mb='5px'
                  height='4rem'
                  borderRadius='1rem'
                  boxShadow={page === menu.page ? 'inner' : 'base'}
                  display='flex'
                  justifyContent='left'
                  colorScheme='gray'
                >
                  <>
                    <menu.icon size='20px' /> &nbsp; {menu.buttonName}
                  </>
                </Button>
              </Link>
            ))}
          </Box>
        </Box>
        {props.children}
      </Box>
    </>
  )
}

export default SideBar
