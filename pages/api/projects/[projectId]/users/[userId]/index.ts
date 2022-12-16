import type { NextApiRequest, NextApiResponse } from 'next'
import { isConnected, hasProjectAccess } from '@/util/temp-middleware'
import { removeUser } from '@/util/project'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId, userId } = req.query

  switch (req.method) {
    case 'DELETE': {
      await removeUser(projectId, userId)
      return res.send(201)
    }
    default:
      res.status(404).send({ message: 'not found' })
      break
  }
}

export default isConnected(hasProjectAccess(handler))
