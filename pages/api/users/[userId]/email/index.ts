import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from '@/src/models/user'
import { isConnected, isCurrentUser } from '@/util/temp-middleware'
import { isEmailValid } from '@/util/validator'
import { createEmailVerificationToken, deleteToken, getToken, TokenStatus, TokenType } from '@/src/models/token'
import { cleanEmail } from '@/src/models/mongodb'
import { sendMail } from '@/util/mail'
import { getVerifyEmailHtml } from '@/util/mail/templates'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { userId } = req.query
  userId = String(userId)

  switch (req.method) {
    case 'POST': {
      let { email } = req.body
      if (!isEmailValid(email)) return res.status(400).send({ code: 12001 })
      email = cleanEmail(email)
      const user = await getUser({ email })
      if (user != null && String(user._id) !== userId) return res.status(400).send({ code: 12002 })
      const tokenInstance = await createEmailVerificationToken(email, userId)
      if (tokenInstance == null) return res.status(400).send({ code: 12003 })
      const html = getVerifyEmailHtml(tokenInstance.token)
      try {
        await sendMail(email, 'Email-verfication', html)
      } catch (error) {
        return res.status(400).send({ code: 12004 })
      }
      return res.status(200).send({ code: 12005 })
    }
    case 'DELETE': {
      let { email } = req.body
      email = cleanEmail(email)
      const token = await getToken({ createdBy: userId, email, type: TokenType.EMAIL_VERIFICATION, status: TokenStatus.PENDING })
      if (token?._id != null) await deleteToken(token._id)
      return res.status(204).end()
    }
    default:
      return res.status(400).send({ code: 12006 })
  }
}

export default isCurrentUser(isConnected(handler))
