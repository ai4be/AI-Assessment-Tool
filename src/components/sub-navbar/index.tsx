import { Box, Heading, Avatar, Tooltip } from '@chakra-ui/react'

import PropType from 'prop-types'
import ProjectSettings from '@/src/components/sub-navbar/project-settings'
import InviteModal from '@/src/components/sub-navbar/invite-user/modal'
import React, { useEffect, useState } from 'react'
import { fetchUsers } from '@/src/slices/users'
import UnsplashDrawer from '@/src/components/sub-navbar/unsplash-in-drawer'

const SubNavbar = (props: any): JSX.Element => {
  const project = props.project
  const [users, setUsers]: [any[], Function] = useState([])

  useEffect(() => {
    const usersIds: string[] = [...project.users, project.createdBy]
    const userPromise: Array<Promise<any>> = usersIds.map(async uId => await fetch(`/api/users/${uId}`))
    void Promise.all(userPromise)
      .then(results => Promise.all(results.map(r => r.json())))
      .then(usersData => setUsers(usersData))
  }, [project])

  const loadProjectUsers = (): JSX.Element[] => {
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
        {project?.name}
      </Heading>
      <Box>{loadProjectUsers()}</Box>
      <Box>
        <InviteModal project={project} />
        <ProjectSettings project={project} />
        <UnsplashDrawer />
      </Box>
    </Box>
  )
}

SubNavbar.propTypes = {
  project: PropType.object
}

export default SubNavbar
