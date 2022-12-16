import type { NextApiRequest, NextApiResponse } from 'next'
import { updateCard } from '@/util/card'
import { hasProjectAccess, isConnected } from '@/util/temp-middleware'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { cardId } = req.query

  switch (req.method) {
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

export default isConnected(hasProjectAccess(handler))
