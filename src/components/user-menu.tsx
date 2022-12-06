import React from 'react'
import { FiUserPlus, FiCheck } from 'react-icons/fi'
import {
  Avatar,
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import { getUserDisplayName } from '@/util/users-fe'
import { User } from '@/src/types/user'

export const UserMenu = (props: { users: User[], includedUserIds: string[], onUserRemove: Function, onUserAdd: Function, children?: any, userIdTrigger?: any }): JSX.Element => {
  const { users, includedUserIds, onUserRemove, onUserAdd } = props
  const clickHandler = (e, user: any): void => {
    e.stopPropagation()
    includedUserIds.includes(user._id)
      ? onUserRemove(user._id)
      : onUserAdd(user._id)
  }

  return (
    <Menu>
      <MenuButton>
        {props.children}
      </MenuButton>
      <MenuList>
        {users.map(user => (
          <MenuItem key={user._id} display='block' onClick={e => clickHandler(e, user)} px='1' closeOnSelect={false}>
            <Flex justifyContent='space-between' alignItems='center'>
              <Flex justifyContent='flex-start' alignItems='center'>
                <Avatar size='xs' name={getUserDisplayName(user)} src={user.xsAvatar} mr='1' />
                <Box>{getUserDisplayName(user)}</Box>
              </Flex>
              <Box display={includedUserIds.includes(String(user._id)) ? 'block' : 'none'}>
                <FiCheck color='green' />
              </Box>
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
