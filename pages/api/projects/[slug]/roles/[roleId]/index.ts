import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'
import { getRole, removeRole, updateRole } from '@/util/project'

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { client } = await connectToDatabase()

  if (client.isConnected() && session?.user != null) {
    let { slug, roleId } = req.query
    slug = ObjectId(sanitize(slug))
    roleId = ObjectId(sanitize(roleId))
    const requestType = req.method

    switch (requestType) {
      case 'PATCH': {
        let { name, desc } = req.body
        name = sanitize(name)
        desc = sanitize(desc)
        await updateRole(slug, { _id: roleId, name, desc })
        const role = await getRole(slug, roleId)
        return res.status(200).json(role)
      }
      case 'DELETE': {
        const success = await removeRole(slug, roleId)
        return success ? res.send(201) : res.send(400)
      }
      default:
        res.send({ message: 'DB error' })
        break
    }
  } else {
    res.send({ msg: 'DB connection error', status: 400 })
  }
}
