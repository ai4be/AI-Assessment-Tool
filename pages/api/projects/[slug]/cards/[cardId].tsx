import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase, toObjectId } from '@/util/mongodb'
import { updateCard } from '@/util/card'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { cardId } = req.query
  cardId = toObjectId(cardId)

  const { client } = await connectToDatabase()
  if (client.isConnected()) {
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
  } else {
    res.send({ msg: 'DB connection error', status: 400 })
  }
}
