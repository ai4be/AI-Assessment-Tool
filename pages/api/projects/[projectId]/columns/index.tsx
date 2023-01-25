import type { NextApiRequest, NextApiResponse } from 'next'
import { hasProjectAccess, isConnected } from '@/util/temp-middleware'
import { getColumns } from '@/src/models/column'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId } = req.query

  switch (req.method) {
    case 'GET': {
      const columns = await getColumns({ projectId })
      return res.send(columns)
    }
    default:
      return res.status(400).send({ message: 'Invalid request' })
  }
}

export default isConnected(hasProjectAccess(handler))
