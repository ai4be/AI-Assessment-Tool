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

  if (session?.user == null) return res.status(401).send({ msg: 'Unauthorized', status: 401 })
  if (!client.isConnected()) return res.status(500).send({ msg: 'DB connection error', status: 500 })

  const db = client.db()
  const existingUser = await getUser({ email: String(session.user?.email) })

  switch (req.method) {
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
      return res.status(404).send({ message: 'Not found' })
  }
}
