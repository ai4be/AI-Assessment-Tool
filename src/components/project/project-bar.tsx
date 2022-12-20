import React, { useContext } from 'react'
import { Box, Avatar, AvatarGroup, Flex, Text } from '@chakra-ui/react'

import PropType from 'prop-types'
import ProjectSettings, { ProjectSettingsContextProvider } from '@/src/components/project/project-settings'
import ProjectContext from '@/src/store/project-context'
import { getUserDisplayName } from '@/util/users-fe'

const ProjectBar = ({ project }): JSX.Element => {
  const { users } = useContext(ProjectContext)
  return (
    <Flex justifyContent='center' alignItems='center' position='relative'>
      <Text>
        {project.name}
      </Text>
      <Flex
        position='absolute'
        right='0'
        height='40px'
        alignItems='center'
        justifyContent='flex-end'
        bg='transparent'
        justifySelf='flex-end'
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
      </Flex>
    </Flex>
  )
}

ProjectBar.propTypes = {
  project: PropType.object
}

export default ProjectBar
