import { Context, createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Category, Project } from '@/src/types/project'
import { fetchUsersByProjectId } from '@/util/users'
import { UserContextProvider } from '@/src/store/user-context'
import { QueryFilterKeys } from '@/src/components/project/project-bar/filter-menu'

interface ProjectContextType {
  project?: Project | undefined
  categories?: Category[]
  setProject?: any
  categoryClickHandler?: any
  users?: any[]
}

const ProjectContext: Context<ProjectContextType> = createContext({})

export function ProjectContextProvider (props: any): JSX.Element {
  const router = useRouter()
  const [project, setProject] = useState<Project>(props.project)
  const [categories] = useState<Category[]>(props.categories)
  const [users, setUsers] = useState<any[]>([])

  useEffect((): void => {
    if (Array.isArray(project.userIds)) {
      void fetchUsersByProjectId(project._id).then(u => setUsers(u))
    }
  }, [project.userIds])

  function categoryClickHandler (cat: Category): void {
    const {
      [QueryFilterKeys.CATEGORY]: currentCat
    } = router.query ?? {}
    const query: any = { ...router.query, [QueryFilterKeys.CATEGORY]: cat._id }

    if (currentCat === cat._id) delete query[QueryFilterKeys.CATEGORY]
    void router.push({
      query
    }, undefined, { shallow: true })
  }

  const context: ProjectContextType = {
    project,
    setProject,
    categories,
    categoryClickHandler,
    users
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
