import React, { useContext } from 'react'
import {
  Box, Avatar, AvatarGroup, Flex, Text
} from '@chakra-ui/react'

import ProjectSettings, { ProjectSettingsContextProvider } from '@/src/components/project/project-settings'
import ProjectContext from '@/src/store/project-context'
import { getUserDisplayName } from '@/util/users'
import { SortMenu } from '@/src/components/project/project-bar/sort-menu'
import { FilterMenu } from '@/src/components/project/project-bar/filter-menu'

const ProjectBar = ({ project }: { project: any }): JSX.Element => {
  const { users = [] } = useContext(ProjectContext)

  return (
    <Flex justifyContent='center' alignItems='center' position='relative' height='40px'>
      <Box position='absolute' left='0'>
        <SortMenu />
        <FilterMenu ml='1' />
      </Box>
      <Text color='var(--main-blue)' as='b' textDecoration='underline' maxWidth='200px;' whiteSpace='nowrap' textOverflow='ellipsis' overflow='hidden'>
        {project.name}
      </Text>
      <Flex
        position='absolute'
        right='0'
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

export default ProjectBar
