import { Context, createContext, useEffect, useState } from 'react'
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

  useEffect(() => {
    if (selectedCategory == null && categories?.length > 0) setSelectedCategory(categories[0])
  }, [categories, selectedCategory])

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
