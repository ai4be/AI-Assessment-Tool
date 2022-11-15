import Settings from '@/src/components/settings'
import SideBar from '@/src/components/side-bar'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'

const PAGE = 'settings'

export default function SettingsPage ({ session }): JSX.Element {
  return (
    <SideBar page={PAGE}>
      <Settings />
    </SideBar>
  )
}

export async function getServerSideProps (context): Promise<any> {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

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
