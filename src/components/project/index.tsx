import React from 'react'
import { Box } from '@chakra-ui/react'
import SubNavbar from '@/src/components/sub-navbar'
import ProjectColumns from '@/src/components/project/columns'
import PropType from 'prop-types'
import { ProjectContextProvider } from '@/src/store/project-context'
import SideBar from './side-bar'
import NavBar from '../navbar'

const Project = ({ project, session, categories }): JSX.Element => {
  return (
    <Box>
      {project != null &&
        <ProjectContextProvider project={project} categories={categories}>
          <NavBar bg='white' />
          <SubNavbar project={project} />
          <SideBar>
            <ProjectColumns projectId={project._id} session={session} />
          </SideBar>
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
