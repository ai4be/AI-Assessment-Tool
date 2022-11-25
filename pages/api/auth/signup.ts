import { hashPassword } from '@/util/auth'
import { cleanEmail, connectToDatabase } from '@/util/mongodb'
import sanitize from 'mongo-sanitize'
import { invitedUserHandler } from '@/util/token'
import { getUser } from '@/util/user'
import { isEmailValid } from '@/util/validator'

async function handler (req, res): Promise<any> {
  if (req.method !== 'POST') return
  let { email, password, fullName } = req.body
  let { token } = req.query
  email = cleanEmail(email)
  fullName = sanitize(fullName)
  token = token != null ? sanitize(token) : token

  if (!isEmailValid(email) || password == null || password?.trim().length < 8) {
    return res.status(422).json({
      message:
        'Invalid input - password should also be at least 7 characters long.'
    })
  }

  const { client } = await connectToDatabase()
  const db = client.db()
  const existingUser = await getUser({ email })

  if (existingUser != null) {
    return res.status(422).json({ message: 'User exists already!' })
  }

  const hashedPassword = await hashPassword(password)
  const user = await db.collection('users').insertOne({
    email,
    password: hashedPassword,
    fullName
  })
  if (user?.insertedCount === 1) {
    if (token != null) await invitedUserHandler(token, email)
    return res.status(201).send({ message: 'success' })
  }
  return res.status(404).send({ message: 'failed' })
}

export default handler
