import type { NextApiRequest, NextApiResponse } from 'next'
import { hasProjectAccess, isConnected, cardBelongsToProject } from '@/util/custom-middleware'
import Comment from '@/src/models/comment'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId, cardId } = req.query

  switch (req.method) {
    case 'GET': {
      const result = await Comment.find({ projectId, cardId })
      return res.status(200).send(result.data)
    }
    default:
      return res.status(400).send({ message: 'Invalid request', code: 9002 })
  }
}

export default isConnected(hasProjectAccess(cardBelongsToProject(handler)))
