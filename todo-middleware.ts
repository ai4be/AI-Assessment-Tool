// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { connectToDatabase } from '@/src/models/mongodb'
import { withAuth } from 'next-auth/middleware'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware (req: NextRequest): Promise<NextResponse> {
    console.log('middleware', (req as any).nextauth.token)
    // const { client } = await connectToDatabase()
    // if (!client.isConnected()) return NextResponse.redirect('/error')
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log('token', token)
        return true
      }
    },
    secret: authOptions.secret
  }
)

// Supports both a single string value or an array of matchers
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|favicon.ico).*)'
  ]
}
