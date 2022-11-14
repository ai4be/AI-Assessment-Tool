import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { authOptions } from "../auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"

export default async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { client } = await connectToDatabase()

  if (session == null) {
    return res.send({ error: 'You must be signed in to access this api route' })
  }

  if (client.isConnected()) {
    const db = client.db()
    const existingUser = await db.collection('users').findOne({ email: session.user?.email })
    const requestType = req.method

    switch (requestType) {
      case 'POST': {
        const { _id, name, dateCreated, createdBy, backgroundImage } = req.body
        const data = {
          _id,
          name,
          dateCreated,
          createdBy,
          backgroundImage,
          users: []
        }
        const board = await db.collection('boards').insertOne(data)
        res.send(board)
        return
      }
      case 'GET': {
        const { userid } = req.query
        const boards = await db
          .collection('boards')
          .find({ createdBy: existingUser._id })
          .limit(30)
          .toArray()
        const invitedBoards = await db.collection('boards').find({ users: userid }).toArray()
        const updatedBoards = boards.concat(invitedBoards)

        res.send(updatedBoards)
        break
      }
      default:
        break
    }
  } else {
    res.send([])
  }
}
