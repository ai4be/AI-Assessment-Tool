import type { NextApiRequest, NextApiResponse } from 'next'
import { updateRole, getRole, removeRole } from '@/src/models/role'
import { isConnected, hasProjectAccess } from '@/util/temp-middleware'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId, roleId } = req.query

  switch (req.method) {
    case 'PATCH': {
      const { name, desc } = req.body
      await updateRole(projectId, { _id: roleId, name, desc })
      const role = await getRole(projectId, roleId)
      return res.status(200).json(role)
    }
    case 'DELETE': {
      const success = await removeRole(projectId, roleId)
      return success ? res.send(201) : res.send(400)
    }
    default:
      res.send({ message: 'DB error' })
      break
  }
}

export default isConnected(hasProjectAccess(handler))
