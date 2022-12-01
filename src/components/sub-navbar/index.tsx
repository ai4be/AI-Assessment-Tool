import React, { useEffect, useState, useContext } from 'react'
import { Box, Avatar, Tooltip, AvatarGroup } from '@chakra-ui/react'

import PropType from 'prop-types'
import ProjectSettings, { ProjectSettingsContextProvider } from '@/src/components/sub-navbar/project-settings'
import ProjectContext from '@/src/store/project-context'

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
        {users.map(user => <Avatar key={user._id} name={user.fullName ?? user.email} />)}
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
