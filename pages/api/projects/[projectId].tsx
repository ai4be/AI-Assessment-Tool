import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteProjectAndCreateActivity, getProject, updateProjectAndCreateActivity } from '@/src/models/project'
import { getUserFromRequest, hasProjectAccess, isConnected } from '@/util/temp-middleware'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId } = req.query
  const user = getUserFromRequest(req)

  switch (req.method) {
    case 'GET': {
      const project = await getProject(projectId)
      return res.send(project)
    }
    case 'PATCH': {
      const success = await updateProjectAndCreateActivity(projectId, req.body, user?._id)
      return success ? res.status(201).end() : res.status(400).end()
    }
    case 'DELETE': {
      const success = await deleteProjectAndCreateActivity(projectId, user?._id)
      return success ? res.status(201).end() : res.status(400).end()
    }
    default:
      return res.status(400).send({ message: 'Invalid request', code: 9002 })
  }
}

export default isConnected(hasProjectAccess(handler))
