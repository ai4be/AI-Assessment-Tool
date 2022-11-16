import React, { useContext } from 'react'
import { Box } from '@chakra-ui/react'
import UserNavbar from '@/src/components/user-navbar'
import SubNavbar from '@/src/components/sub-navbar'
import ProjectColumns from '@/src/components/project/columns'
import PropType from 'prop-types'
import ProjectContext, { ProjectContextProvider } from '@/src/store/project-context'

const Project = ({ project, session }): JSX.Element => {
  const projectContext = useContext(ProjectContext)
  projectContext.setProject(project)
  // console.log('in here')

  return (
    <Box
      backgroundImage={`url('${String(project?.backgroundImage)}')`}
      backgroundPosition='center'
      h='100vh'
      backgroundRepeat='no-repeat'
      backgroundSize='cover'
    >
      {project != null &&
        <ProjectContextProvider>
          <UserNavbar />
          <SubNavbar project={project} />
          <ProjectColumns projectId={project._id} session={session} />
        </ProjectContextProvider>}
    </Box>
  )
}

Project.propTypes = {
  project: PropType.object,
  session: PropType.object
}

export default Project
