import type { NextApiRequest, NextApiResponse } from 'next'
import { hasProjectAccess, isConnected, cardBelongsToProject } from '@/util/temp-middleware'
import { getComments } from '@/util/comments'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId, cardId } = req.query

  if (!await isConnected(req, res)) return
  if (!await hasProjectAccess(req, res, String(projectId))) return
  if (!await cardBelongsToProject(req, res, String(projectId), String(cardId))) return

  switch (req.method) {
    case 'GET': {
      const comments = await getComments({ projectId, cardId })
      return res.status(200).send(comments)
    }
    default:
      res.send({ message: 'Invalid request type' })
      break
  }
}
