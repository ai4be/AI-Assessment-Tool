import type { NextApiRequest, NextApiResponse } from 'next'
import { hasProjectAccess, isConnected } from '@/util/temp-middleware'
import { getCards } from '@/src/models/card'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId, cid } = req.query

  switch (req.method) {
    case 'GET': {
      const cards = await getCards({ projectId, columnId: cid as string })
      return res.send(cards)
    }
    default:
      res.status(400).send({ message: 'Invalid request type' })
      break
  }
}

export default isConnected(hasProjectAccess(handler))
