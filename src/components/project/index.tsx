import React, { FC } from 'react'
import { Box } from '@chakra-ui/react'
import ProjectColumns from '@/src/components/project/columns'
import { ProjectContextProvider } from '@/src/store/project-context'
import SideBar from './side-bar'
import NavBar from '../navbar'
import ProgressBar from './progress-bar'
import ProjectBar from '@/src/components/project/project-bar'

interface Props {
  project: any
  session: any
  categories: any[]
}

const Project: FC<Props> = ({ project, session, categories }): JSX.Element => {
  return (
    <Box bgColor='#F7F7F7'>
      {project != null &&
        <ProjectContextProvider project={project} categories={categories}>
          <NavBar bg='white' />
          <Box display='flex' alignItems='center' flexDirection='column' ml='2rem' mr='2rem'>
            <Box width='100%' my='1%'>
              <ProgressBar />
            </Box>
            <Box boxShadow='base' rounded='lg' p='1em' pl='0' bgColor='white'>
              <ProjectBar project={project} />
              <Box display='flex' position='relative'>
                <SideBar />
                <ProjectColumns projectId={project._id} session={session} />
              </Box>
            </Box>
          </Box>
        </ProjectContextProvider>}
    </Box>
  )
}

export default Project
