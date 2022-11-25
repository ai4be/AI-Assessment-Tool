import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { cardId, slug } = req.query
  slug = ObjectId(sanitize(slug))
  cardId = ObjectId(sanitize(cardId))

  const { db, client } = await connectToDatabase()

  if (client.isConnected()) {
    const requestType = req.method

    switch (requestType) {
      case 'GET': {
        return res.send({ message: 'Get more details of the card' })
      }
      case 'DELETE': {
        await db.collection('cards').deleteOne({ _id: cardId })
        return res.send({ message: 'A card has been deleted' })
      }
      case 'PATCH': {
        await db
          .collection('cards')
          .updateOne({ _id: cardId, projectId: slug }, { $set: { ...req.body } })
        res.send({ message: 'Card updated' })
        return
      }
      default:
        res.send({ message: 'DB error' })
        break
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 })
  }
}
