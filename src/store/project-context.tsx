import { Context, createContext, useState } from 'react'
import { Category, Project } from '../types/projects'

interface ProjectContextType {
  project: Project | undefined
  categories: Category[]
  selectedCategory: any
  setProject: (project: Project) => {}
  setSelectedCategory: (cat: any) => {}
}

const ProjectContext: Context<ProjectContextType> = createContext({
  project: null,
  setProject: (project: Project) => {},
  categories: [],
  selectedCategory: null,
  setSelectedCategory: (cat: Category) => {}
})

export function ProjectContextProvider (props: any): JSX.Element {
  const [project, setProject] = useState<Project>(props.project)
  const [categories, setCategories] = useState<Category[]>(props.categories)
  const [selectedCategory, setSelectedCategory] = useState<Category>()

  const context: ProjectContextType = {
    project,
    setProject,
    categories,
    selectedCategory,
    setSelectedCategory
  }

  return (
    <ProjectContext.Provider value={context}>
      {props.children}
    </ProjectContext.Provider>
  )
}

export default ProjectContext
