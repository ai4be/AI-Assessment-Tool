import { hashPassword } from '@/util/auth'
import { connectToDatabase } from '@/util/mongodb'

async function handler (req, res) {
  if (req.method !== 'POST') return
  const { email, password } = req.body?.data

  if (!email || !email.includes('@') || !password || password.trim().length < 8) {
    return res.status(422).json({
      message:
        'Invalid input - password should also be at least 7 characters long.',
    })
  }

  const { client } = await connectToDatabase()
  const db = client.db()
  const existingUser = await db.collection('users').findOne({ email: email })

  if (existingUser) {
    return res.status(422).json({ message: 'User exists already!' })
  }

  const hashedPassword = await hashPassword(password)
  const user = await db.collection('users').insertOne({
    email: email,
    password: hashedPassword,
  })
  if (user) {
    return res.status(201).send({ message: 'success' })
  }
  return res.status(404).send({ message: 'failed' })
}

export default handler