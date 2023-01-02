
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from 'next-auth/next'
import { getProjectUsers } from './project'
import { getUser } from './user'
import { getCard } from './card'

const returnUnauthorized = (res: NextApiResponse): void => {
  res.status(401).send({ message: 'Unauthorized', status: 401 })
}

export function isConnected (handler: any): Function {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    const session = await unstable_getServerSession(req, res, authOptions)
    const { client } = await connectToDatabase()

    if (session?.user == null) {
      return returnUnauthorized(res)
    }
    if (!client.isConnected()) {
      return res.status(500).send({ message: 'DB connection error', status: 500 })
    }
    return addUserToReq(handler)(req, res)
  }
}

export function isCurrentUser (handler: Function): Function {
  return addUserToReq(async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    const { userId } = req.query
    const tempReq = req as any
    const user = tempReq.locals?.user
    if (user?._id.toString() !== userId) return res.status(403).send({ message: 'forbidden' })
    return handler(req, res)
  })
}

export function addUserToReq (handler: Function): Function {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    const tempReq = req as any
    if (tempReq?.locals?.user != null) return handler(req, res)
    const session = await unstable_getServerSession(req, res, authOptions)
    if (session?.user == null) {
      return returnUnauthorized(res)
    }
    const user = await getUser({ _id: String(session?.user?.name) })
    if (user == null) {
      return returnUnauthorized(res)
    }
    tempReq.locals = tempReq.locals ?? {}
    tempReq.locals.user = user
    return handler(req, res)
  }
}

export function hasProjectAccess (handler: Function): Function {
  return addUserToReq(async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    let hasAccess = false
    const tempReq = req as any
    const user = tempReq.locals?.user
    let { projectId } = req.query
    if (projectId == null) {
      projectId = req.body?.projectId
    }
    if (projectId != null && projectId !== 'undefined' && user != null) {
      const users = await getProjectUsers(projectId, [user._id])
      hasAccess = users.some(u => String(u._id) === String(user._id))
    }
    if (!hasAccess) {
      return res.status(403).send({ message: 'Forbidden', status: 403 })
    }
    return handler(req, res)
  })
}

export function cardBelongsToProject (handler: Function): Function {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
    const { projectId, cardId } = req.query
    const card = await getCard(cardId)
    if (card == null) {
      return res.status(404).send({ message: 'Notfound', status: 404 })
    }
    if (String(card.projectId) !== String(projectId)) {
      return res.status(400).send({ message: 'Bad Request', status: 400 })
    }
    return handler(req, res)
  }
}
