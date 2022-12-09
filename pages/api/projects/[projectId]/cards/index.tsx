import type { NextApiRequest, NextApiResponse } from 'next'
import { getCards } from '@/util/card'
import { isConnected, hasProjectAccess } from '@/util/temp-middleware'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { projectId } = req.query

  if (!(await isConnected(req, res))) return
  if (!await hasProjectAccess(req, res, String(projectId))) return

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
