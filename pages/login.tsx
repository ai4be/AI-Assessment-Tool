import Login from '@/src/components/login'
import { getSession } from 'next-auth/react'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
    props: {
      session,
      ...await serverSideTranslations(ctx.locale as string, ['buttons', 'placeholders', 'validations', 'exceptions', 'login', 'links', 'api-messages'])
    }
  }
}
