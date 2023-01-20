import type { NextApiRequest, NextApiResponse } from 'next'
import { getUser } from '@/src/models/user'
import { isConnected, isCurrentUser } from '@/util/temp-middleware'
import { isEmailValid } from '@/util/validator'
import { createEmailValidationToken, deleteToken, getToken, TokenStatus, TokenType } from '@/src/models/token'
import { cleanEmail } from '@/src/models/mongodb'
import { sendMail } from '@/util/mail'
import { validateEmailHtml } from '@/util/mail/templates'

async function handler (req: NextApiRequest, res: NextApiResponse): Promise<void> {
  let { userId } = req.query
  userId = String(userId)

  switch (req.method) {
    case 'POST': {
      let { email } = req.body
      if (!isEmailValid(email)) return res.status(400).send({ message: 'invalid email' })
      email = cleanEmail(email)
      const user = await getUser({ email })
      if (user != null) return res.status(400).send({ message: 'email already used' })
      const tokenInstance = await createEmailValidationToken(email, userId)
      if (tokenInstance == null) return res.status(400).send({ message: 'error while creating token' })
      const html = validateEmailHtml(tokenInstance.token)
      await sendMail(email, 'Email-validation', html)
      return res.status(200).send({ message: 'A code has been sent to your email. Use the code to validate you email' })
    }
    case 'DELETE': {
      let { email } = req.body
      email = cleanEmail(email)
      const token = await getToken({ createdBy: userId, email, type: TokenType.EMAIL_VALIDATION, status: TokenStatus.PENDING })
      if (token?._id != null) await deleteToken(token._id)
      return res.status(204).end()
    }
    default:
      return res.status(404).send({ message: 'Not found' })
  }
}

export default isCurrentUser(isConnected(handler))
