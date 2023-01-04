import { hashPassword } from '@/util/auth'
import { cleanEmail } from '@/src/models/mongodb'
import sanitize from 'mongo-sanitize'
import { invitedUserHandler } from '@/src/models/token'
import { createUser, getUser } from '@/src/models/user'
import { isEmailValid } from '@/util/validator'

async function handler (req, res): Promise<any> {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  let { email, password, firstName, lastName, token } = req.body
  email = cleanEmail(email)
  firstName = sanitize(firstName)
  lastName = sanitize(lastName)
  token = token != null ? sanitize(token) : token

  if (!isEmailValid(email) || password == null || password?.trim().length < 8) {
    return res.status(422).json({
      message:
        'Invalid input - password should also be at least 8 characters long.'
    })
  }

  const existingUser = await getUser({ email })
  if (existingUser != null) {
    return res.status(422).json({ message: 'User exists already!' })
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
    return res.status(201).send({ message: 'success' })
  }
  return res.status(400).send({ message: 'failed' })
}

export default handler
