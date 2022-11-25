import { Box, Avatar, Tooltip, AvatarGroup } from '@chakra-ui/react'

import PropType from 'prop-types'
import ProjectSettings from '@/src/components/sub-navbar/project-settings'
import React, { useEffect, useState } from 'react'
import { BiUser } from 'react-icons/bi'
import { fetchUsers } from '@/util/users-fe'

const SubNavbar = (props: any): JSX.Element => {
  const project = props.project
  const [users, setUsers]: [any[], Function] = useState([])

  useEffect(() => {
    const usersIds: string[] = [...project.users, project.createdBy]
    void fetchUsers(usersIds).then(usersData => setUsers(usersData))
  }, [project.users, project.createdBy])

  return (
    <Box
      height='40px'
      display='flex'
      alignItems='center'
      justifyContent='flex-end'
      bg='transparent'
    >
      {/* <Box>{loadProjectUsers()}</Box> */}
      <AvatarGroup size='sm' max={4}>
        {users.map((u, idx) => (<Avatar key={idx} bg='transparent' icon={<BiUser size='20' className='icon-blue-color' />} />))}
      </AvatarGroup>
      <Box>
        {/* <InviteModal project={project} /> */}
        <ProjectSettings project={project} />
      </Box>
    </Box>
  )
}

SubNavbar.propTypes = {
  project: PropType.object
}

export default SubNavbar
