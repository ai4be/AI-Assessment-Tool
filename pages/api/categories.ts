import type { NextApiRequest, NextApiResponse } from 'next'
import { defaultCards } from '@/src/data/index'
import { Category, Section } from '@/src/types/project'

export const categories: Category[] = defaultCards.map(c => ({
  _id: c.id,
  key: c.title.toLowerCase().replace(/ /g, '_'),
  name: c.title,
  sections: (c.sections ?? []) as Section[]
}))

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  switch (req.method) {
    case 'GET': {
      return res.send(categories)
    }
    default:
      return res.status(400).send({ message: 'Invalid request' })
  }
}
