import ResetPassword from '@/src/components/reset-password'
import { TokenType, getToken, isTokenExpired } from '@/util/token'
import { getSession } from 'next-auth/react'
import { setup } from '@/util/csrf'

export default function Page (props: any): JSX.Element {
  return (<ResetPassword {...props} />)
}

export const getServerSideProps = setup(async (ctx): Promise<any> => {
  const session = await getSession()
  const { token } = ctx.query
  const dbToken = token != null ? await getToken({ token, type: TokenType.RESET_PASSWORD }) : null
  let message: any = null
  if (dbToken != null && isTokenExpired(dbToken)) message = 'Token expired. please request a new one.'

  const props: any = { session, message }
  props.token = dbToken == null ? null : (token ?? null)

  return {
    props
  }
})
