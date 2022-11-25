import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { db, client } = await connectToDatabase()

  if (session?.data == null) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (client.isConnected()) {
    const requestType = req.method

    switch (requestType) {
      case 'PATCH': {
        let { email, projectId } = req.body
        email = email != null ? sanitize(email.trim().toLowerCase()) : email
        projectId = sanitize(projectId)
        const user = await db.collection('users').findOne({ email })
        const project = await db
          .collection('projects')
          .updateOne({ _id: ObjectId(projectId) }, { $addToSet: { users: user?._id } })

        if (project != null && project.result.ok === 1) {
          return res.send({ status: 200, message: 'Invited' })
        }
        return res.send({ status: 404, message: 'Some issues' })
      }
      default:
        res.send({ message: 'DB error' })
        break
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 })
  }
}
