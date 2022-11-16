import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { slug } = req.query

  const { db, client } = await connectToDatabase()

  if (client.isConnected()) {
    const requestType = req.method

    switch (requestType) {
      case 'GET': {
        const columns = await db.collection('cards').find({ projectId: slug }).toArray()
        return res.send(columns)
      }
      case 'POST': {
        const {
          id,
          projectId,
          columnId,
          dateCreated,
          userId,
          title,
          type,
          description,
          sequence
        } = req.body

        const data = {
          _id: id,
          projectId,
          columnId,
          title,
          type,
          dateCreated,
          userId,
          sequence,
          description
        }

        const card = await db.collection('cards').insertOne(data)
        return res.send(card)
      }
      case 'DELETE': {
        const { slug } = req.query
        await db.collection('columns').remove({ projectId: slug })
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
