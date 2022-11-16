import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { slug } = req.query

  const { db, client } = await connectToDatabase()

  if (client.isConnected()) {
    const requestType = req.method

    switch (requestType) {
      case 'GET': {
        const columns = await db.collection('columns').find({ projectId: slug }).toArray()
        return res.send(columns)
      }
      case 'POST': {
        const {
          id,
          projectId,
          columnName,
          dateCreated,
          userId,
          // cards,
          sequence
        } = req.body

        const data = {
          _id: id,
          projectId,
          columnName,
          dateCreated,
          userId,
          sequence
        }

        const col = await db.collection('columns').insertOne(data)
        return res.send(col)
      }
      default:
        res.send({ message: 'DB error' })
        break
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 })
  }
}
