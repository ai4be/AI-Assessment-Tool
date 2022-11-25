import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { slug } = req.query
  slug = ObjectId(sanitize(slug))

  const { db, client } = await connectToDatabase()

  if (client.isConnected()) {
    const requestType = req.method

    switch (requestType) {
      case 'GET': {
        const columns = await db.collection('cards').find({ projectId: slug }).toArray()
        return res.send(columns)
      }
      case 'DELETE': {
        const { slug } = req.query
        await db.collection('cards').deleteOne({ projectId: slug })
        return res.send({ message: 'All columns deleted' })
      }
      default:
        res.send({ message: 'DB error' })
        break
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 })
  }
}
