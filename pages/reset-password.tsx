import ResetPassword from '@/src/components/reset-password'
import { TokenType, getToken, isTokenExpired } from '@/src/models/token'
import { getSession } from 'next-auth/react'
import { setup } from '@/util/csrf'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function Page (props: any): JSX.Element {
  return (<ResetPassword {...props} />)
}

export const getServerSideProps = setup(async (ctx: any): Promise<any> => {
  const session = await getSession()
  const { token } = ctx.query
  const dbToken = token != null ? await getToken({ token, type: TokenType.RESET_PASSWORD }) : null
  let message: any = null
  if (dbToken != null && isTokenExpired(dbToken)) message = 'Token expired. please request a new one.'

  const props: any = { session, message }
  props.token = dbToken == null ? null : (token ?? null)

  return {
    props: {
      props,
      ...await serverSideTranslations(ctx.locale as string, ['reset-password', 'buttons', 'validations', 'exceptions', 'placeholders', 'api-messages'])
    }
  }
})
