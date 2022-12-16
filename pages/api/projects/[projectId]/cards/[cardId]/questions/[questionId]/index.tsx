import type { NextApiRequest, NextApiResponse } from 'next'
import { cardBelongsToProject, hasProjectAccess, isConnected } from '@/util/temp-middleware'
import { updateQuestion } from '@/util/card'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { cardId, questionId } = req.query
  cardId = String(cardId)
  questionId = String(questionId)

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

export default isConnected(hasProjectAccess(cardBelongsToProject(handler)))
