import { Context, createContext, useEffect, useState } from 'react'
import { Category, Project } from '../types/projects'
import { useRouter } from 'next/router'
import { fetchUsersByProjectId } from '@/util/users-fe'

interface ProjectContextType {
  project: Project | undefined
  categories: Category[]
  selectedCategory: any
  setProject: (project: Project) => {}
  categoryClickHandler: (cat: any) => {}
  users: any[]
}

const ProjectContext: Context<ProjectContextType> = createContext({
  project: null,
  setProject: (project: Project) => {},
  categories: [],
  selectedCategory: null,
  categoryClickHandler: (cat: Category) => {}
})

export function ProjectContextProvider (props: any): JSX.Element {
  const router = useRouter()
  const { cat: catId } = router.query
  const [project, setProject] = useState<Project>(props.project)
  const [categories, setCategories] = useState<Category[]>(props.categories)
  const [selectedCategory, setSelectedCategory] = useState<Category>(props.selectedCategory)
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    if (Array.isArray(categories) && catId != null) {
      const cat = categories.find((cat) => cat._id === catId)
      if (cat != null) setSelectedCategory(cat)
    } else if (Array.isArray(categories) && catId == null) {
      categoryClickHandler(categories[0])
    }
  }, [selectedCategory, catId, categories])

  useEffect(() => {
    if (Array.isArray(categories) && catId != null) {
      const cat = categories.find((cat) => cat._id === catId)
      if (cat != null) setSelectedCategory(cat)
    } else if (Array.isArray(categories) && catId == null) {
      categoryClickHandler(categories[0])
    }
  }, [selectedCategory, catId, categories])

  useEffect((): void => {
    if (Array.isArray(project.users)) {
      void fetchUsersByProjectId(project._id).then(u => {
        console.log('fetchUsers', project.users, u)
        setUsers(u)
      })
    }
  }, [project.users])

  function categoryClickHandler (cat: Category): void {
    void router.push(`/projects/${String(project._id)}?cat=${cat._id}`, undefined, { shallow: true })
  }

  const context: ProjectContextType = {
    project,
    setProject,
    categories,
    selectedCategory,
    categoryClickHandler,
    users
  }

  return (
    <ProjectContext.Provider value={context}>
      {props.children}
    </ProjectContext.Provider>
  )
}

export default ProjectContext
