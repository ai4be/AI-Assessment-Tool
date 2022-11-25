import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '../../../../../auth/[...nextauth]'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  let { slug, cid } = req.query
  slug = ObjectId(sanitize(slug))
  cid = ObjectId(sanitize(cid))

  const { db, client } = await connectToDatabase()

  if (client.isConnected()) {
    const requestType = req.method

    switch (requestType) {
      case 'GET': {
        const columns = await db.collection('cards').find({ projectId: slug }).toArray()
        return res.send(columns)
      }
      case 'POST': {
        const user = await db.collection('users').findOne({ email: session?.user?.email })
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
          projectId: slug,
          columnId: cid,
          createdAt: new Date(),
          userId: user._id
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
