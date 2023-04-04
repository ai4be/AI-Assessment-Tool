import type { NextApiRequest, NextApiResponse } from 'next'
import { addUserToRoleAndCreateActivity, removeUserFromRoleAndCreateActivity } from '@/src/models/role'
import { isConnected, hasProjectAccess, getUserFromRequest } from '@/util/temp-middleware'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId, roleId, userId } = req.query
  const user = getUserFromRequest(req)

  switch (req.method) {
    case 'POST': {
      await addUserToRoleAndCreateActivity(projectId, roleId, user?._id, userId)
      return res.send(201)
    }
    case 'DELETE': {
      await removeUserFromRoleAndCreateActivity(projectId, roleId, user?._id, userId)
      return res.send(201)
    }
    default:
      return res.status(400).send({ message: 'Invalid request', code: 9002 })
  }
}

export default isConnected(hasProjectAccess(handler))
