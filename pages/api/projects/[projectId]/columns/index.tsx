import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase, toObjectId } from '@/util/mongodb'
import sanitize from 'mongo-sanitize'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../../../auth/[...nextauth]'
import { hasProjectAccess, isConnected } from '@/util/temp-middleware'
import { getUser } from '@/util/user'
import { getColumns } from '@/util/columns'


export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  let { projectId } = req.query
  projectId = toObjectId(projectId)

  if (!await isConnected(req, res)) return
  if (!await hasProjectAccess(req, res, String(projectId))) return

  const { db } = await connectToDatabase()

  switch (req.method) {
    case 'GET': {
      const columns = await getColumns({ projectId })
      return res.send(columns)
    }
    case 'POST': {
      const user = await getUser({ email: String(session?.user?.email) })
      let {
        name,
        sequence
      } = req.body
      name = sanitize(name)
      sequence = sanitize(sequence)

      const data = {
        projectId,
        createdAt: new Date(),
        userId: user?._id,
        name,
        sequence
      }

      const col = await db.collection('columns').insertOne(data)
      return res.send(col)
    }
    default:
      res.send({ message: 'DB error' })
      break
  }
}
