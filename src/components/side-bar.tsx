import React, { FC } from 'react'
import { Box, Button } from '@chakra-ui/react'
import {
  AiOutlineHome,
  AiOutlineSetting
} from 'react-icons/ai'
import Link from 'next/link'
import NavBar from '@/src/components/navbar'
import { useTranslation } from 'next-i18next'

interface Props {
  page: string
}

const SideBar: FC<Props> = (props): JSX.Element => {
  const { t } = useTranslation()
  const { page } = props

  const sidebarMenu = [
    { path: '/home', buttonName: `${t("buttons:home")}`, page: 'home', icon: AiOutlineHome },
    { path: '/settings', buttonName: `${t("buttons:settings")}`, page: 'settings', icon: AiOutlineSetting }
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
