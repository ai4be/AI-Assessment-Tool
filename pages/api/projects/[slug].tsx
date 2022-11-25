import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'
import { deleteProject, getProject, updateProject } from '@/util/project'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { slug } = req.query
  slug = ObjectId(sanitize(slug))
  const { db, client } = await connectToDatabase()

  if (client.isConnected()) {
    const requestType = req.method
    switch (requestType) {
      case 'GET': {
        const project = await getProject(slug)
        return res.send(project)
      }
      case 'PATCH': {
        let { name, backgroundImage } = req.body
        name = sanitize(name)
        backgroundImage = sanitize(backgroundImage)
        const success = await updateProject(slug, { name, backgroundImage })
        return success ? res.status(201).end() : res.status(400).end()
      }
      case 'DELETE': {
        // TODO move next function to own file and call in project delete function
        await db.collection('cards').remove({ projectId: ObjectId(slug) })
        await db.collection('columns').remove({ projectId: ObjectId(slug) })
        await deleteProject(slug)

        res.send({ messsage: 'Delete project with columns and cards' })
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
