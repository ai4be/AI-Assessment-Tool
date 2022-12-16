import type { NextApiRequest, NextApiResponse } from 'next'
import { getCards } from '@/util/card'
import { isConnected, hasProjectAccess } from '@/util/temp-middleware'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId } = req.query

  switch (req.method) {
    case 'GET': {
      const cards = await getCards({ projectId })
      return res.send(cards)
    }
    default:
      res.send({ message: 'not found' })
      break
  }
}

export default isConnected(hasProjectAccess(handler))
