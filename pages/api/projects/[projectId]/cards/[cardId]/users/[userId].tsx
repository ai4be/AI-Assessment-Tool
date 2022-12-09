import type { NextApiRequest, NextApiResponse } from 'next'
import { hasProjectAccess, isConnected } from '@/util/temp-middleware'
import { addUserToCard, removeUserFromCard } from '@/util/card'
import { getProjectUsers } from '@/util/project'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { projectId, cardId, userId } = req.query
  if (!await isConnected(req, res)) return
  if (!await hasProjectAccess(req, res, String(projectId))) return

  switch (req.method) {
    case 'POST': {
      const users = await getProjectUsers(projectId, [userId])
      const user = users?.find(u => String(u._id) === userId) ?? null
      if (user == null) {
        return res.status(400).send({ message: 'invalid user' })
      }
      // const res =
      await addUserToCard(cardId, user._id)
      return res.send(201)
    }
    case 'DELETE': {
      // const res =
      await removeUserFromCard(cardId, userId)
      return res.send(201)
    }
    default:
      res.status(404).send({ message: 'Not found' })
      break
  }
}
