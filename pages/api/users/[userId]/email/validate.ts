import type { NextApiRequest, NextApiResponse } from 'next'
import { isConnected, isCurrentUser } from '@/util/temp-middleware'
import { emailValidationTokenHandler } from '@/src/models/token'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const { userId } = req.query

  switch (req.method) {
    case 'POST': {
      const { token } = req.body
      try {
        await emailValidationTokenHandler(token, String(userId))
      } catch (error) {
        return res.status(400).send({ message: error.message })
      }
      return res.status(204).end()
    }
    default:
      return res.status(400).send({ message: 'Invalid request' })
  }
}

export default isCurrentUser(isConnected(handler))
