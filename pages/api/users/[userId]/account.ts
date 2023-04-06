import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromRequest, isConnected, isCurrentUser } from '@/util/temp-middleware'
import templates from '@/util/mail/templates'
import { sendMail } from '@/util/mail'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const user = getUserFromRequest(req)

  switch (req.method) {
    case 'DELETE': {
      console.log('chegou delete')
      const htmlContent = templates.deletedUserAccountHtml()
      if (user == null) {
        return res.status(422).json({ code: 10007 })
      } else {
        await sendMail(user.email, 'Deleted account', htmlContent)
        return res.send(200)
      }
    }
    default:
      return res.status(400).send({ message: 'Invalid request' })
  }
}

export default isCurrentUser(isConnected(handler))
