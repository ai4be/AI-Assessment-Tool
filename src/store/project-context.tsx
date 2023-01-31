import { Context, createContext, useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { Category, Project } from '@/src/types/project'
import { UserContextProvider } from '@/src/store/user-context'
import { QueryFilterKeys } from '@/src/components/project/project-bar/filter-menu'
import { fetcher } from '@/util/api'

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
  const { data: users } = useSWR(`/api/projects/${project._id}/users`, fetcher)

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
