import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase, toObjectId } from '@/util/mongodb'
import sanitize from 'mongo-sanitize'
import { unstable_getServerSession } from 'next-auth'
import { hasProjectAccess, isConnected } from '@/util/temp-middleware'
import { authOptions } from '../../../../../auth/[...nextauth]'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  let { projectId, cid } = req.query
  cid = toObjectId(cid)
  projectId = toObjectId(projectId)

  const { db } = await connectToDatabase()

  switch (req.method) {
    case 'GET': {
      const columns = await db.collection('cards').find({ projectId }).toArray()
      return res.send(columns)
    }
    case 'POST': {
      const user = (req as any).locals?.user
      const {
        title,
        type,
        description,
        sequence
      } = req.body

      const tempData = {
        title,
        type,
        description,
        sequence
      }
      Object.keys(tempData).forEach(k => (tempData[k] = sanitize(tempData[k])))

      const data = {
        ...tempData,
        projectId,
        columnId: cid,
        createdAt: new Date(),
        userId: user._id
      }

      const card = await db.collection('cards').insertOne(data)
      return res.send(card)
    }
    case 'DELETE': {
      await db.collection('columns').remove({ projectId })
      return res.send({ message: 'All columns deleted' })
    }
    default:
      res.send({ message: 'DB error' })
      break
  }
}

export default isConnected(hasProjectAccess(handler))
