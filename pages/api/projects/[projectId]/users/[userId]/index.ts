import type { NextApiRequest, NextApiResponse } from 'next'
import { isConnected, hasProjectAccess, getUserFromRequest } from '@/util/temp-middleware'
import { removeUserAndCreateActivity } from '@/src/models/project'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId, userId } = req.query
  const user = getUserFromRequest(req)

  switch (req.method) {
    case 'DELETE': {
      await removeUserAndCreateActivity(projectId, user?._id, userId)
      return res.send(201)
    }
    default:
      res.status(404).send({ message: 'not found' })
      break
  }
}

export default isConnected(hasProjectAccess(handler))
