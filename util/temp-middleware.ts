
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from 'next-auth/next'
import { getProjectUsers } from './project'
import { getUser } from './user'
import { getCard } from './card'

export async function isConnected (req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { client } = await connectToDatabase()

  if (session?.user == null) {
    res.status(401).send({ msg: 'Unauthorized', status: 401 })
    return false
  }
  if (!client.isConnected())  {
    res.status(500).send({ msg: 'DB connection error', status: 500 })
    return false
  }
  return await addUserToReq(req, res)
}

export async function addUserToReq (req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const tempReq = req as any
  if (tempReq?.locals?.user != null) return true
  const session = await unstable_getServerSession(req, res, authOptions)
  if (session?.user == null) {
    res.status(401).send({ msg: 'Unauthorized', status: 401 })
    return false
  }
  const user = await getUser({ email: String(session?.user?.email) })
  if (user == null) {
    res.status(401).send({ msg: 'Unauthorized', status: 401 })
    return false
  }
  tempReq.locals = tempReq.locals ?? {}
  tempReq.locals.user = user
  return true
}

export async function hasProjectAccess (req: NextApiRequest, res: NextApiResponse, projectId: string): Promise<boolean> {
  const tempReq = req as any
  if (!(await addUserToReq(req, res))) return false
  const user = tempReq.locals.user
  const users = await getProjectUsers(projectId, [user._id])
  const hasAccess = users.some(u => String(u._id) === String(user._id))
  if (!hasAccess) {
    res.status(403).send({ msg: 'Forbidden', status: 403 })
    return false
  }
  return true
}

export async function cardBelongsToProject (req: NextApiRequest, res: NextApiResponse, projectId: string, cardId: string): Promise<boolean> {
  const card = await getCard(cardId)
  if (card == null) {
    res.status(404).send({ msg: 'Notfound', status: 404 })
    return false
  }
  if (String(card.projectId) !== String(projectId)) {
    res.status(400).send({ msg: 'Bad Request', status: 400 })
    return false
  }
  return true
}
