import Login from '@/src/components/login'
import { getSession } from 'next-auth/react'

export default function LoginPage ({ session }): JSX.Element {
  return (<Login />)
}

export async function getServerSideProps (ctx): Promise<any> {
  const session = await getSession()

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
