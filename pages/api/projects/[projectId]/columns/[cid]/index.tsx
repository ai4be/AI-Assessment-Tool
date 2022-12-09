import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
import { hasProjectAccess, isConnected } from '@/util/temp-middleware'

const UPDATEABLE_FIELDS = ['name', 'sequence']

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { projectId, cid } = req.query
  cid = sanitize(cid)

  if (!await isConnected(req, res)) return
  if (!await hasProjectAccess(req, res, String(projectId))) return

  const { db } = await connectToDatabase()

  switch (req.method) {
    case 'PATCH': {
      const updateableData: any = {}
      Object.keys(req.body)
        .filter(k => UPDATEABLE_FIELDS.includes(k))
        .forEach(key => (updateableData[key] = sanitize(req.body[key])))
      const col = await db
        .collection('columns')
        .updateOne({ _id: ObjectId(cid) }, { $set: { ...updateableData } })
      res.send(col)
      break
    }
    case 'DELETE': {
      await db.collection('cards').remove({ columnId: ObjectId(cid) })
      await db.collection('columns').deleteOne({ _id: ObjectId(cid) })
      res.send({ messsage: 'Deleted' })
      break
    }
    default:
      res.send({ message: 'Invalid request type' })
      break
  }
}
