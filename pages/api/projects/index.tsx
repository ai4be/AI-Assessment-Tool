import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { authOptions } from '../auth/[...nextauth]'
import { unstable_getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'
import { getUserProjects } from '@/util/project'
import { getUser } from '@/util/user'

const defaultColumns = ['to do', 'busy', 'done']

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { client } = await connectToDatabase()

  if (session == null) {
    return res.send({ error: 'You must be signed in to access this api route' })
  }

  if (client.isConnected() && session?.user != null) {
    const db = client.db()
    console.log('session', session)
    const existingUser = await getUser({ email: String(session.user?.email) })
    const requestType = req.method

    switch (requestType) {
      case 'POST': {
        const { name } = req.body
        const data = {
          _id: ObjectId(),
          name,
          createdAt: Date.now(),
          createdBy: existingUser._id,
          users: []
        }
        const project = await db.collection('projects').insertOne(data)
        const projectColsData = defaultColumns.map((cn, idx) => ({
          _id: ObjectId(),
          projectId: data._id,
          name: cn,
          createdAt: Date.now(),
          createdBy: existingUser._id,
          idx
        }))
        await db.collection('columns').insertMany(projectColsData)
        res.send(project)
        return
      }
      case 'GET': {
        const projects = await getUserProjects(existingUser._id)
        res.send(projects)
        break
      }
      default:
        break
    }
  } else {
    res.send([])
  }
}
