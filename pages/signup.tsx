import SignUp from '@/src/components/signup'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'
import sanitize from 'mongo-sanitize'
import { getUser } from '@/src/models/user'
import { getToken, TokenStatus } from '@/src/models/token'

export default function SignUpPage ({ session }): JSX.Element {
  return (<SignUp />)
}

export async function getServerSideProps (ctx): Promise<any> {
  const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions)
  let { token, email, projectId } = ctx.query
  email = sanitize(String(email).trim().toLowerCase())
  projectId = sanitize(projectId)
  token = sanitize(token)
  if (token && email && projectId) {
    // If token is invalid then redirect to error page
    const tokenValue = token != null ? await getToken({ token }) : null
    if (!tokenValue || tokenValue?.status !== TokenStatus.PENDING) {
      return {
        redirect: {
          destination: '/signup',
          permanent: false
        }
      }
    }

    // If the invited user is a registered user
    const isExistingUser = await getUser({ email })

    if (isExistingUser != null) {
      return {
        redirect: {
          destination: `/login?token=${token}&email=${email}&projectId=${projectId}`,
          permanent: false
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
