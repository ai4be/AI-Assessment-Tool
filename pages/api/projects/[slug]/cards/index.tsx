import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase, toObjectId } from '@/util/mongodb'
import { getCards } from '@/util/card'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { slug } = req.query
  slug = toObjectId(slug)
  const { client } = await connectToDatabase()

  if (client.isConnected()) {
    const requestType = req.method

    switch (requestType) {
      case 'GET': {
        const cards = await getCards({ projectId: slug })
        return res.send(cards)
      }
      default:
        res.send({ message: 'not found' })
        break
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 })
  }
}
