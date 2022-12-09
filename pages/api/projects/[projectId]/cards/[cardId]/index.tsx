import type { NextApiRequest, NextApiResponse } from 'next'
import { updateCard } from '@/util/card'
import { hasProjectAccess, isConnected } from '@/util/temp-middleware'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { cardId, projectId } = req.query

  if (!await isConnected(req, res)) return
  if (!await hasProjectAccess(req, res, String(projectId))) return

  const requestType = req.method
  switch (requestType) {
    case 'GET': {
      return res.send({ message: 'Get more details of the card' })
    }
    case 'PATCH': {
      await updateCard(cardId, req.body)
      res.send({ message: 'Card updated' })
      return
    }
    default:
      res.send({ message: 'not found' })
      break
  }
}
