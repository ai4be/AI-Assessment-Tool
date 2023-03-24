import { hashPassword } from '@/util/auth'
import { cleanEmail } from '@/src/models/mongodb'
import sanitize from 'mongo-sanitize'
import { invitedUserHandler, createEmailVerificationToken } from '@/src/models/token'
import { createUser, getUser } from '@/src/models/user'
import { isEmailValid, isPasswordValid } from '@/util/validator'
import { User } from '@/src/types/user'
import { sendMail } from '@/util/mail'
import { getVerifyEmailHtml } from '@/util/mail/templates'
import SignUp from '@/src/components/signup'

async function sendEmailVerifictionEmail (user: User): Promise<void> {
  const tokenInstance = await createEmailVerificationToken(user.email, user?._id as string)
  if (tokenInstance == null) return
  const html = getVerifyEmailHtml(tokenInstance.token)
  await sendMail(user.email, 'Email-verfication', html)
}

async function handler (req, res): Promise<any> {
  if (req.method !== 'POST') return res.status(405).json({ code: 11001 })

  let { email, password, firstName, lastName, token } = req.body
  email = cleanEmail(email)
  firstName = sanitize(firstName)
  lastName = sanitize(lastName)
  token = token != null ? sanitize(token) : token

  if (!isEmailValid(email)) {
    return res.status(422).json({ code: 11002 })
  }

  if (!isPasswordValid(password)) {
    return res.status(422).json({
      code: 11003
    })
  }

  const existingUser = await getUser({ email })
  if (existingUser != null) {
    return res.status(422).json({ code: 11004 })
  }

  const hashedPassword = await hashPassword(password)
  const user = await createUser({
    email,
    password: hashedPassword,
    firstName,
    lastName
  })
  if (user?._id != null) {
    if (token != null) await invitedUserHandler(token, email)
    void sendEmailVerifictionEmail(user)
    return res.status(201).send({ code: 11005 })
  }
  return res.status(400).send({ code: 11006 })
}

export default handler
