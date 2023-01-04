import { hashPassword } from '@/util/auth'
import { cleanEmail } from '@/src/models/mongodb'
import sanitize from 'mongo-sanitize'
import { getToken, createResetPasswordToken, TokenType, isTokenExpired, setStatus, TokenStatus } from '@/src/models/token'
import { getUser, resetPassword } from '@/src/models/user'
import { isPasswordValid } from '@/util/validator'
import { csrf } from '@/util/csrf'
import { sendMail } from '@/util/mail'
import templates from '@/util/mail/templates'

async function handler (req, res): Promise<any> {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  let { email, password, token } = req.body
  email = email != null ? cleanEmail(email) : null
  token = token != null ? sanitize(token) : token

  if (token != null && password != null) {
    const tokenEnt = await getToken({ token, type: TokenType.RESET_PASSWORD })
    if (tokenEnt == null) return res.status(400).json({ message: 'Invalid token' })
    if (isTokenExpired(tokenEnt) || tokenEnt.status === TokenStatus.EXPIRED) {
      void setStatus(tokenEnt.token, TokenStatus.EXPIRED)
      return res.status(400).json({ message: 'Token expired. Please ask for a new one' })
    }
    if (!isPasswordValid(password)) return res.status(400).json({ message: 'Password is not valid' })

    const hashedPassword = await hashPassword(password)
    const result = await resetPassword(tokenEnt.createdBy, hashedPassword)
    if (result) {
      void setStatus(tokenEnt.token, TokenStatus.REDEEMED)
      return res.status(201).send({ message: 'Successfully resetted your password' })
    }
    return res.status(400).json({ message: 'Something went wrong' })
  } else if (email != null) {
    const user = await getUser({ email })
    if (user == null) {
      return res.status(422).json({ message: 'There is no account for this email address' })
    } else {
      const tokenEnt = await getToken({ createdBy: user._id, type: TokenType.RESET_PASSWORD })
      // check if there is a token that was created less than 2 minutes ago
      if (tokenEnt != null && +tokenEnt.createdAt + (60 * 2 * 1000) > Date.now()) {
        return res.status(400).json({ message: 'Too many consecutive requests. Wait at least two minutes before asking for a new password reset.' })
      }
      const tokenEnt2 = await createResetPasswordToken(user._id)
      const htmlContent = templates.resetPassword(tokenEnt2.token, String(req.headers.origin))
      const result = await sendMail(user.email, 'Reset password', htmlContent)
      return res.status(200).json({ message: 'An email was sent to your address. Follow the instructions in the email to reset your password. Check you spam folder if you do not get the email.' })
    }
  }
}
export default csrf(handler)
