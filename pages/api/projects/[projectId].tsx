import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteProject, getProject, updateProject } from '@/src/models/project'
import { hasProjectAccess, isConnected } from '@/util/temp-middleware'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId } = req.query

  switch (req.method) {
    case 'GET': {
      const project = await getProject(projectId)
      return res.send(project)
    }
    case 'PATCH': {
      const success = await updateProject(projectId, req.body)
      return success ? res.status(201).end() : res.status(400).end()
    }
    case 'DELETE': {
      const success = await deleteProject(projectId)
      return success ? res.status(201).end() : res.status(400).end()
    }
    default:
      return res.status(404).send({ message: 'not found' })
  }
}

export default isConnected(hasProjectAccess(handler))
