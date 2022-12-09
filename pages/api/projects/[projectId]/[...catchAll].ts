import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase, toObjectId } from '@/util/mongodb'
import sanitize from 'mongo-sanitize'
import { TokenStatus, getProjectInvites, deleteToken } from '@/util/token'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { client } = await connectToDatabase()
  let { slug, catchAll } = req.query
  slug = toObjectId(slug)
  let restOfQuery = catchAll != null && typeof catchAll === 'string' ? [catchAll] : []

  if (Array.isArray(catchAll)) {
    restOfQuery = catchAll.map(sanitize)
  }

  if (client.isConnected()) {
    const requestType = req.method
    switch (requestType) {
      case 'GET': {
        const [tokens, tokenStatus = ''] = restOfQuery
        if (tokens.toLowerCase() === 'tokens' && tokenStatus.toUpperCase() === TokenStatus.PENDING) {
          const tokenInstances = await getProjectInvites(slug)
          return res.status(200).json(tokenInstances)
        }
        return res.status(404).json([])
      }
      case 'DELETE': {
        const [tokens, tokenId] = restOfQuery
        if (tokens.toLowerCase() === 'tokens' && tokenId?.length === 24) {
          const deleted = await deleteToken(tokenId)
          return res.status(200).json({ success: deleted })
        }
        return res.status(404).json([])
      }
      default:
        res.status(404).send({ message: 'not found' })
        break
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 })
  }
}
