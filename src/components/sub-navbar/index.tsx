import { Box, Heading, Avatar, Tooltip } from '@chakra-ui/react'

import PropType from 'prop-types'
import BoardSettings from '@/src/components/sub-navbar/board-settings'
import InviteModal from '@/src/components/sub-navbar/invite-user/modal'
import React, { useEffect, useState } from 'react'
import { fetchUsers } from '@/src/slices/users'

import UnsplashDrawer from '@/src/components/sub-navbar/unsplash-in-drawer'

const SubNavbar = (props: any): JSX.Element => {
  const board = props.board
  const [users, setUsers]: [any[], Function] = useState([])

  useEffect(() => {
    const usersIds = [...board.users, board.createdBy]
    const userPromise: Promise<any>[] = usersIds.map(uId => fetch(`/api/users/${uId}`))
    Promise.all(userPromise)
      .then(results => Promise.all(results.map(r => r.json())))
      .then(usersData => setUsers(usersData))
  }, [board])

  const loadBoardUsers = () => {
    return users.map((user, index) => (
      <Tooltip label={user.fullName} aria-label='A tooltip' key={index}>
        <Avatar size='sm' name={user.fullName} mr='5px' src='https://bit.ly/tioluwani-kolawole' />
      </Tooltip>
    ))
  }

  return (
    <Box
      height='40px'
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      bg='rgba(0,0,0,0.1)'
    >
      <Heading ml='0.5rem' color='white' as='h4' size='sm' whiteSpace='nowrap' d='block'>
        {board?.name}
      </Heading>
      <Box>{loadBoardUsers()}</Box>
      <Box>
        <InviteModal board={board} />
        <BoardSettings board={board} />
        <UnsplashDrawer />
      </Box>
    </Box>
  )
}

SubNavbar.propTypes = {
  board: PropType.object
}

export default SubNavbar
