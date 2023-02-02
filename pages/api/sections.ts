import type { NextApiRequest, NextApiResponse } from 'next'
import { defaultCards } from '@/src/data'

export const sections = defaultCards.map(c => c?.sections?.map((s: any) => {
  const section = {
    ...s,
    _id: s.id
  }
  return section
})).flat().filter(s => s)

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  switch (req.method) {
    case 'GET': {
      return res.send(sections)
    }
    default:
      return res.status(400).send({ message: 'Invalid request' })
  }
}
