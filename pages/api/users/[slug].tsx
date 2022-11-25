import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { slug } = req.query
  slug = sanitize(slug)

  const { db, client } = await connectToDatabase()

  if (client.isConnected()) {
    const requestType = req.method

    switch (requestType) {
      case 'GET': {
        const user = await db.collection('users').findOne({ _id: ObjectId(slug) })
        console.log(slug, user)
        res.send(user)
        break
      }
      case 'PATCH': {
        break
      }
      case 'DELETE': {
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
