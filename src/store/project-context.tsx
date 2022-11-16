import { Context, createContext, useState } from 'react'
import { Project } from '../types/projects'

interface ProjectContextType {
  board: Project | undefined
  setProject: (project: any) => {}
}

const ProjectContext: Context<ProjectContextType> = createContext({
  project: null,
  setProject: (project: Project) => {}
})

export function ProjectContextProvider (props): JSX.Element {
  const [project, setProject] = useState<Project>()

  const context: ProjectContextType = {
    project,
    setProject
  }

  return (
    <ProjectContext.Provider value={context}>
      {props.children}
    </ProjectContext.Provider>
  )
}

export default ProjectContext
