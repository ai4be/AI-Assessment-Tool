import type { NextApiRequest, NextApiResponse } from 'next'
import { createProjectWithDefaultColumnsAndCards, getProject, getUserProjects } from '@/util/project'
import { dataToCards } from '@/util/data'
import { defaultCards, defaultRoles } from '@/src/data'
import { addRoles } from '@/util/role'
import { isConnected } from '@/util/temp-middleware'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const anyReq = req as any
  const user = anyReq.locals.user
  switch (req.method) {
    case 'POST': {
      const { name, description, industry } = req.body
      const cardsData = await dataToCards(defaultCards)
      const projectId = await createProjectWithDefaultColumnsAndCards({ name, description, industry, createdBy: user?._id }, cardsData)
      await addRoles(projectId, defaultRoles)
      const project = await getProject(projectId)
      return res.send(project)
    }
    case 'GET': {
      const projects = await getUserProjects(user?._id)
      return res.send(projects)
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}

export default isConnected(handler)
