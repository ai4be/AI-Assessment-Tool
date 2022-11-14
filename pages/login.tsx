import Login from '@/src/components/login'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'

export default function LoginPage ({ session }) {
  return (<Login></Login>)
}

export async function getServerSideProps (ctx) {
  const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions)

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
