import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser, updatePassword } from '@/util/user'
import { isConnected, isCurrentUser } from '@/util/temp-middleware'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { userId } = req.query

  switch (req.method) {
    case 'PATCH': {
      const data = {
        _id: userId,
        password: req.body.newPassword,
        currentPassword: req.body.currentPassword
      }
      // TODO handle errors and false!!!
      try {
        await updatePassword(data)
        return res.status(204).end()
      } catch (error) {
        return res.status(400).send({ message: error?.message ?? 'something went wrong' })
      }
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}

export default isCurrentUser(isConnected(handler))
