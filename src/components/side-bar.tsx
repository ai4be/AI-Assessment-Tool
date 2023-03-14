import {
  Box,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerContent
} from '@chakra-ui/react'
import { AiOutlineHome, AiOutlineSetting } from 'react-icons/ai'
import Link from 'next/link'
import NavBar from './navbar'

interface Props {
  page: string,
  children: string | JSX.Element | JSX.Element[],
  onClose: Function
  isOpen: boolean
  variant: 'drawer' | 'sidebar' | undefined | string,
  showSidebarButton?: boolean,
  onShowSidebar?: Function
}

const sidebarMenu = [
    { path: '/home', buttonName: 'Home', page: 'home', icon: AiOutlineHome },
    { path: '/settings', buttonName: 'Settings', page: 'settings', icon: AiOutlineSetting }
  ]

const SidebarContent = (props) => (
  <Box display='flex' flexDirection='column'>
    {sidebarMenu.map((menu, index) => (
      <Link href={menu.path} key={index}>
        <Button
          mt='5px'
          mb='5px'
          height='4rem'
          borderRadius='1rem'
          boxShadow={props.page === menu.page ? 'inner' : 'base'}
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
)

const SideBar = (props: Props) => {
  return props.variant === 'sidebar' ? (
    <>
      <NavBar {...props} bg='white' />
      <Box display='flex' mt='2%'>
        <Box height='80vh' width='20vw' boxShadow='base' rounded='lg' p='1em' ml='20px'>
          <SidebarContent {...props} />
        </Box>
        {props.children}
      </Box>
    </>
  ) : (
    <>
      <NavBar {...props} bg="white" />
      <Box display='flex' mt='2%'>
        <Box display='flex' flexDirection='column'>
          <Drawer isOpen={props.isOpen} placement="left" onClose={props.onClose}>
            <DrawerOverlay>
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>AI Assessment Tool</DrawerHeader>
                <DrawerBody>
                  <SidebarContent {...props} />
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </Box>
      </Box>
      {props.children}
    </>
  )
}

export default SideBar
