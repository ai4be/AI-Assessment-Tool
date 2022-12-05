import WelcomeScreen from '@/src/components/welcome-screen'
import { getSession } from 'next-auth/react'

export default WelcomeScreen

export async function getServerSideProps (context): Promise<any> {
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
