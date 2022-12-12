import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase, toObjectId } from '@/util/mongodb'
import { deleteProject, getProject, updateProject } from '@/util/project'
import { hasProjectAccess, isConnected } from '@/util/temp-middleware'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { projectId } = req.query
  projectId = toObjectId(projectId)

  if (!(await isConnected(req, res))) return
  if (!(await hasProjectAccess(req, res, String(projectId)))) return

  const { db } = await connectToDatabase()
  switch (req.method) {
    case 'GET': {
      const project = await getProject(projectId)
      return res.send(project)
    }
    case 'PATCH': {
      const success = await updateProject(projectId, req.body)
      return success ? res.status(201).end() : res.status(400).end()
    }
    case 'DELETE': {
      // TODO move next function to own file and call in project delete function
      await db.collection('cards').remove({ projectId })
      await db.collection('columns').remove({ projectId })
      await deleteProject(projectId)

      return res.send({ messsage: 'Delete project with columns and cards' })
    }
    default:
      return res.status(404).send({ message: 'not found' })
  }
}
