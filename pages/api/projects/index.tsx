import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { authOptions } from '../auth/[...nextauth]'
import { unstable_getServerSession } from 'next-auth/next'
import shortid from 'shortid'

const defaultColumns = ['to do', 'busy', 'done']

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { client } = await connectToDatabase()

  if (session == null) {
    return res.send({ error: 'You must be signed in to access this api route' })
  }

  if (client.isConnected()) {
    const db = client.db()
    const existingUser = await db.collection('users').findOne({ email: session.user?.email })
    const requestType = req.method

    switch (requestType) {
      case 'POST': {
        const { name } = req.body
        const data = {
          _id: shortid.generate(),
          name,
          dateCreated: Date.now(),
          createdBy: existingUser._id,
          users: []
        }
        const project = await db.collection('projects').insertOne(data)
        const projectColsData = defaultColumns.map((cn, idx) => ({
          _id: shortid.generate(),
          projectId: data._id,
          columnName: cn,
          dateCreated: data.dateCreated,
          createdBy: existingUser._id,
          idx
        }))
        await db.collection('columns').insertMany(projectColsData)
        res.send(project)
        return
      }
      case 'GET': {
        const { userid } = req.query
        const projects = await db
          .collection('projects')
          .find({ createdBy: existingUser._id })
          .limit(30)
          .toArray()
        const invitedProjects = await db.collection('projects').find({ users: userid }).toArray()
        const updatedProjects = projects.concat(invitedProjects)

        res.send(updatedProjects)
        break
      }
      default:
        break
    }
  } else {
    res.send([])
  }
}
