import NextAuth, { NextAuthOptions, User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { verifyPassword } from '@/util/auth'
import { connectToDatabase } from '@/util/mongodb'
import { invitedUserHandler } from '@/util/token'
import sanitize from 'mongo-sanitize'
import { getUser } from '@/util/user'

const authorize: any = async (credentials: any, req): Promise<User | null> => {
  // Check any field is empty
  if (!credentials.email || !credentials.password) throw new Error('email or password is missing')
  const email = sanitize(credentials.email.trim().toLowerCase())
  const { token } = req.body
  const user = await getUser({ email }, [])

  if (user == null) throw new Error('Wrong credentials')

  const isValid = await verifyPassword(
    credentials.password, // don't need to sanitize because it's hashed
    user?.password ?? ''
  )
  if (!isValid) throw new Error('Wrong credentials')
  if (token != null) await invitedUserHandler(sanitize(token), email)
  return { email: user.email, id: user._id }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      authorize
    })
  ],
  secret: process.env.JWT_SECRET_KEY
}

export default NextAuth(authOptions)
