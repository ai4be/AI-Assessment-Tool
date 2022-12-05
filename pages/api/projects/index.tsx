import type { NextApiRequest, NextApiResponse } from 'next'
import { authOptions } from '../auth/[...nextauth]'
import { unstable_getServerSession } from 'next-auth/next'
import { createProjectWithDefaultColumnsAndCards, getProject, getUserProjects } from '@/util/project'
import { getUser } from '@/util/user'
import { isConnected } from '@/util/temp-middleware'
import { dataToCards } from '@/util/data'
import data from '@/src/data'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const existingUser = await getUser({ email: String(session?.user?.email) })

  const canProceed = await isConnected(req, res)
  if (canProceed !== true) return

  switch (req.method) {
    case 'POST': {
      const { name } = req.body
      const cardsData = await dataToCards(data)
      const projectId = await createProjectWithDefaultColumnsAndCards(name, String(existingUser?._id), cardsData)
      const project = await getProject(projectId)
      return res.send(project)
    }
    case 'GET': {
      const projects = await getUserProjects(existingUser?._id)
      return res.send(projects)
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}
