import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
import { hasProjectAccess, isConnected } from '@/util/temp-middleware'
import { connectToDatabase } from '@/util/mongodb'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { cardId, cid, projectId } = req.query

  if (!await isConnected(req, res)) return
  if (!await hasProjectAccess(req, res, String(projectId))) return

  const { db } = await connectToDatabase()

  switch (req.method) {
    case 'DELETE': {
      await db.collection('cards').deleteOne({ _id: ObjectId(cardId), columnId: ObjectId(cid) })
      res.send({ messsage: 'Deleted' })
      break
    }
    default:
      res.send({ message: 'Invalid request type' })
      break
  }
}
