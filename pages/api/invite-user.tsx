import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { db, client } = await connectToDatabase()

  if (client.isConnected()) {
    const requestType = req.method

    switch (requestType) {
      case 'PATCH': {
        const { email, projectId } = req.body
        const user = await db.collection('users').findOne({ email })
        const projectData = await db.collection('projects').findOne({ _id: projectId })

        const isExistingUser = projectData.users.indexOf(user._id)

        if (isExistingUser > -1) {
          res.status(400).send({ message: 'User is already added to the project' })
        } else {
          const project = await db
            .collection('projects')
            .updateOne({ _id: projectId }, { $push: { users: user?._id } })

          if (project != null && project.result.ok === 1) {
            res.send({ status: 200, message: 'Invited' })
          } else {
            res.send({ status: 404, message: 'Some issues' })
          }
        }
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
