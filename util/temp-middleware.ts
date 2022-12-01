
import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/util/mongodb'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import { unstable_getServerSession } from 'next-auth/next'

export async function isConnected (req: NextApiRequest, res: NextApiResponse): Promise<void | boolean> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { client } = await connectToDatabase()

  if (session?.user == null) return res.status(401).send({ msg: 'Unauthorized', status: 401 })
  if (!client.isConnected()) return res.status(500).send({ msg: 'DB connection error', status: 500 })
  return true
}
