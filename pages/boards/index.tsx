import Boards from '@/src/components/boards'
import { getSession } from 'next-auth/react'
import SideBar from '@/src/components/side-bar'
import useSWR from 'swr'

function BoardsPage ({ session }) {
  const { data, error } = useSWR('/api/boards')
  console.log(data, error)
  return (
    <SideBar page={'boards'}>
      <Boards />
    </SideBar>
  )
}

export async function getServerSideProps (context) {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    }
  }

  return {
    props: { session }
  }
}

export default BoardsPage
