import { Context, createContext, useEffect, useState } from 'react'
import { Category, Project } from '../types/projects'
import { useRouter } from 'next/router'
import { fetchUsersByProjectId } from '@/util/users'
import { UserContextProvider } from './user-context'

interface ProjectContextType {
  project?: Project | undefined
  categories?: Category[]
  selectedStage?: any
  setProject?: any
  categoryClickHandler?: any
  stageClickHandler?: any
  users?: any[]
  stages?: any[]
  stage?: any
}

const ProjectContext: Context<ProjectContextType> = createContext({})

export function ProjectContextProvider (props: any): JSX.Element {
  const router = useRouter()
  const { stage = 'ALL' } = router.query
  const [project, setProject] = useState<Project>(props.project)
  const [categories] = useState<Category[]>(props.categories)
  const [stages] = useState<any[]>(props.stages)
  const [users, setUsers] = useState<any[]>([])

  useEffect((): void => {
    if (Array.isArray(project.users)) {
      void fetchUsersByProjectId(project._id).then(u => setUsers(u))
    }
  }, [project.users])

  function categoryClickHandler (cat: Category): void {
    const currentCat = router.query?.cat
    const query: any = { ...router.query, cat: cat._id }
    if (currentCat === cat._id) {
      delete query.cat
    }
    void router.push({
      pathname: `/projects/${String(project._id)}`,
      query
    }, undefined, { shallow: true })
  }

  function stageClickHandler (stage: string): void {
    const query = { ...router.query, stage }
    void router.push({
      pathname: `/projects/${String(project._id)}`,
      query
    }, undefined, { shallow: true })
  }

  const context: ProjectContextType = {
    project,
    setProject,
    categories,
    categoryClickHandler,
    stageClickHandler,
    users,
    stage,
    stages
  }

  return (
    <UserContextProvider>
      <ProjectContext.Provider value={context}>
        {props.children}
      </ProjectContext.Provider>
    </UserContextProvider>
  )
}

export default ProjectContext
