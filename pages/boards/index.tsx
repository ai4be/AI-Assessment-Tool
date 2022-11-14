import Boards from '@/src/components/boards'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../api/auth/[...nextauth]'
import SideBar from '@/src/components/side-bar'
import useSWR from 'swr'

const fetcher = url => fetch(url).then(r => r.json())

function BoardsPage ({ session }) {
  const { data, error } = useSWR('/api/boards', fetcher)
  return (
    <SideBar page={'boards'}>
      <Boards boards={data || []} />
    </SideBar>
  )
}

export async function getServerSideProps (context) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)

  if (!session) {
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

export default BoardsPage
