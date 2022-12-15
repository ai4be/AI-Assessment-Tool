import type { NextApiRequest, NextApiResponse } from 'next'
import { cardBelongsToProject, hasProjectAccess, isConnected } from '@/util/temp-middleware'
import { deleteComment, getComment, updateComment } from '@/util/comments'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { projectId, cardId, commentId } = req.query
  projectId = String(projectId)
  cardId = String(cardId)
  if (!(await isConnected(req, res))) return
  if (!(await hasProjectAccess(req, res, projectId))) return
  if (!(await cardBelongsToProject(req, res, projectId, cardId))) return

  const reqAsAny = req as any
  const user = reqAsAny.locals.user

  const comment = await getComment({ _id: commentId })
  if (comment == null) return res.status(404).send({ message: 'not found' })
  if (String(comment.userId) !== String(user._id)) return res.status(403).send({ message: 'forbidden' })

  switch (req.method) {
    case 'GET': {
      const comment = await getComment({ projectId, _id: commentId })
      return res.status(200).send(comment)
    }
    case 'PATCH': {
      const result = await updateComment(commentId, { ...req.body })
      const comment = await getComment({ _id: commentId })
      return result ? res.status(200).send(comment) : res.status(400).send({ message: 'could not update' })
    }
    case 'DELETE': {
      const result = await deleteComment(commentId)
      return result ? res.status(204).end() : res.status(400).send({ message: 'could not delete' })
    }
    default:
      res.status(400).send({ message: 'invalid request' })
      break
  }
}
