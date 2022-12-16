import type { NextApiRequest, NextApiResponse } from 'next'
import { addRole } from '@/util/role'
import { isConnected, hasProjectAccess } from '@/util/temp-middleware'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId } = req.query

  switch (req.method) {
    case 'POST': {
      const { name, desc } = req.body
      const role = await addRole(projectId, { name, desc })
      return res.status(200).json(role)
    }
    default:
      res.send({ message: 'DB error' })
      break
  }
}

export default isConnected(hasProjectAccess(handler))
