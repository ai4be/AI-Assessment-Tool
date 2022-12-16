import type { NextApiRequest, NextApiResponse } from 'next'
import { hasProjectAccess, isConnected, cardBelongsToProject } from '@/util/temp-middleware'
import { getComments } from '@/util/comments'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId, cardId } = req.query

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

export default isConnected(hasProjectAccess(cardBelongsToProject(handler)))
