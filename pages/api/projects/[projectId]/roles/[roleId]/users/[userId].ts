import type { NextApiRequest, NextApiResponse } from 'next'
import { addUserToRole, removeUserFromRole } from '@/util/role'
import { isConnected, hasProjectAccess } from '@/util/temp-middleware'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId, roleId, userId } = req.query

  if (!await isConnected(req, res)) return
  if (!await hasProjectAccess(req, res, String(projectId))) return

  switch (req.method) {
    case 'POST': {
      await addUserToRole(projectId, roleId, userId)
      return res.send(201)
    }
    case 'DELETE': {
      // const res =
      await removeUserFromRole(projectId, roleId, userId)
      return res.send(201)
    }
    default:
      res.status(404).send({ message: 'Not found' })
      break
  }
}
