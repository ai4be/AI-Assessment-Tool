import SignUp from '@/src/components/signup'
import verifyEmail from '@/util/verify-email'
import verifyToken from '@/util/verify-token'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'

export default function SignUpPage ({ session }) {
  return (<SignUp></SignUp>)
}

export async function getServerSideProps (ctx) {
  const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions)
  const { token, email, boardId } = ctx.query
  if (token && email && boardId) {
    // If token is invalid then redirect to error page
    const isTokenValid = await verifyToken(ctx)

    if (!isTokenValid) {
      return {
        redirect: {
          destination: '/error',
          permanent: false,
        }
      }
    }

    // If the invited user is a registered user
    const isExistingUser = await verifyEmail(ctx)

    if (isExistingUser) {
      return {
        redirect: {
          destination: `/login?token=${token}&email=${email}&boardId=${boardId}`,
          permanent: false,
        }
      }
    }
  }

  if (session != null) {
    return {
      redirect: {
        destination: '/home',
        permanent: false
      }
    }
  }

  return {
    props: { session }
  }
}
