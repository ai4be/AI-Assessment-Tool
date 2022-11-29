import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { getUser } from '@/util/user'
import { authOptions } from '../auth/[...nextauth]'
import { unstable_getServerSession } from 'next-auth/next'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { slug } = req.query
  const { client } = await connectToDatabase()

  if (session?.user == null) return res.status(401).send({ msg: 'Unauthorized', status: 401 })
  if (!client.isConnected()) return res.status(500).send({ msg: 'DB connection error', status: 500 })

  switch (req.method) {
    case 'GET': {
      const user = await getUser({ _id: slug })
      return res.send(user)
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}
