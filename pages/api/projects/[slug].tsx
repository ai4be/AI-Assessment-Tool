import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { connectToDatabase, toObjectId } from '@/util/mongodb'
import { ObjectId } from 'mongodb'
import { deleteProject, getProject, updateProject } from '@/util/project'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  let { slug } = req.query
  slug = toObjectId(slug)
  const { db, client } = await connectToDatabase()

  if (session?.user == null) return res.status(401).send({ msg: 'Unauthorized', status: 401 })
  if (!client.isConnected()) return res.status(500).send({ msg: 'DB connection error', status: 500 })

  switch (req.method) {
    case 'GET': {
      const project = await getProject(slug)
      return res.send(project)
    }
    case 'PATCH': {
      const success = await updateProject(slug, req.body)
      return success ? res.status(201).end() : res.status(400).end()
    }
    case 'DELETE': {
      // TODO move next function to own file and call in project delete function
      await db.collection('cards').remove({ projectId: ObjectId(slug) })
      await db.collection('columns').remove({ projectId: ObjectId(slug) })
      await deleteProject(slug)

      return res.send({ messsage: 'Delete project with columns and cards' })
    }
    default:
      return res.status(404).send({ message: 'not found' })
  }
}
