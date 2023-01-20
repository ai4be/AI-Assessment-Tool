import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase, toObjectId } from '@/src/models/mongodb'
import sanitize from 'mongo-sanitize'
import { hasProjectAccess, isConnected } from '@/util/temp-middleware'
import { getColumns } from '@/src/models/column'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { projectId } = req.query
  projectId = toObjectId(projectId)

  const { db } = await connectToDatabase()

  switch (req.method) {
    case 'GET': {
      const columns = await getColumns({ projectId })
      return res.send(columns)
    }
    case 'POST': {
      const user = (req as any).locals?.user
      let {
        name,
        sequence
      } = req.body
      name = sanitize(name)
      sequence = sanitize(sequence)

      const data = {
        projectId,
        createdAt: new Date(),
        userId: user?._id,
        name,
        sequence
      }

      const col = await db.collection('columns').insertOne(data)
      return res.send(col)
    }
    default:
      res.send({ message: 'DB error' })
      break
  }
}

export default isConnected(hasProjectAccess(handler))
