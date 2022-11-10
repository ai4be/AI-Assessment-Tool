import Login from '@/src/components/login'
import { getSession } from 'next-auth/react'

export default function LoginPage ({ session }) {
  return (<Login></Login>)
}

export async function getServerSideProps (context) {
  const session = await getSession(context)

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
