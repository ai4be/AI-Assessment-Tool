import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { slug } = req.query

  const { db, client } = await connectToDatabase()

  if (client.isConnected()) {
    const requestType = req.method

    switch (requestType) {
      case 'GET': {
        const project = await db.collection('projects').findOne({ _id: slug })
        res.send(project)

        break
      }
      case 'PATCH': {
        const { _id, name, dateCreated, createdBy, backgroundImage } = req.body

        const data = {
          _id,
          name,
          dateCreated,
          createdBy,
          backgroundImage
        }

        const project = await db.collection('projects').updateOne({ _id: slug }, { $set: data })
        res.send(project)
        break
      }
      case 'DELETE': {
        await db.collection('cards').remove({ projectId: slug })
        await db.collection('columns').remove({ projectId: slug })
        await db.collection('projects').deleteOne({ _id: slug })

        res.send({ messsage: 'Delete project with columns and cards' })
        break
      }
      default:
        res.send({ message: 'DB error' })
        break
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 })
  }
}
