import WelcomeScreen from '@/src/components/welcome-screen'
import { getSession } from 'next-auth/react'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default WelcomeScreen

export async function getServerSideProps (context: any): Promise<any> {
  const session = await getSession(context)

  if (session?.user != null) {
    return {
      redirect: {
        destination: '/home',
        permanent: false
      }
    }
  }

  return {
    props: {
      session,
      ...await serverSideTranslations(context.locale as string, ['welcome', 'buttons', 'navbar', 'api-messages'])
    }
  }
}
