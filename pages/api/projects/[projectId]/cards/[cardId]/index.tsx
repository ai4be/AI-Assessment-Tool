import type { NextApiRequest, NextApiResponse } from 'next'
import { updateCardAndCreateActivities } from '@/src/models/card'
import { hasProjectAccess, isConnected } from '@/util/custom-middleware'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { cardId } = req.query

  switch (req.method) {
    case 'PATCH': {
      await updateCardAndCreateActivities(cardId, (req as any).locals.user._id, req.body)
      return res.send({ message: 'Card updated' })
    }
    default:
      return res.status(400).send({ message: 'Invalid request', code: 9002 })
  }
}

export default isConnected(hasProjectAccess(handler))
