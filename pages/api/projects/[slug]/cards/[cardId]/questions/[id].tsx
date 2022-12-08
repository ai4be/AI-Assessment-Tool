import type { NextApiRequest, NextApiResponse } from 'next'
import { cardBelongsToProject, hasProjectAccess, isConnected } from '@/util/temp-middleware'
import { updateQuestion } from '@/util/card'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { slug, cardId, id: questionId } = req.query
  slug = String(slug)
  cardId = String(cardId)
  questionId = String(questionId)
  if (!(await isConnected(req, res))) return
  if (!(await hasProjectAccess(req, res, slug))) return
  if (!(await cardBelongsToProject(req, res, slug, cardId))) return

  switch (req.method) {
    case 'PATCH': {
      const result = await updateQuestion(cardId, questionId, req.body)
      return result ? res.send(201) : res.status(400).send({ message: 'could not update question' })
    }
    default:
      res.status(404).send({ message: 'Not found' })
      break
  }
}
