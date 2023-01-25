import React, { FC } from 'react'
import { Box } from '@chakra-ui/react'
import ProjectColumns from '@/src/components/project/columns'
import { ProjectContextProvider } from '@/src/store/project-context'
import SideBar from './side-bar'
import NavBar from '../navbar'
import ProgressBar from './progress-bar'
import { Project } from '@/src/types/project'

interface Props {
  project: Project
  session: any
  categories: any[]
}

const Project: FC<Props> = (props): JSX.Element => {
  return (
    <Box bgColor='#F7F7F7'>
      {props.project != null &&
        <ProjectContextProvider {...props}>
          <NavBar bg='white' />
          <Box display='flex' alignItems='center' flexDirection='column' ml='2rem' mr='2rem'>
            <Box width='100%' my='1%'>
              <ProgressBar />
            </Box>
            <Box boxShadow='base' rounded='lg' p='1em' pl='0' bgColor='white'>
              <Box display='flex' position='relative'>
                <SideBar />
                <ProjectColumns project={props.project} session={props.session} />
              </Box>
            </Box>
          </Box>
        </ProjectContextProvider>}
    </Box>
  )
}

export default Project
