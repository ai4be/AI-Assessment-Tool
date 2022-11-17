import React from 'react'
import { Box } from '@chakra-ui/react'
import SubNavbar from '@/src/components/sub-navbar'
import ProjectColumns from '@/src/components/project/columns'
import PropType from 'prop-types'
import { ProjectContextProvider } from '@/src/store/project-context'
import SideBar from './side-bar'
import NavBar from '../navbar'
import ProgressBar from './progress-bar'

const Project = ({ project, session, categories }): JSX.Element => {
  return (
    <Box bgColor='#F7F7F7'>
      {project != null &&
        <ProjectContextProvider project={project} categories={categories}>
          <NavBar bg='white' />
          <SubNavbar project={project} />
          <Box display='flex' alignItems='center' flexDirection='column' ml='2rem' mr='2rem'>
            <ProgressBar />
            <Box display='flex' mt='1%' boxShadow='base' rounded='lg' p='1em' pl='0' bgColor='white'>
              <SideBar />
              <ProjectColumns projectId={project._id} session={session} />
            </Box>
          </Box>
        </ProjectContextProvider>}
    </Box>
  )
}

Project.propTypes = {
  project: PropType.object,
  session: PropType.object,
  categories: PropType.array
}

export default Project
