import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getProjectUsers } from '@/util/project'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { client } = await connectToDatabase()

  if (session?.user == null) return res.status(401).send({ msg: 'Unauthorized', status: 401 })
  if (!client.isConnected()) return res.status(500).send({ msg: 'DB connection error', status: 500 })

  const { slug } = req.query
  switch (req.method) {
    case 'GET': {
      const users = await getProjectUsers(slug)
      return res.status(200).json(users)
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}
