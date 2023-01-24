import React from 'react'
import {
  Box
} from '@chakra-ui/react'
import { IoIosNotificationsOutline } from 'react-icons/io'

const NotificationIcon = ({ onClick, showFlagNewNotifications = false }: { onClick: Function, showFlagNewNotifications: boolean }): JSX.Element => {
  return (
    <Box position='relative'>
      <IoIosNotificationsOutline cursor={onClick != null ? 'pointer' : 'default'} className='icon-blue-color' size='20' strokeWidth='20px' onClick={() => onClick != null ? onClick() : null} />
      {showFlagNewNotifications && <Box width='10px' height='10px' bgColor='red' borderRadius='full' position='absolute' right='0' bottom='0' />}
    </Box>
  )
}

export default NotificationIcon
