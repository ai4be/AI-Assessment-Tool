import NextAuth, { NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { verifyPassword } from '@/util/auth'
import { connectToDatabase } from '@/util/mongodb'

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      async authorize (credentials: any, req) {
        // Check any field is empty
        if (!credentials.email || !credentials.password) throw new Error('email or password is missing')

        const { client } = await connectToDatabase()
        const usersCollection = client.db().collection('users')
        const user = await usersCollection.findOne({
          email: credentials.email
        })

        if (!user) throw new Error('Wrong credentials')

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        )
        if (!isValid) throw new Error('Wrong credentials')

        return { email: user.email }
      }
    })
  ],
  secret: process.env.JWT_SECRET_KEY
}

export default NextAuth(authOptions)
