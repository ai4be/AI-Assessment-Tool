import type { NextApiRequest, NextApiResponse } from 'next'
import { getProjectUsers } from '@/src/models/project'
import { isConnected, hasProjectAccess } from '@/util/temp-middleware'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId } = req.query

  switch (req.method) {
    case 'GET': {
      const users = await getProjectUsers(projectId)
      return res.status(200).json(users)
    }
    default:
      return res.status(404).send({ message: 'Not found', code: 9006 })
  }
}

export default isConnected(hasProjectAccess(handler))
