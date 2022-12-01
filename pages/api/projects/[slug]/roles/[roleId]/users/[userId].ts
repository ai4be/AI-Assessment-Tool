import type { NextApiRequest, NextApiResponse } from 'next'
import { addUserToRole, removeUserFromRole } from '@/util/role'
import { handler as isConnected } from '@/util/temp-middleware'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (isConnected(req, res) == null) return

  const { slug, roleId, userId } = req.query

  switch (req.method) {
    case 'POST': {
      // const res =
      await addUserToRole(slug, roleId, userId)
      return res.send(201)
    }
    case 'DELETE': {
      // const res =
      await removeUserFromRole(slug, roleId, userId)
      return res.send(201)
    }
    default:
      res.status(404).send({ message: 'Not found' })
      break
  }
}
