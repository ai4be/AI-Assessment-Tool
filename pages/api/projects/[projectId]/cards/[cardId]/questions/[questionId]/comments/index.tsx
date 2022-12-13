import type { NextApiRequest, NextApiResponse } from 'next'
import { hasProjectAccess, isConnected, cardBelongsToProject } from '@/util/temp-middleware'
import { createComment } from '@/util/comments'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId, cardId, questionId } = req.query

  if (!await isConnected(req, res)) return
  if (!await hasProjectAccess(req, res, String(projectId))) return
  if (!await cardBelongsToProject(req, res, String(projectId), String(cardId))) return

  const reqAsAny = req as any
  const user = reqAsAny.locals.user

  switch (req.method) {
    case 'POST': {
      const comment = await createComment({ ...req.body, projectId, questionId, userId: user._id })
      return comment ? res.status(201).send(comment) : res.status(400).send({ message: 'could not create' })
    }
    default:
      res.send({ message: 'Invalid request type' })
      break
  }
}
