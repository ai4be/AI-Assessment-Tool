import type { NextApiRequest, NextApiResponse } from 'next'
import { hasProjectAccess, isConnected, cardBelongsToProject } from '@/util/temp-middleware'
import { createComment, getComments } from '@/util/comments'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId, cardId, questionId } = req.query

  const reqAsAny = req as any
  const user = reqAsAny.locals.user

  switch (req.method) {
    case 'POST': {
      const comment = await createComment({ ...req.body, projectId, questionId, cardId, userId: user._id })
      return comment != null ? res.status(201).send(comment) : res.status(400).send({ message: 'could not create' })
    }
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
