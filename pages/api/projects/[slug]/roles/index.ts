import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'
import { addRole } from '@/util/project'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { client } = await connectToDatabase()

  if (client.isConnected() && session?.user != null) {
    let { slug } = req.query
    slug = ObjectId(sanitize(slug))

    const requestType = req.method
    switch (requestType) {
      case 'POST': {
        const { name, desc } = req.body
        const role = await addRole(slug, { name, desc })
        return res.status(200).json(role)
      }
      default:
        res.send({ message: 'DB error' })
        break
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 })
  }
}
