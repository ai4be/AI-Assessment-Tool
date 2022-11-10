import SignUp from '@/src/components/signup'
import { verifyEmail } from '@/src/slices/user'
import verifyToken from '@/util/verify-token'
import { getSession } from 'next-auth/react'

export default function SignUpPage ({ session }) {
  return (<SignUp></SignUp>)
}

export async function getServerSideProps (ctx) {
  const session = await getSession(ctx)
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
