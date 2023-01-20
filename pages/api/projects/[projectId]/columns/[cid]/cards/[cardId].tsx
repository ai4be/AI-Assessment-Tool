import type { NextApiRequest, NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import { hasProjectAccess, isConnected } from '@/util/temp-middleware'
import { connectToDatabase } from '@/src/models/mongodb'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { cardId, cid } = req.query

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

export default isConnected(hasProjectAccess(handler))
