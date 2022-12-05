import React, { useContext } from 'react'
import { Box, Avatar, AvatarGroup } from '@chakra-ui/react'

import PropType from 'prop-types'
import ProjectSettings, { ProjectSettingsContextProvider } from '@/src/components/sub-navbar/project-settings'
import ProjectContext from '@/src/store/project-context'
import { getUserDisplayName } from '@/util/users-fe'

const SubNavbar = ({ project }): JSX.Element => {
  const { users } = useContext(ProjectContext)
  return (
    <Box
      height='40px'
      display='flex'
      alignItems='center'
      justifyContent='flex-end'
      bg='transparent'
    >
      {/* <Box>{loadProjectUsers()}</Box> */}
      <AvatarGroup size='sm' max={5}>
        {/* {users.map((u, idx) => (<Avatar key={idx} bg='transparent' icon={<BiUser size='20' className='icon-blue-color' />} />))} */}
        {Array.isArray(users) && users.map(user => <Avatar key={user._id} name={getUserDisplayName(user)} src={user.xsAvatar} />)}
      </AvatarGroup>
      <Box>
        {/* <InviteModal project={project} /> */}
        <ProjectSettingsContextProvider>
          <ProjectSettings project={project} />
        </ProjectSettingsContextProvider>
      </Box>
    </Box>
  )
}

SubNavbar.propTypes = {
  project: PropType.object
}

export default SubNavbar
