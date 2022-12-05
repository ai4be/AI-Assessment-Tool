import Settings from '@/src/components/settings'
import SideBar from '@/src/components/side-bar'
import { UserContextProvider } from '@/src/store/user-context'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'

const PAGE = 'settings'

export default function SettingsPage ({ session }): JSX.Element {
  return (
    <SideBar page={PAGE}>
      <UserContextProvider>
        <Settings />
      </UserContextProvider>
    </SideBar>
  )
}

export async function getServerSideProps (ctx): Promise<any> {
  const session = await unstable_getServerSession(ctx.req, ctx.res, authOptions)

  if (session == null) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }
  return {
    props: {
      session: JSON.parse(JSON.stringify(session))
    }
  }
}
