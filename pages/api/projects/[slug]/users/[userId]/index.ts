import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { removeUser } from '@/util/project'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { client } = await connectToDatabase()

  if (session?.user == null) return res.status(401).send({ msg: 'Unauthorized', status: 401 })
  if (!client.isConnected()) return res.status(500).send({ msg: 'DB connection error', status: 500 })

  const { slug, userId } = req.query

  switch (req.method) {
    case 'DELETE': {
      await removeUser(slug, userId)
      return res.send(201)
    }
    default:
      res.status(404).send({ message: 'not found' })
      break
  }
}
