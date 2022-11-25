import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'
import { removeUser } from '@/util/project'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { client } = await connectToDatabase()

  if (client.isConnected()) {
    let { slug, userId } = req.query
    slug = ObjectId(sanitize(slug))
    userId = ObjectId(sanitize(userId))
    const requestType = req.method

    switch (requestType) {
      case 'DELETE': {
        await removeUser(slug, userId)
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
