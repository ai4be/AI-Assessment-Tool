import Templates from '@/src/components/templats'
import SideBar from '@/src/components/side-bar'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]'

const PAGE = 'templates'

export default function TemplatesPage ({ session }): JSX.Element {
  return (
    <SideBar page={PAGE}>
      <Templates />
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
