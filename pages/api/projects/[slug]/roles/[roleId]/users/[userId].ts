import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from 'next-auth/next'
import { addUserToRole, removeUserFromRole } from '@/util/role'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { client } = await connectToDatabase()

  if (session?.user == null) return res.status(401).json({ message: 'Unauthorized' })
  if (!client.isConnected()) return res.status(500).json({ msg: 'DB connection error', status: 500 })

  const { slug, roleId, userId } = req.query

  switch (req.method) {
    case 'POST': {
      // const res =
      await addUserToRole(slug, roleId, userId)
      return res.send(201)
    }
    case 'DELETE': {
      // const res =
      await removeUserFromRole(slug, roleId, userId)
      return res.send(201)
    }
    default:
      res.status(404).send({ message: 'Not found' })
      break
  }
}
