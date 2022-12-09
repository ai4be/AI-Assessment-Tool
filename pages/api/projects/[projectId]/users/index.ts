import type { NextApiRequest, NextApiResponse } from 'next'
import { getProjectUsers } from '@/util/project'
import { isConnected, hasProjectAccess } from '@/util/temp-middleware'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId } = req.query

  if (!await isConnected(req, res)) return
  if (!await hasProjectAccess(req, res, String(projectId))) return

  const { slug } = req.query
  switch (req.method) {
    case 'GET': {
      const users = await getProjectUsers(projectId)
      return res.status(200).json(users)
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}
