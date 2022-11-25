import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  let { slug } = req.query
  slug = ObjectId(sanitize(slug))

  const { db, client } = await connectToDatabase()

  if (client.isConnected() && session?.user != null) {
    const requestType = req.method

    switch (requestType) {
      case 'GET': {
        const columns = await db.collection('columns').find({ projectId: slug }).toArray()
        return res.send(columns)
      }
      case 'POST': {
        const user = await db.collection('users').findOne({ email: session?.user?.email })
        let {
          name,
          sequence
        } = req.body
        name = sanitize(name)
        sequence = sanitize(sequence)

        const data = {
          projectId: slug,
          createdAt: new Date(),
          userId: user._id,
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
  } else {
    res.send({ msg: 'DB connection error', status: 400 })
  }
}
