import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { cardId, cid } = req.query
  cardId = sanitize(cardId)
  cid = sanitize(cid)

  const { db, client } = await connectToDatabase()

  if (client.isConnected()) {
    const requestType = req.method
    switch (requestType) {
      // case 'PATCH': {
      //   const { projectName, name, columnId } = req.body

      //   const data = {
      //     projectName,
      //     columnName,
      //     columnId
      //   }

      //   const card = await db.collection('cards').updateOne({ _id: cardId }, { $set: data })
      //   return res.send(card)
      // }

      case 'DELETE': {
        await db.collection('cards').deleteOne({ _id: ObjectId(cardId), columnId: ObjectId(cid) })
        res.send({ messsage: 'Deleted' })
        break
      }
      default:
        res.send({ message: 'Invalid request type' })
        break
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 })
  }
}
