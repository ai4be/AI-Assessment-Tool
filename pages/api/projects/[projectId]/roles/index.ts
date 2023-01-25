import type { NextApiRequest, NextApiResponse } from 'next'
import { addRoleAndCreateActivity } from '@/src/models/role'
import { isConnected, hasProjectAccess, getUserFromRequest } from '@/util/temp-middleware'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId } = req.query
  const user = getUserFromRequest(req)

  switch (req.method) {
    case 'POST': {
      const { name, desc } = req.body
      const role = await addRoleAndCreateActivity(projectId, { name, desc }, user?._id)
      return res.status(200).json(role)
    }
    default:
      return res.status(400).send({ message: 'Invalid request' })
  }
}

export default isConnected(hasProjectAccess(handler))
