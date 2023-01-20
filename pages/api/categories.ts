import type { NextApiRequest, NextApiResponse } from 'next'
import { defaultCards } from '../../src/data/index'

export const categories = defaultCards.map(c => ({
  _id: c.id,
  key: c.title.toLowerCase().replace(/ /g, '_'),
  name: c.title
}))

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  switch (req.method) {
    case 'GET': {
      return res.send(categories)
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}
