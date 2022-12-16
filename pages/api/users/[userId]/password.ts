import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser, updatePassword } from '@/util/user'
import { isConnected } from '@/util/temp-middleware'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await unstable_getServerSession(req, res, authOptions)
  const { userId } = req.query

  switch (req.method) {
    case 'PATCH': {
      const user = await getUser({ _id: userId })
      const userSession = await getUser({ email: String(session?.user?.email) })
      if (user?._id === userSession?._id) return res.status(403).send({ message: 'forbidden' })
      const data = {
        _id: userId,
        password: req.body.newPassword,
        currentPassword: req.body.currentPassword
      }
      // TODO handle errors and false!!!
      const updated = await updatePassword(data)
      return res.status(204).end()
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}

export default isConnected(handler)
