import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { db, client } = await connectToDatabase()

  if (client.isConnected()) {
    let { slug, roleId } = req.query
    slug = ObjectId(sanitize(slug))
    roleId = ObjectId(sanitize(roleId))

    const requestType = req.method
    switch (requestType) {
      case 'POST': {
        let { _id: userId } = req.body
        userId = sanitize(userId)
        await db
          .collection('projects')
          .updateOne(
            { _id: slug, 'roles._id': roleId },
            { $addToSet: { 'roles.$.userIds': userId } }
          )
        return res.send(201)
      }
      case 'DELETE': {
        let { _id } = req.body
        _id = sanitize(_id)
        await db
          .collection('projects')
          .updateOne({ _id: slug , 'roles._id': roleId }, { $pull: { 'roles.$.userIds': { _id } } })
        return res.send(201)
      }
      default:
        res.send({ message: 'DB error' })
        break
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 })
  }
}
